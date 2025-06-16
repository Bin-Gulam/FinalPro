import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    status: '',
    application_date: '',
    approval_date: '',
    business: '',
    loan_officer: '',
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [canApply, setCanApply] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  useEffect(() => {
    if (!token) return;

    const fetchApplicantStatus = async () => {
      try {
        // Adjust endpoint if your backend provides current applicant info at /applicants/me or /applicants/<id>
        const res = await axios.get(`${API_URL}/applicants/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const applicant = res.data;

        if (applicant.is_verified_by_sheha && applicant.is_verified_by_bank) {
          setCanApply(true);
          setNotification({
            show: true,
            message: 'Your application is verified by Sheha and Bank. You may apply for a loan.',
            type: 'success',
          });
        } else if (!applicant.is_verified_by_sheha) {
          setCanApply(false);
          setNotification({
            show: true,
            message: 'You must be verified by Sheha before applying for a loan.',
            type: 'error',
          });
        } else if (!applicant.is_verified_by_bank) {
          setCanApply(false);
          setNotification({
            show: true,
            message: 'Your application is pending or rejected by the Bank. Please wait or contact support.',
            type: 'error',
          });
        } else {
          setCanApply(false);
          setNotification({
            show: true,
            message: 'Your verification status is incomplete. Please check with Sheha or Bank.',
            type: 'error',
          });
        }
      } catch (err) {
        setNotification({
          show: true,
          message: 'Error fetching applicant status.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantStatus();
  }, [token, API_URL]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showNotification('You must be logged in to apply for a loan.', 'error');
      return;
    }

    try {
      await axios.post(`${API_URL}/loans/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification('Loan application submitted successfully!', 'success');
      setFormData({
        amount: '',
        duration: '',
        status: '',
        application_date: '',
        approval_date: '',
        business: '',
        loan_officer: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to submit loan application.';
      showNotification(errorMsg, 'error');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return canApply ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Loan Application Form</h2>

        {[
          { label: 'Loan Amount', name: 'amount', type: 'number' },
          { label: 'Duration (e.g. 12 months)', name: 'duration', type: 'text' },
          { label: 'Status', name: 'status', type: 'text' },
          { label: 'Application Date', name: 'application_date', type: 'date' },
          { label: 'Approval Date', name: 'approval_date', type: 'date' },
          { label: 'Business ID', name: 'business', type: 'number' },
          { label: 'Loan Officer ID', name: 'loan_officer', type: 'number' },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Submit Application
        </button>

        {notification.show && (
          <div
            className={`mt-4 p-3 rounded-lg text-white font-semibold ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}
      </form>
    </div>
  ) : (
    <div className="text-center mt-10 text-red-600 font-semibold">
      {notification.message || 'You are not allowed to apply at this time.'}
    </div>
  );
};

export default LoanApplicationForm;
