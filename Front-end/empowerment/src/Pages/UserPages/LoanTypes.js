import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../Components/UserNavbar';

const LoanTypeCards = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canApply, setCanApply] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      setError('❌ No access token found. Please log in.');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`${API_URL}/loan-types/`, config)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setLoanTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch loan types:', err);
        setError('❌ Failed to load loan types.');
        setLoading(false);
      });
  }, [API_URL, token]);

  useEffect(() => {
    if (!token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchApplicantStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/applicants/me/`, config);
        const applicant = res.data;

        if (applicant.is_verified_by_sheha && applicant.is_verified_by_bank) {
          setCanApply(true);
          setMessage('✅ Your application is verified by Sheha and Bank. You may apply for a loan.');
        } else if (!applicant.is_verified_by_sheha) {
          setCanApply(false);
          setMessage('❌ You must be verified by Sheha before applying for a loan.');
        } else if (!applicant.is_verified_by_bank) {
          setCanApply(false);
          setMessage('❌ Your application is pending or rejected by the Bank. Please wait or contact support.');
        } else {
          setCanApply(false);
          setMessage('❌ Your verification status is incomplete. Please check with Sheha or Bank.');
        }
      } catch (error) {
        setCanApply(false);
        setMessage('❌ Error fetching applicant verification status.');
        console.error(error);
      }
    };

    fetchApplicantStatus();
  }, [token, API_URL]);

  const handleSelect = (loanType) => {
    if (!canApply) {
      alert('❌ You are not eligible to apply for a loan yet.');
      return;
    }

    navigate('/apply', {
      state: {
        loanTypeId: loanType.id,
        loanTypeName: loanType.name,
        maxAmount: loanType.max_amount,
      },
    });
  };

  if (loading) return <p className="text-center mt-4">Loading loan types...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <>
      <UserNavbar />
      <div className="max-w-3xl mx-auto mt-4 px-4 text-center">
        <p className={`font-semibold ${canApply ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loanTypes.map((loanType) => (
          <div
            key={loanType.id}
            onClick={() => handleSelect(loanType)}
            className={`cursor-pointer p-6 border rounded-lg shadow ${
              canApply ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
            } transition`}
          >
            <h3 className="text-xl font-semibold mb-2">{loanType.name}</h3>
            <p className="text-gray-700">
              Max: {parseFloat(loanType.max_amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoanTypeCards;
