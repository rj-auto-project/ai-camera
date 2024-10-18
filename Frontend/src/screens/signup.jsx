import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../api/hooks/useSignup';
import AuthForm from '../components/auth/AuthForm';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();

  const handleSignup = (formData) => {
    signup(formData, {
      onSuccess: () => {
        toast.success('Signup successful!');
        navigate('/dashboard');
      },
      onError: (error) => {
        console.error('Signup failed:', error);
      },
    });
  };

  return (
    <AuthForm
      isLogin={false}
      onSubmit={handleSignup}
      isPending={isPending}
      error={error}
    />
  );
};

export default Signup;