import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Components/AdminNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

const API_URL = process.env.REACT_APP_API_URL;

const ApprovedLoanApplications = () => {
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

        const approved = dataArray.filter(app => app.decision?.toLowerCase() === 'approved');

        setApplications(approved);
        setError('');
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Imeshindikana kupakua maombi ya mkopo.');
      }
    };

    fetchApplications();
  }, []);

  const downloadCSV = (data) => {
    const headers = [
      'Applicant',
      'Ward',
      'Business Name',
      'Business Location',
      'Loan Type',
      'Amount Requested',
      'Sheha Name'
    ];

    const rows = data.map(app => [
      app.applicant?.name || 'Haijajazwa',
      app.applicant?.ward || 'Haijajazwa',
      app.business?.name || 'Haijajazwa',
      app.business?.location || 'Haijajazwa',
      app.loan_type_name || 'Haijajazwa',
      app.amount_requested || 'Haijajazwa',
      app.sheha_name || 'Haijajazwa'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'approved_loans_report.csv');
    link.click();
  };

  const generatePDF = () => {
  const doc = new jsPDF();

  doc.text('Ripoti ya Mikopo Iliyo Kubaliwa', 105, 20, null, null, 'center');

  const tableColumn = [
    'Applicant', 'Ward', 'Business', 'Location',
    'Loan Type', 'Amount', 'Sheha'
  ];

  const tableRows = applications.map(app => [
    app.applicant?.name || 'Haijajazwa',
    app.applicant?.ward || 'Haijajazwa',
    app.business?.name || 'Haijajazwa',
    app.business?.location || 'Haijajazwa',
    app.loan_type_name || 'Haijajazwa',
    app.amount_requested?.toLocaleString() || 'Haijajazwa',
    app.sheha_name || 'Haijajazwa'
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 9 }
  });

  doc.save(`approved_loans_${new Date().toISOString().split('T')[0]}.pdf`);
};

  return (
    <>
      <AdminNavbar />
      <div className="p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Orodha ya Maombi ya Mikopo Iliyo Kubaliwa</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4 flex justify-between">
          <button
            onClick={() => downloadCSV(applications)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Pakua CSV
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Pakua PDF
          </button>
        </div>

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
              <th className="border px-4 py-2">Sheha Name</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Hakuna maombi ya mkopo yaliyokubaliwa.
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
                  <td className="border px-4 py-2">{app.sheha_name || 'Haijajazwa'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApprovedLoanApplications;
