import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Empowerment</h2>
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
        <li><Link to="/loan-stats" className="hover:text-yellow-400">Loan Stats</Link></li>
      </ul>
    </div>
  );
}
