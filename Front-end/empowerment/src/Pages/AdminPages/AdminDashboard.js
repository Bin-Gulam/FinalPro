import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Components/AdminNavbar';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    percentage: 0
  });

  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/loan-applications/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();

        const applications = data.results || data;

        // Count total applications
        const totalApplications = data.count || applications.length;

        // Count approved applications
        const approvedApplications = applications.filter(app =>
          app.decision?.toLowerCase() === 'approved'
        ).length;

        // Count rejected applications
        const rejectedApplications = applications.filter(app =>
          app.decision?.toLowerCase() === 'rejected'
        ).length;

        setStats(prev => ({
          ...prev,
          total: totalApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
          percentage: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
        }));
      } catch (error) {
        console.error('Error fetching loan applications:', error);
      }
    };

    fetchLoanApplications();

    // Keep your existing axios call if needed for other stats (optional)
    axios.get('/api/admin-stats/')
      .then(res => setStats(prev => ({ ...prev, ...res.data })))
      .catch(err => console.error(err));
  }, []);

  const dataLine = [
    { name: 'Jan', applicants: 30 },
    { name: 'Feb', applicants: 45 },
    { name: 'Mar', applicants: 35 },
    { name: 'Apr', applicants: 50 },
  ];

  const dataPie = [
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100">
        {/* Cards */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              onClick={() => navigate('/accepted')}
              className="cursor-pointer bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105"
            >
              <h3 className="text-lg font-semibold">Total Applications</h3>
              <p className="text-3xl text-blue-600">{stats.total}</p>
            </div>
           <div onClick={() => navigate('/accepted')}
           className="cursor-pointer bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold">Beneficiaries</h3>
            <p className="text-3xl text-green-600">{stats.approved}</p>
            </div>

            <div onClick={() => navigate('/rejected')}
           className="cursor-pointer bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold">Rejected</h3>
            <p className="text-3xl text-green-600">{stats.rejected}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold">% Approved</h3>
              <p className="text-3xl text-yellow-600">{stats.percentage}%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-4">Applicants Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dataLine}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applicants" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-4">Approval Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%" cy="50%" outerRadius={80}
                    label dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="text-center text-sm py-4 mt-10 bg-gray-100 border-t">
          &copy; {new Date().getFullYear()} Empowerment Management System. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default AdminDashboard;
