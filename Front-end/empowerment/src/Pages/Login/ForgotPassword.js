import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/forgot-password/', { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reset link');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link
        </p>
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Send Reset Link
        </button>
        <div className="text-center mt-4">
          <a href="/" className="text-blue-500 hover:underline text-sm">
            ← Back to Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
