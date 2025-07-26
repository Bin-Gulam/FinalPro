import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import UserNavbar from '../Components/UserNavbar';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    applicant: '',
    business: '',
    amount_requested: '',
    purpose: '',
    repayment_period: '',
    who_are_your_customers: '',
    current_customers: '',
    new_customers_per_month: '',
    monthly_sales: '',
    monthly_expenses: '',
    expenses: [],
  });

  const [expenseItem, setExpenseItem] = useState({ item: '', description: '', amount: '' });
  const [applicants, setApplicants] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      setMessage('❌ No access token found. Please log in.');
      setLoading(false);
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get(`${API_URL}/applicants/`, config)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setApplicants(data);
      })
      .catch(err => {
        console.error('Failed to load applicants', err);
        setApplicants([]);
      });

    axios.get(`${API_URL}/businesses/`, config)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setBusinesses(data);
      })
      .catch(err => {
        console.error('Failed to load businesses', err);
        setBusinesses([]);
      });

    setMessage('✅ You may apply for a loan.');
    setLoading(false);
  }, [token, API_URL]);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = e => {
    setExpenseItem({ ...expenseItem, [e.target.name]: e.target.value });
  };

  const addExpense = () => {
    const amount = parseFloat(expenseItem.amount || 0);
    const currentTotal = formData.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const requestedAmount = parseFloat(formData.amount_requested || 0);

    if (currentTotal + amount > requestedAmount) {
      setMessage(`❌ Total expenses (${currentTotal + amount}) exceed requested amount (${requestedAmount}).`);
      return;
    }

    if (expenseItem.item && expenseItem.amount) {
      setFormData(prev => ({
        ...prev,
        expenses: [...prev.expenses, { ...expenseItem, amount }],
      }));
      setExpenseItem({ item: '', description: '', amount: '' });
      setMessage('');
    }
  };

  const removeExpense = idx => {
    const updated = [...formData.expenses];
    updated.splice(idx, 1);
    setFormData({ ...formData, expenses: updated });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const totalExpenses = formData.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const requestedAmount = parseFloat(formData.amount_requested || 0);

    if (totalExpenses > requestedAmount) {
      setMessage(`❌ Total expenses (${totalExpenses}) exceed requested loan amount (${requestedAmount}).`);
      return;
    }

    if (!token) {
      setMessage('❌ You must be logged in to submit the application.');
      return;
    }

    const payload = {
      ...formData,
      amount_requested: parseFloat(formData.amount_requested),
      repayment_period: parseInt(formData.repayment_period, 10),
    };

    axios.post(`${API_URL}/loan-applications/`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessage('✅ ' + (res.data.system_comment || 'Application submitted successfully!')))
      .catch((error) => {
        if (error.response) {
          console.error("Backend validation error:", error.response.data);
          setMessage('❌ ' + JSON.stringify(error.response.data));
        } else {
          console.error("Axios error:", error.message);
          setMessage('❌ Error submitting application.');
        }
      });
  };

  const applicantOptions = applicants.map(app => ({ value: app.id, label: app.name }));
  const businessOptions = businesses.map(biz => ({ value: biz.id, label: biz.name }));

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <UserNavbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Loan Application Form</h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant & Business Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Applicant:</label>
              <Select options={applicantOptions} onChange={opt => setFormData({ ...formData, applicant: opt?.value || '' })} />
            </div>
            <div>
              <label className="block font-medium mb-1">Business:</label>
              <Select options={businessOptions} onChange={opt => setFormData({ ...formData, business: opt?.value || '' })} />
            </div>
          </div>

          {/* Amount & Repayment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="amount_requested" placeholder="Amount Requested" value={formData.amount_requested} onChange={handleInputChange} className="p-2 border rounded w-full" required />
            <input type="number" name="repayment_period" placeholder="Repayment Period (months)" value={formData.repayment_period} onChange={handleInputChange} className="p-2 border rounded w-full" required />
          </div>

          {/* Purpose */}
          <div>
            <label className="block font-semibold mb-1">What is the purpose of the loan?</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Explain why you're requesting this loan"
              required
            />
          </div>

          {/* New Customer-Related Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Who are your customers?</label>
              <input
                type="text"
                name="who_are_your_customers"
                value={formData.who_are_your_customers}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Describe your customer base"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">How many current customers do you have?</label>
              <input
                type="number"
                name="current_customers"
                value={formData.current_customers}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 200"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">How many new customers per month?</label>
              <input
                type="number"
                name="new_customers_per_month"
                value={formData.new_customers_per_month}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 15"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Average monthly sales (TZS)</label>
              <input
                type="number"
                step="0.01"
                name="monthly_sales"
                value={formData.monthly_sales}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 500000.00"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Average monthly expenses (TZS)</label>
              <input
                type="number"
                step="0.01"
                name="monthly_expenses"
                value={formData.monthly_expenses}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 200000.00"
              />
            </div>
          </div>

          {/* Expenses */}
          <div>
            <label className="font-semibold">Add Expense</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input type="text" name="item" placeholder="Item" value={expenseItem.item} onChange={handleExpenseChange} className="p-2 border rounded" />
              <input type="text" name="description" placeholder="Description" value={expenseItem.description} onChange={handleExpenseChange} className="p-2 border rounded" />
              <input type="number" name="amount" placeholder="Amount" value={expenseItem.amount} onChange={handleExpenseChange} className="p-2 border rounded" />
            </div>
            <button type="button" onClick={addExpense} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Add Expense</button>

            <ul className="mt-4">
              {formData.expenses.map((exp, idx) => (
                <li key={idx} className="flex justify-between items-center border p-2 rounded mt-2">
                  <span>{exp.item} - {exp.description} - {exp.amount}</span>
                  <button type="button" className="text-red-600" onClick={() => removeExpense(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700">Submit Application</button>
        </form>
      </div>
    </>
  );
};

export default LoanApplicationForm;
