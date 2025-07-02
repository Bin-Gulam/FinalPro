// components/UserNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar = () => (
 <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
  <div>
    <img src="../../../images/logo.png" alt="MetroRide Logo" className="h-10 w-auto" />
  </div>
  <div className="space-x-6 flex justify-center">
    <Link to="/user-dashboard" className="hover:underline">Home</Link>
    <Link to="/contact-us" className="hover:underline">Contact Us</Link>
    <Link to="/about-us" className="hover:underline">About Us</Link>
  </div>
  <div>
    <button
      className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-white transition-transform transform hover:translate-x-1 hover:scale-105"
      onClick={() => window.location.href = '/apply_loan'}>Apply Now</button>
  </div>
</nav>
);

export default UserNavbar;
