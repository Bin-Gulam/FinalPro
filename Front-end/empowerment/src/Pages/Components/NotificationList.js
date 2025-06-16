import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Handle paginated or direct array
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setNotifications(data);
        setNotificationCount(data.length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const showTailwindToast = (message, type = 'success') => {
    toast(
      ({ closeToast }) => (
        <div
          className={`flex items-center justify-between p-4 rounded shadow-md text-white ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <span>{message}</span>
          <button onClick={closeToast} className="ml-4 font-bold">×</button>
        </div>
      ),
      { autoClose: 3000, position: 'top-right' }
    );
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/notifications/${id}/${action}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Remove verified/rejected notification from state
      const updated = notifications.filter((n) => n.id !== id);
      setNotifications(updated);
      setNotificationCount(updated.length);

      showTailwindToast(
        `Applicant ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
        'success'
      );
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      showTailwindToast(`Failed to ${action} the applicant.`, 'error');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex justify-center items-center gap-2">
          Notifications
          {notificationCount > 0 && (
            <span className="bg-red-500 text-white text-sm rounded-full px-3 py-0.5">
              {notificationCount}
            </span>
          )}
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading notifications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">
            No notifications found for your account. If you're a Sheha, ensure your account is linked.
          </p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="border-l-4 border-blue-500 bg-blue-50 px-4 py-4 rounded shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-800">
                  Name: {notification.name}
                </p>
                <p className="text-gray-700">Village: {notification.village}</p>

                {notification.passport_size && (
                  <div className="my-2">
                    <p className="text-gray-700 mb-1 font-semibold">Passport Photo:</p>
                    <img
                      src={notification.passport_size}
                      alt="Passport"
                      className="w-24 h-24 object-cover border rounded"
                    />
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Received: {notification.created_at
                    ? new Date(notification.created_at).toLocaleString()
                    : 'Unknown time'}
                </p>

                <p className="mt-4 text-gray-800 font-medium">
                  <b>Je! unamfahamu na yupo katika shehia yako?</b>
                </p>

                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => handleAction(notification.id, 'verify')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    <HiCheckCircle className="w-5 h-5" />
                    Verify
                  </button>

                  <button
                    onClick={() => handleAction(notification.id, 'reject')}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    <HiXCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Notifications;
