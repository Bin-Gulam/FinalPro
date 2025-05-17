import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaUserLock, FaShieldAlt, FaSignInAlt } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage({ text: 'Username and Password are required.', variant: 'danger' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username: username,
        password: password,
      });

      // Store tokens securely
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Also store in sessionStorage for added security (optional)
        sessionStorage.setItem('access_token', response.data.access);
        
        // Set axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Store user data if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      setMessage({ text: 'Login successful! Redirecting...', variant: 'success' });

      // Navigate after success
      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);

      const errMsg =
        error.response?.data?.detail ||
        (error.response?.data?.non_field_errors
          ? error.response.data.non_field_errors[0]
          : 'Login failed. Please check your credentials.');

      setMessage({ text: errMsg, variant: 'danger' });
      
      // Clear any existing tokens on failed login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white w-1/2 p-10">
          <div className="bg-white bg-opacity-20 p-6 rounded-full mb-6">
            <FaUserLock size={80} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Welcome Back!</h3>
          <p className="text-center opacity-80">Please enter your credentials to access your account.</p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <div className="md:hidden mb-4">
              <div className="bg-blue-100 p-3 rounded-full inline-block">
                <FaShieldAlt size={40} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <FaSignInAlt /> Sign In
            </h2>
            <p className="text-gray-500">Enter your details to continue</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`text-center mb-4 p-3 rounded ${
                message.variant === 'danger' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-4 text-sm text-gray-600">
            <p>
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline">
                Sign up
              </button>
            </p>
            <button onClick={() => navigate('/reset-password')} className="text-blue-600 hover:underline mt-1">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;