import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const ProtectedDoctor = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'doctor') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedDoctor;
