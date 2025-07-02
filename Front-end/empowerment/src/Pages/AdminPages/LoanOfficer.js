import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavbar from '../Components/AdminNavbar';

export default function LoanOfficer() {
  const [officers, setOfficers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    office: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_BASE = `${process.env.REACT_APP_API_URL}/loan-officers/`;

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch officers list
  const fetchOfficers = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE, { headers: getAuthHeaders() });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setOfficers(data);
      setStatusMessage(data.length ? null : 'No loan officers found.');
      setErrorMessage(null);
    } catch (error) {
      setOfficers([]);
      setStatusMessage(null);
      setErrorMessage('Failed to fetch loan officers. Please login.');
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      if (editingId) {
        // Update existing officer
        const res = await axios.put(`${API_BASE}${editingId}/`, formData, { headers: getAuthHeaders() });
        console.log(res.data);  
        setStatusMessage('Loan officer updated successfully.');
      } else {
        // Create new officer
        const res = await axios.post(API_BASE, formData, { headers: getAuthHeaders() });
        console.log(res.data);
        setStatusMessage('Loan officer created successfully.');
      }
      setFormData({
        name: '',
        gender: '',
        age: '',
        office: '',
        email: '',
        phone: '',
        username: '',
        password: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchOfficers();
    } catch (error) {
      setErrorMessage('Failed to submit form. Please check fields and login status.');
    }
  };

  const handleEdit = (officer) => {
    setFormData({
      name: officer.name || '',
      gender: officer.gender || '',
      age: officer.age || '',
      office: officer.office || '',
      email: officer.email || '',
      phone: officer.phone || '',
      username: officer.username || '',
      password: '', // Don't prefill password on edit
    });
    setEditingId(officer.id);
    setShowForm(true);
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert('Invalid officer ID for delete!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this loan officer?')) {
      try {
        await axios.delete(`${API_BASE}${id}/`, { headers: getAuthHeaders() });
        setStatusMessage('Loan officer deleted successfully.');
        setErrorMessage(null);
        fetchOfficers();
      } catch (error) {
        setErrorMessage('Failed to delete loan officer. Please check your login status.');
        setStatusMessage(null);
      }
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Loan Officers</h1>

        {statusMessage && <p className="text-green-600 mb-4">{statusMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

        <div className="mb-4 text-right">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({
                name: '',
                gender: '',
                age: '',
                office: '',
                email: '',
                phone: '',
                username: '',
                password: '',
              });
              setEditingId(null);
              setStatusMessage(null);
              setErrorMessage(null);
            }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FiPlus className="h-5 w-5" /> Add Loan Officer
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="office"
                placeholder="Office"
                value={formData.office}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 rounded"
                required={!editingId} // Require password only on create
                autoComplete="new-password"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingId ? 'Update Loan Officer' : 'Save Loan Officer'}
            </button>
          </form>
        )}

        <div className="bg-white p-6 rounded shadow">
          {officers.length === 0 ? (
            <p>No loan officers found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Age</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Office</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Username</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((officer) => (
                  <tr key={officer.id}>
                    <td className="p-2">{officer.name}</td>
                    <td className="p-2">{officer.age}</td>
                    <td className="p-2">{officer.gender}</td>
                    <td className="p-2">{officer.office}</td>
                    <td className="p-2">{officer.phone}</td>
                    <td className="p-2">{officer.email}</td>
                    <td className="p-2">{officer.username}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(officer)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(officer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
