import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Login/SignUp';
import ResetPassword from './Pages/Login/ResetPassword';
import Dashboard from './Pages/Components/Dashboard';
import ApplicationForm from './Pages/Components/ApplicationForm';
import ShehaManager from './Pages/Components/ShehaManagement';
import DashboardLayout from './Pages/Components/DashboardLayout'; 
import NotificationList from './Pages/Components/NotificationList.js';
import LoanApplicationForm from './Pages/Components/LoanApplicationForm.js';
import LoanOfficer from './Pages/Components/LoanOfficer.js';
import BankVerification from './Pages/Components/BankVerification.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Protected Routes (With Sidebar Layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/apply_loan" element={<ApplicationForm />} />
          <Route path="applications" element={<LoanApplicationForm/>}/>
          <Route path="/shehas" element={<ShehaManager />} />
          <Route path='/loanOfficer' element={<LoanOfficer/>}/>
          <Route path='bankverification' element={<BankVerification/>}/>
          <Route path="/notification" element={<NotificationList/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
