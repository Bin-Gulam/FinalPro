import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    try {
      const response = await axios.post(`${API_BASE_URL}/users/`, formData);
  
      // Extract and store tokens
      const { access, refresh, user } = response.data;
  
      // Save tokens to localStorage (or cookies if you prefer)
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Optionally redirect
      setMessage('Account created and successful!');
      // e.g., navigate('/dashboard'); // If using useNavigate from react-router-dom
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'string'
        ? errorData
        : Object.values(errorData).flat().join(' ');
      setError(errorMessage || 'Error creating account');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">

        {/* Logo */}
        <div className="flex justify-center">
          <img src="../../../images/logo.png" alt="Logo" className="w-20 h-20 mb-3 rounded-full shadow-md" />
        </div>

        {/* Form Title */}
        <h2 className="text-2xl font-bold text-center">Create Account Here!</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-blue-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center">
          <Link to="/" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
