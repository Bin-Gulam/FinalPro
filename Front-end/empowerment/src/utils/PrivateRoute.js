// src/utils/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
