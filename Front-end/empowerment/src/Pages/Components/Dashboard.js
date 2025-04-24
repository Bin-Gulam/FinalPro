import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

export default function DashboardWithSidebar() {
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/loan-stats/')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching loan stats:', err));
  }, []);

  const pending = stats.total - stats.accepted - stats.rejected;

  const cards = [
    { title: 'Total Applicants', value: stats.total, color: 'bg-blue-500' },
    { title: 'Accepted Loans', value: stats.accepted, color: 'bg-green-500' },
    { title: 'Rejected Loans', value: stats.rejected, color: 'bg-red-500' },
    { title: 'Pending Loans', value: pending, color: 'bg-yellow-500' },
  ];

  const chartData = [
    { name: 'Accepted', value: stats.accepted },
    { name: 'Rejected', value: stats.rejected },
    { name: 'Pending', value: pending },
  ];

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/logout/');
      alert(response.data.message);
      navigate('/');  
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-8">Empowerment</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-left hover:text-red-500 focus:outline-none"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 bg-gray-100">
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow-lg text-white ${card.color} transition-transform hover:scale-105`}
            >
              <h3 className="text-lg font-medium">{card.title}</h3>
              <p className="text-4xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Loan Application Breakdown</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
