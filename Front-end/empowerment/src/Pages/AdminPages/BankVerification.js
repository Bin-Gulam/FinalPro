import React, { useState } from 'react';
import axios from 'axios';

const BankVerification = () => {
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [loanData, setLoanData] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/bank-loans/verify/${bankAccountNo}`
      );
      setLoanData(response.data);
      setError('');
    } catch (err) {
      setLoanData(null);
      setError('No loan found or error occurred');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Bank Account Verification</h2>
      <input
        type="text"
        placeholder="Enter Bank Account Number"
        value={bankAccountNo}
        onChange={(e) => setBankAccountNo(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={handleVerify} className="bg-blue-600 text-white px-4 py-2 rounded">
        Verify
      </button>

      {loanData && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <p><strong>Applicant:</strong> {loanData.applicant_name}</p>
          <p><strong>Loan Status:</strong> {loanData.loan_status}</p>
          <p><strong>Loan Amount:</strong> {loanData.loan_amount}</p>
          <p><strong>Balance Remaining:</strong> {loanData.balance_remaining}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default BankVerification;
