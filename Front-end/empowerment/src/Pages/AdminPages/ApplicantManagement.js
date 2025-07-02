import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PencilSquareIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import AdminNavbar from '../Components/AdminNavbar';

const API_URL = process.env.REACT_APP_API_URL;

export default function ApplicantManagement() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Unauthorized: No access token found');

      const headers = { Authorization: `Bearer ${token}` };

      const [applicantRes, businessRes] = await Promise.all([
        axios.get(`${API_URL}/applicants/`, { headers }),
        axios.get(`${API_URL}/businesses/`, { headers }),
      ]);

      const applicantList = Array.isArray(applicantRes.data)
        ? applicantRes.data
        : applicantRes.data.results || [];

      const businessList = Array.isArray(businessRes.data)
        ? businessRes.data
        : businessRes.data.results || [];

      const businessMap = new Map();
      businessList.forEach((b) => {
        if (b.applicant) businessMap.set(b.applicant, b);
      });

      const mergedData = applicantList.map((app) => ({
        ...app,
        business: businessMap.get(app.id) || null,
      }));

      setApplicants(mergedData);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to fetch applicants.');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleDelete = async (id) => {
    if (!id) {
      alert('Invalid applicant ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${API_URL}/applicants/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchApplicants();
      } catch (error) {
        console.error('Error deleting applicant:', error);
        alert('Failed to delete applicant.');
      }
    }
  };

  const handleEdit = (applicant) => {
    alert(`Edit feature for applicant ID ${applicant.id} not implemented.`);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    const logoPath = `${window.location.origin}/logo192.png`;
    const img = new Image();
    img.src = logoPath;

    img.onload = () => {
      // Add logo
      doc.addImage(img, 'PNG', 14, 10, 30, 30);

      // Title and Date
      doc.setFontSize(16);
      doc.text('Applicant Report', 105, 20, null, null, 'center');

      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Date: ${currentDate}`, 160, 35);

      // Table
      const tableData = applicants.map((app, index) => [
        index + 1,
        app.name,
        app.age,
        app.gender,
        app.phone,
        app.business?.name || 'N/A',
        app.business?.location || 'N/A',
        app.business?.income || 'N/A',
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['#', 'Name', 'Age', 'Gender', 'Phone', 'Business Name', 'Location', 'Income']],
        body: tableData,
        margin: { top: 10 },
      });

      // Footer page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
          align: 'center',
        });
      }

      const filename = `applicant_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
    };

    img.onerror = () => {
      alert('Failed to load logo image. Make sure "logo192.png" is in the public/ folder.');
    };
  };

  return (
    <>
    <AdminNavbar/>
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applicant Management</h1>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Generate Report</span>
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading applicants...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : applicants.length === 0 ? (
        <p className="text-center text-gray-500">No applicants found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Age</th>
                <th className="p-2 text-left">Gender</th>
                <th className="p-2 text-left">Marital Status</th>
                <th className="p-2 text-left">Region</th>
                <th className="p-2 text-left">District</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Business Name</th>
                <th className="p-2 text-left">Business Location</th>
                <th className="p-2 text-left">Monthly Income</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="p-2">{app.name}</td>
                  <td className="p-2">{app.age}</td>
                  <td className="p-2">{app.gender}</td>
                  <td className="p-2">{app.marital_status || 'N/A'}</td>
                  <td className="p-2">{app.region || 'N/A'}</td>
                  <td className="p-2">{app.district || 'N/A'}</td>
                  <td className="p-2">{app.phone}</td>
                  <td className="p-2">{app.business?.name || 'N/A'}</td>
                  <td className="p-2">{app.business?.location || 'N/A'}</td>
                  <td className="p-2">{app.business?.income || 'N/A'}</td>
                  <td className="p-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(app)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label={`Edit applicant ${app.name}`}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete applicant ${app.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
