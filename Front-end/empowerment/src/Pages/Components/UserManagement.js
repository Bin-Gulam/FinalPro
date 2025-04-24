import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = 'http://localhost:8000/api/users/';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(API_URL)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    });
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      axios
        .put(`${API_URL}${editingUser.id}/`, formData)
        .then(() => {
          fetchUsers();
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      axios
        .post(API_URL, formData)
        .then(() => {
          fetchUsers();
          resetForm();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // don't pre-fill password
      first_name: user.first_name,
      last_name: user.last_name,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`${API_URL}${id}/`)
        .then(() => fetchUsers())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Management</h2>

      {/* User Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {!editingUser && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        )}
        <button type="submit" style={{ marginRight: '10px' }}>
          {editingUser ? 'Update' : 'Add'} <FaPlus />
        </button>
        {editingUser && <button onClick={resetForm}>Cancel</button>}
      </form>

      {/* User List */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Username</th>
            <th>Names</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)} style={{ marginRight: '10px' }}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(u.id)} style={{ color: 'red' }}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
