import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis } from 'recharts';

const Dashboard = () => {
  const stats = [
    { title: 'Total Applicants', value: 1200, color: '#60a5fa' },
    { title: 'Beneficiaries', value: 800, color: '#34d399' },
    { title: 'Rejected', value: 300, color: '#f87171' },
    { title: 'Percentage', value: '66%', color: '#fbbf24' },
  ];

  const barData = [
    { name: '2019', applicants: 500, color: '#f59e0b' },
    { name: '2020', applicants: 700, color: '#10b981' },
    { name: '2021', applicants: 650, color: '#3b82f6' },
    { name: '2022', applicants: 800, color: '#8b5cf6' },
    { name: '2023', applicants: 900, color: '#ef4444' },
  ];

  const pieData = [
    { name: 'Beneficiaries', value: 800 },
    { name: 'Rejected', value: 300 },
  ];

  const COLORS = ['#34d399', '#f87171'];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-10">
        <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-4 rounded-full shadow-md" />
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-700">
          WOMEN AND YOUTH EMPOWERMENT 
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transform transition-all duration-300"
          >
            <p className="text-gray-500 flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: stat.color }}
              ></span>
              {stat.title}
            </p>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color: stat.color }}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Applicants Per Year</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#555"
                  tickFormatter={(value) => {
                    const yearData = barData.find(item => item.name === value);
                    return `${value} (${yearData?.applicants})`;
                  }}
                />
                <Tooltip />
                <Bar dataKey="applicants" radius={[10, 10, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center mt-6 space-x-6">
            {barData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: entry.color }}></span>
                <span className="text-sm text-gray-600">{`${entry.name} (${entry.applicants})`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Beneficiaries vs Rejected</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
