import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../../services/auth.service';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      const response = await AuthService.login(data.email, data.password);
      
      const { user, accessToken } = response.data;
      
      const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : { name: 'User', permissions: [] };
      
      // Store user and token globally
      setAuth(
        { id: user.id, name: user.firstName || user.name || 'Admin', email: user.email, role: primaryRole.name },
        accessToken,
        primaryRole.permissions || []
      );
      
      // Navigate to dashboard
      navigate('/', { replace: true });
    } catch (error: any) {
      setServerError(error.message || 'Invalid credentials');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email address</label>
        <div className="mt-1">
          <input 
            type="email" 
            {...register('email')}
            placeholder="admin@shobhoday.com"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="mt-1">
          <input 
            type="password" 
            {...register('password')}
            placeholder="••••••••"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input 
            id="remember-me" 
            name="remember-me" 
            type="checkbox" 
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link to="/forgot-password" className="font-medium text-black hover:text-gray-600">
            Forgot password?
          </Link>
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Signing in...
            </span>
          ) : (
            'Sign in to Dashboard'
          )}
        </button>
      </div>
    </form>
  );
};
