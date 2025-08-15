import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/card';
import { LoginButton } from '@/features/auth';
import { useAuthContext } from '@/features/auth/context/auth';
import { Navigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { isAuthorized } = useAuthContext();

  if (isAuthorized) {
    return <Navigate to={'/app'} replace />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Welcome!</CardTitle>
          <CardDescription>
            Sign in to your account to get started with managing your projects
            and tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
};
