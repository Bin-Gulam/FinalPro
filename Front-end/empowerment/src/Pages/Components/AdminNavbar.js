// components/AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => (
  <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
    <div className="text-xl font-bold">Admin Dashboard</div>
    <div className="space-x-6">
      <Link to="/admin-dashboard" className="hover:underline">Home</Link>
      <Link to="/shehas" className="hover:underline">Manage Sheha</Link>
      <Link to="/loanOfficer" className="hover:underline">Manage Loan Officer</Link>
      <Link to="/contact-us" className="hover:underline">Contact Us</Link>
    </div>
  </nav>
);

export default AdminNavbar;
