import React, { useState } from 'react';
import axios from 'axios';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    status: '',
    application_date: '',
    approval_date: '',
    business: '',
    loan_officer: ''
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const API_URL = process.env.REACT_APP_API_URL + '/loans/';
  const token =
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
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
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification('Loan application submitted successfully!', 'success');
      setFormData({
        amount: '',
        duration: '',
        status: '',
        application_date: '',
        approval_date: '',
        business: '',
        loan_officer: ''
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to submit loan application.';
      showNotification(errorMsg, 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Loan Application Form</h2>

        {[
          { label: 'Amount', name: 'amount', type: 'number' },
          { label: 'Duration', name: 'duration', type: 'text' },
          { label: 'Status', name: 'status', type: 'text' },
          { label: 'Application Date', name: 'application_date', type: 'date' },
          { label: 'Approval Date', name: 'approval_date', type: 'date' },
          { label: 'Business ID', name: 'business', type: 'number' },
          { label: 'Loan Officer ID', name: 'loan_officer', type: 'number' }
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
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
  );
};

export default LoanApplicationForm;
