import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function ShehaNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
  const BASE_URL = 'http://localhost:8000';
  const token = localStorage.getItem('access_token');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(res.data.results)) {
        setNotifications(res.data.results);

        // Open passport of first applicant (unverified only) in new tab
        const firstUnverified = res.data.results.find(n => n.passport_size && !n.is_verified_by_sheha);
        if (firstUnverified) {
          window.open(`${BASE_URL}${firstUnverified.passport_size}`, '_blank');
        }

      } else {
        console.error('Unexpected response:', res.data);
        setNotifications([]);
        setError('Unexpected server response.');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Please login again.');
      } else {
        setError('Failed to load notifications.');
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const verifyApplicant = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${id}/verify/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Applicant verified!');
      fetchNotifications();
    } catch (err) {
      alert('Failed to verify applicant.');
      console.error(err);
    }
  };

  const rejectApplicant = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${id}/reject/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Applicant rejected.');
      fetchNotifications();
    } catch (err) {
      alert('Failed to reject applicant.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Sheha Notifications</h2>
      <p style={{ marginBottom: '20px', fontStyle: 'italic', color: '#555' }}>
        Please review the applicants below. If you personally know the applicant, click "Verify Applicant". 
        If not, click "Reject Applicant".
      </p>

      {notifications.length === 0 && <p>No notifications found.</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 15,
            marginBottom: 15,
            backgroundColor: n.is_verified_by_sheha ? '#d4edda' : '#f8d7da',
          }}
        >
          <p><strong>Name:</strong> {n.name}</p>
          <p><strong>Village:</strong> {n.village}</p>
          <p><strong>Verified:</strong> {n.is_verified_by_sheha ? 'Yes' : 'No'}</p>
          {n.passport_size && (
            <a href={`${BASE_URL}${n.passport_size}`} target="_blank" rel="noopener noreferrer">
              <img
                src={`${BASE_URL}${n.passport_size}`}
                alt="Applicant Passport"
                width={120}
                style={{ borderRadius: 4, marginBottom: 10 }}
              />
            </a>
          )}
          {!n.is_verified_by_sheha && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => verifyApplicant(n.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Verify Applicant
              </button>
              <button
                onClick={() => rejectApplicant(n.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Reject Applicant
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
