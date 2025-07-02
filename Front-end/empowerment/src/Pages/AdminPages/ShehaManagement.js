import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import AdminNavbar from '../Components/AdminNavbar';

export default function ShehaManager() {
  const [shehas, setShehas] = useState([]);
 const [formData, setFormData] = useState({
  name: '',
  age: '',
  gender: '',
  ward: '',
  phone: '',
  email: '',
  username: '',
  password: '',
 
});

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_BASE = `${process.env.REACT_APP_API_URL}/shehas/`;

  // Helper function to get Authorization headers with JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch shehas
  const fetchShehas = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: getAuthHeaders(),
      });
      console.log('API response data:', res.data);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setShehas(data);
      setStatusMessage(data.length ? null : 'No Shehas found.');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching Shehas:', error);
      setShehas([]);
      setStatusMessage(null);
      setErrorMessage('Failed to fetch Shehas. Please login.');
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchShehas();
  }, [fetchShehas]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    console.log('Submitting form data:', formData, 'Editing ID:', editingId);
    try {
      if (editingId) {
        // Update existing Sheha
        const res = await axios.put(`${API_BASE}${editingId}/`, formData, {
          headers: getAuthHeaders(),
        });
        console.log('Update response:', res.data);
        setStatusMessage('Sheha updated successfully.');
      } else {
        // Create new Sheha
        const res = await axios.post(API_BASE, formData, {
          headers: getAuthHeaders(),
        });
        console.log('Create response:', res.data);
        setStatusMessage('Sheha created successfully.');
      }
      setFormData({ name: '', age: '', gender: '', ward: '', phone: '', email: '', username:'', password: ''});
      setEditingId(null);
      setShowForm(false);
      fetchShehas();
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      setErrorMessage('Failed to submit form. Please check the fields and your login status.');
    }
  };

  const handleEdit = (sheha) => {
    console.log('Editing sheha:', sheha);
    setFormData({
      name: sheha.name || '',
      age: sheha.age || '',
      gender: sheha.gender || '',
      ward: sheha.ward || '',
      phone: sheha.phone || '',
      email: sheha.email || '',
      username: sheha.username || '',
      password: sheha.password || '',
     
    });
    setEditingId(sheha.id);
    setShowForm(true);
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert('Invalid Sheha ID for delete!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this Sheha?')) {
      try {
        console.log('Deleting sheha ID:', id);
        await axios.delete(`${API_BASE}${id}/`, {
          headers: getAuthHeaders(),
        });
        setStatusMessage('Sheha deleted successfully.');
        setErrorMessage(null);
        fetchShehas();
      } catch (error) {
        console.error('Delete error:', error.response?.data || error.message);
        setErrorMessage('Failed to delete Sheha. Please check your login status.');
        setStatusMessage(null);
      }
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Shehas</h1>

      {statusMessage && <p className="text-green-600 mb-4">{statusMessage}</p>}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ name: '', age: '', gender: '', ward: '', phone: '', email: '', username: '', password:''});
            setEditingId(null);
            setStatusMessage(null);
            setErrorMessage(null);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" /> Add Sheha
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
              name="ward"
              placeholder="Ward"
              value={formData.ward}
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
            required
            />
            <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
            required
            />
          </div>
          <button
            type="submit"
            className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? 'Update Sheha' : 'Save Sheha'}
          </button>
        </form>
      )}

      <div className="bg-white p-6 rounded shadow">
        {shehas.length === 0 ? (
          <p>No Shehas found.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Age</th>
                <th className="p-2">Gender</th>
                <th className="p-2">Ward</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Username</th>
                <th className="p-2">Password</th>               
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shehas.map((sheha) => (
                <tr key={sheha.id}>
                  <td className="p-2">{sheha.name}</td>
                  <td className="p-2">{sheha.age}</td>
                  <td className="p-2">{sheha.gender}</td>
                  <td className="p-2">{sheha.ward}</td>
                  <td className="p-2">{sheha.phone}</td>
                  <td className="p-2">{sheha.email}</td>
                  <th className="p-2">{sheha.username}</th>
                  <th className="p-2">{sheha.password}</th>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(sheha)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sheha.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
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
