import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
