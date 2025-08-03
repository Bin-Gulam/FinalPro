import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../Components/UserNavbar';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const ApplicationForm = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    applicant: {
      name: '', age: '', gender: '', marital_status: '',
      region: '', district: '', ward: '', village: '',
      phone: '', passport_size: null,
      sheha_knows_applicant: false,
      house_number: '', declaration_accepted: false,
    },
    business: {
      name: '', registration_number: '', location: '',
      type: '', anual_income:'', bank_no: '', declaration_accepted: false,
    },
    isSubmitting: false,
    error: null,
    success: false,
  });

  // Hii itachukua lat,lng kutoka POINT(lng lat) format
  const extractLatLng = (point) => {
    if (!point) return null;
    const coords = point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (!coords) return null;
    return {
      lng: parseFloat(coords[1]),
      lat: parseFloat(coords[2]),
    };
  };

 const handleGetLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const point = `POINT(${lng} ${lat})`;

      console.log("📍 Current Coordinates:", { lat, lng });
      console.log("📝 Formatted Location (WKT):", point);

      // Show confirmation to the user
      alert(`Location found:\nLatitude: ${lat}\nLongitude: ${lng}`);

      setState((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          location: point,
        },
      }));
    },
    (error) => {
      console.error("❌ Failed to get location:", error.message);
      alert("Failed to get location: " + error.message);
    },
    {
      enableHighAccuracy: true, // Try to get GPS location instead of IP
      timeout: 10000,           // Max wait 10 seconds
      maximumAge: 0             // Don't use cached location
    }
  );
};


  // Fungua Google Maps kwenye tab mpya kwa kutumia lat/lng
  const openMap = () => {
    const location = state.business.location;
    const coords = extractLatLng(location);

    if (!coords) {
      alert('Location haijasetwa au format si sahihi');
      return;
    }

    const mapUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    window.open(mapUrl, '_blank');
  };

  const handleChange = (formType) => (e) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setState((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        passport_size: e.target.files[0],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.applicant.declaration_accepted) {
      setState((prev) => ({
        ...prev,
        error: 'You must accept the declaration before submitting.',
      }));
      return;
    }

    if (!state.business.location) {
      setState((prev) => ({
        ...prev,
        error: 'Please set your business location using "Use My Current Location" button.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const formData = new FormData();
      Object.entries(state.applicant).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'passport_size') {
          formData.append(key, value);
        }
      });
      if (state.applicant.passport_size) {
        formData.append('passport_size', state.applicant.passport_size);
      }

      // Submit applicant
      const applicantRes = await api.post('/applicants/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Submit business info with applicant ID
      await api.post('/businesses/', {
        ...state.business,
        applicant: applicantRes.data.Applicant_ID,
      });

      setState((prev) => ({ ...prev, success: true }));

      setTimeout(() => {
        navigate('/loan-type');
      }, 3000);
    } catch (error) {
      let msg = 'Failed to submit application.';
      if (error.response?.status === 401) {
        msg = 'Session expired. Please log in again.';
        navigate('/');
      } else if (error.response?.data) {
        const data = error.response.data;
        msg = typeof data === 'object'
          ? Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
          : data;
      }
      setState((prev) => ({ ...prev, error: msg }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const renderInput = (formType, name, label, type = 'text', required = false, extra = {}) => (
    <div>
      <label className="block mb-1">{label}{required && '*'}</label>
      <input
        type={type}
        name={name}
        value={state[formType][name]}
        onChange={handleChange(formType)}
        required={required}
        {...extra}
        className="border rounded w-full p-2"
      />
    </div>
  );

  const renderSelect = (formType, name, label, options, required = false) => (
    <div>
      <label className="block mb-1">{label}{required && '*'}</label>
      <select
        name={name}
        value={state[formType][name]}
        onChange={handleChange(formType)}
        required={required}
        className="border rounded w-full p-2"
      >
        <option value="">Select {label}</option>
        {options.map(([val, text]) => (
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (formType, name, label, required = false) => (
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        name={name}
        checked={state[formType][name]}
        onChange={handleChange(formType)}
        required={required}
        className="mr-2"
      />
      {label}{required && '*'}
    </label>
  );

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10 pb-10">
        <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Apply for a Loan Here!</h1>

          {state.error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded whitespace-pre-line">
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Applicant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {renderInput('applicant', 'name', 'Full Name', 'text', true)}
              {renderInput('applicant', 'age', 'Age', 'number', true, { min: 18 })}
              {renderSelect('applicant', 'gender', 'Gender', [['Male', 'Male'], ['Female', 'Female'], ['Other', 'Other']], true)}
              {renderSelect('applicant', 'marital_status', 'Marital Status', [['Single', 'Single'], ['Married', 'Married'], ['Divorced', 'Divorced'], ['Widowed', 'Widowed']])}
              {renderInput('applicant', 'region', 'Region', 'text', true)}
              {renderInput('applicant', 'district', 'District')}
              {renderInput('applicant', 'ward', 'Ward')}
              {renderInput('applicant', 'village', 'Village')}
              {renderInput('applicant', 'phone', 'Phone Number', 'tel', true)}
              <div>
                <label className="block mb-1">Passport Size Photo*</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-blue-600 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderInput('business', 'name', 'Business Name', 'text', true)}
              {renderInput('business', 'registration_number', 'Business Registration Number')}
              {renderInput('business', 'type', 'Type of Business')}
              {renderInput('business', 'anual_income', 'Annual Income', 'number')}
              {renderInput('business', 'bank_no', 'Bank Account Number')}
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={handleGetLocation}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Use My Current Location
              </button>

              {state.business.location && (
                <>
                  <p className="text-gray-500 mt-2">
                    Location Set: <code>{state.business.location}</code>
                  </p>

                  <button
                    type="button"
                    onClick={openMap}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Location on Google Maps
                  </button>
                </>
              )}
            </div>

            <div className="mb-6">
              {renderCheckbox('applicant', 'declaration_accepted', 'I accept the declaration and confirm the information is true.', true)}
            </div>

            <button
              type="submit"
              disabled={!state.applicant.declaration_accepted || state.isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded ${state.applicant.declaration_accepted && !state.isSubmitting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {state.isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
