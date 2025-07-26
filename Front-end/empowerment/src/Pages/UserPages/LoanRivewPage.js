// LoanReviewPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import UserNavbar from '../Components/UserNavbar';

const LoanReviewPage = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/loan-applications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data.results || response.data;
      data = Array.isArray(data) ? data : [];

      const pending = data.filter(app =>
        !app.decision || app.decision.trim() === '' || app.decision.toLowerCase() === 'pending'
      );

      setApplications(pending);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage('❌ Failed to load applications.');
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDecision = async (id, decision) => {
    try {
      await axios.patch(`${API_URL}/loan-applications/${id}/`, {
        decision,
        system_comment: `Loan Officer manually ${decision}.`,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`✅ Application ${id} marked as ${decision}.`);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      setMessage(`❌ Failed to update application ${id}.`);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">Loan Applications Review</h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {applications.length === 0 ? (
          <p className="text-center text-gray-600">No applications to review.</p>
        ) : (
          <div className="space-y-6">
            {applications.map(app => (
              <div key={app.id} className="border rounded p-5 shadow bg-white space-y-2">
                <p><strong>Applicant Name:</strong> {app.applicant_name || app.applicant?.name || 'N/A'}</p>
                <p><strong>Business Name:</strong> {app.business_name || app.business?.name || app.business?.business_name || 'N/A'}</p>
                <p><strong>Amount Requested:</strong> {app.amount_requested} TZS</p>
                <p><strong>Repayment Period:</strong> {app.repayment_period} months</p>

                <hr className="my-2" />

                <h4 className="font-bold text-blue-600">📄 Business Plan Details</h4>
                <p><strong>Purpose:</strong> {app.purpose}</p>
                <p><strong>Who are your customers?</strong> {app.who_are_your_customers}</p>
                <p><strong>Current Customers:</strong> {app.current_customers}</p>
                <p><strong>New Customers per Month:</strong> {app.new_customers_per_month}</p>
                <p><strong>Monthly Sales (TZS):</strong> {app.monthly_sales}</p>
                <p><strong>Monthly Expenses (TZS):</strong> {app.monthly_expenses}</p>

                {app.plan_attachment && (
                  <p>
                    <strong>Plan Document:</strong>{' '}
                    <a
                      href={app.plan_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      View/Download
                    </a>
                  </p>
                )}

                {app.expenses && app.expenses.length > 0 && (
                  <>
                    <h4 className="font-bold mt-2 text-blue-600">💰 Expenses</h4>
                    <ul className="list-disc ml-6">
                      {app.expenses.map((expense, idx) => (
                        <li key={idx}>
                          <strong>{expense.item}</strong>: {expense.description} – TZS {expense.amount}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleDecision(app.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(app.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LoanReviewPage;
