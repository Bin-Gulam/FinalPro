import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        alert('No refresh token found. You are not logged in.');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/logout/`,
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        alert(response.data.message || 'Logged out successfully');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error.response ? error.response.data : error.message);
      alert('Logout failed due to an error.');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg">
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
          <Link to="/apply_loan" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded block">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Apply Loan</span>
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
          className="flex items-center space-x-2 hover:text-red-500 focus:outline-none"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
