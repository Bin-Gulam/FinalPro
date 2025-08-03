import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Login/SignUp';
import ResetPassword from './Pages/Login/ResetPassword';
import ApplicationForm from './Pages/UserPages/ApplicationForm.js';
import NotificationList from './Pages/UserPages/NotificationList.js';
import LoanApplicationForm from './Pages/UserPages/LoanApplicationForm.js';
import ApplicantManagement from './Pages/AdminPages/ApplicantManagement.js';
import BankVerification from './Pages/AdminPages/BankVerification.js';
import ShehaManagement from './Pages/AdminPages/ShehaManagement.js'
import LoanOfficer from './Pages/AdminPages/LoanOfficer.js'
import AdminDashboard from './Pages/AdminPages/AdminDashboard.js';
import UserDashboard from './Pages/UserPages/UserDashboard.js';
import LoanReviewPage from './Pages/UserPages/LoanRivewPage.js';
import LoanTypeCards from './Pages/UserPages/LoanTypes.js';
import AcceptedApplicants from './Pages/AdminPages/ApprovedLoanApplications.js';
import RejectedApplications from './Pages/AdminPages/RejectedApplications.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/resetPassword' element={<ResetPassword />} />          

          {/* Admin Pages */}  
          <Route path='admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='accepted' element={<AcceptedApplicants/>}/>
          <Route path='rejected'element={<RejectedApplications/>}/>
          <Route path='applicant_list' element={<ApplicantManagement/>}/>
          <Route path='/shehas' element={<ShehaManagement/>} />
          <Route path='/loanOfficer' element={<LoanOfficer/>}/>
          <Route path='bankverification' element={<BankVerification/>}/>
          <Route path='/notification' element={<NotificationList/>} />

          {/* Applicant Pages */}
          <Route path='user-dashboard' element={<UserDashboard/>}/>
          <Route path='apply' element={<LoanApplicationForm/>}/>
          <Route path='/apply_loan' element={<ApplicationForm/>} />
          <Route path='loan-review' element={<LoanReviewPage/>}/>
          <Route path='loan-type' element={<LoanTypeCards/>}/>
      </Routes>
    </Router>
  );
}

export default App;
