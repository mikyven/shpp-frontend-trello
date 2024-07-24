import { ReactElement } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export function ProtectedRoute(): ReactElement {
  return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/login" />;
}
