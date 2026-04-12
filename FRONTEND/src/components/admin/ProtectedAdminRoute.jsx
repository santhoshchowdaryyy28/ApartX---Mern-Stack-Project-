import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}