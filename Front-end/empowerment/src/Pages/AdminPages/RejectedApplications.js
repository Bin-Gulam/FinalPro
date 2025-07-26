import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Components/AdminNavbar';

const API_URL = process.env.REACT_APP_API_URL;

const RejectedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${API_URL}/loan-applications/`, { headers });

        const dataArray = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const rejected = dataArray.filter(app => app.decision?.toLowerCase() === 'rejected');

        setApplications(rejected);
        setError('');
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Imeshindikana kupakua maombi yaliyokataliwa.');
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Maombi ya Mikopo Yaliyokataliwa</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Applicant</th>
              <th className="border px-4 py-2">Ward</th>
              <th className="border px-4 py-2">Business Name</th>
              <th className="border px-4 py-2">Business Location</th>
              <th className="border px-4 py-2">Loan Type</th>
              <th className="border px-4 py-2">Amount Requested</th>
              <th className="border px-4 py-2">Reason / Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Hakuna maombi yaliyokataliwa.
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{app.applicant?.name || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.applicant?.ward || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.business?.name || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.business?.location || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.loan_type_name || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.amount_requested?.toLocaleString() || 'Haijajazwa'}</td>
                  <td className="border px-4 py-2">{app.status_note || 'Sababu haijajazwa'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RejectedApplications;
