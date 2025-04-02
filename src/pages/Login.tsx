
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Package } from 'lucide-react';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">PricePulse</h1>
        </div>
        <h2 className="text-gray-600">Product Price History Management</h2>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
