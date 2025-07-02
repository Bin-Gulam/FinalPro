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
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log("Access token:", token);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/applicants/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Applicants fetched:", data);

        if (data.results) {
          setStats(prev => ({ ...prev, total: data.count }));
        } else {
          setStats(prev => ({ ...prev, total: data.length }));
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();

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
              onClick={() => navigate('/applicant_list')}
              className="cursor-pointer bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105"
            >
              <h3 className="text-lg font-semibold">Total Applicants</h3>
              <p className="text-3xl text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold">Beneficiaries</h3>
              <p className="text-3xl text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold">Rejected</h3>
              <p className="text-3xl text-red-600">{stats.rejected}</p>
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
