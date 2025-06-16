import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { FiLogOut } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const getRefreshToken = () => {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  };

const handleLogout = async () => {
  const refreshToken = getRefreshToken();
  const accessToken =
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  if (!refreshToken) {
    toast.warning('No refresh token found. You are not logged in.');
    return;
  }

  if (!accessToken) {
    toast.warning('No access token found. You are not logged in.');
    return;
  }

  setLoggingOut(true);
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,  // <-- Add access token here
        },
      }
    );

    if (response.status === 205 || response.status === 200) {
      toast.success(response.data.message || 'Logged out successfully');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      navigate('/');
    } else {
      toast.error('Logout failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during logout:', error.response?.data || error.message);
    toast.error('Logout failed due to an error.');
  } finally {
    setLoggingOut(false);
  }
};

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg z-40">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Dashboard</div>

      <ul className="space-y-4 p-4 flex-1 overflow-y-auto">
        <li>
          <Link to="/home" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to="/shehas" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <UsersIcon className="h-5 w-5" />
            <span>Manage Shehas</span>
          </Link>
        </li>

        <li>
          <Link to="/notification" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <div className="relative">
              <FaBell className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs font-bold bg-red-600 rounded-full text-white">
                3
              </span>
            </div>
            <span>Notifications</span>
          </Link>
        </li>

        <li>
          <Link to="/apply_loan" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Apply Loan</span>
          </Link>
        </li>

 <li>
          <Link to="/applications" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <DocumentTextIcon className="h-5 w-5" />
            <span>LoanForm</span>
          </Link>
        </li>

        <li>
          <Link to="/loanOfficer" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <DocumentTextIcon className="h-5 w-5" />
            <span>LoanOfficer</span>
          </Link>
        </li>

        <li>
          <Link to="/settings" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <CogIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`flex items-center space-x-2 focus:outline-none ${
            loggingOut ? 'text-gray-400 cursor-not-allowed' : 'hover:text-red-500'
          }`}
        >
          <FiLogOut size={20} />
          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
