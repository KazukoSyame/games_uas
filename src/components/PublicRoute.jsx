import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  return !userId ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
