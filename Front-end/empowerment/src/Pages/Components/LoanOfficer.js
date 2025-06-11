import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const LoanOfficer = () => {
  const [officers, setOfficers] = useState([]);
  const [form, setForm] = useState({ name: '', gender: '', age: '', office: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null); // null for Add mode, otherwise Edit
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      const API_URL = process.env.REACT_APP_API_URL + '/loan-officers/';

      if (!token) {
        setError('You must be logged in as admin.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.results || res.data;
        if (Array.isArray(data)) setOfficers(data);
        else setError('Unexpected response format.');
      } catch (err) {
        setError('You are not authorized or something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setForm({ name: '', gender: '', age: '', office: '', email: '', phone: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (officer) => {
    setForm({ ...officer });
    setEditingId(officer.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL + '/loan-officers/' + (editingId ? `${editingId}/` : '');
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (editingId) {
        setOfficers((prev) =>
          prev.map((item) => (item.id === editingId ? res.data : item))
        );
      } else {
        setOfficers((prev) => [...prev, res.data]);
      }

      setShowForm(false);
      setForm({ name: '', gender: '', age: '', office: '', email: '', phone: '' });
      setEditingId(null);
    } catch (err) {
      alert('Failed to save officer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/loan-officers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOfficers((prev) => prev.filter((officer) => officer.id !== id));
    } catch {
      alert('Failed to delete officer.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Loan Officers</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FiPlus className="mr-2" /> {editingId ? 'Edit Officer' : 'Add Officer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow mb-6 grid gap-4 md:grid-cols-2">
          {['name', 'gender', 'age', 'office', 'email', 'phone'].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className="border p-2 rounded"
            />
          ))}
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingId ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
      )}

      {!error && !loading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {officers.map((officer) => (
            <div key={officer.id} className="relative bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition">
              <div className="absolute top-2 right-2 flex space-x-2">
                <FiEdit
                  onClick={() => handleEditClick(officer)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                />
                <FiTrash2
                  onClick={() => handleDelete(officer.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{officer.name}</h3>
              <p><strong>Gender:</strong> {officer.gender}</p>
              <p><strong>Age:</strong> {officer.age}</p>
              <p><strong>Office:</strong> {officer.office}</p>
              <p><strong>Email:</strong> {officer.email}</p>
              <p><strong>Phone:</strong> {officer.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanOfficer;
