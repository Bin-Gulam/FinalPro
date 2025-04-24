import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/Login/ForgotPassword';
import SignUp from './Pages/Login/SignUp';
import Dashboard from './Pages/Components/Dashboard';
import Sidebar from './Pages/Components/SideBar';
import UserManagement from './Pages/Components/UserManagement';
import ResetPassword from './Pages/Login/ResertPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<SignUp/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/resertPassword' element={<ResetPassword/>}/>
        <Route path='/user' element={<UserManagement/>}/>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/sidebar' element={<Sidebar/>}/>
      </Routes>
    </Router>
  );
}

export default App;




// import React from 'react';
// import Login from './Pages/Login/Login';

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;
