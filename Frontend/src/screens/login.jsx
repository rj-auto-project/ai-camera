import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/hooks/useLogin';
import toast from 'react-hot-toast';
import AuthForm from '../components/auth/AuthForm';

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = (formData) => {
    login(formData, {
      onSuccess: () => {
        toast.success('Login successful!');
        navigate('/dashboard/map');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <AuthForm
      isLogin={true}
      onSubmit={handleLogin}
      isPending={isPending}
      error={error}
    />
  );
};

export default Login;