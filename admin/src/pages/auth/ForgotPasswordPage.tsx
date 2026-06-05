import React, { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../../services/auth.service';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setServerError(null);
      await AuthService.forgotPassword(data.email);
      setSuccess(true);
    } catch (error: any) {
      setServerError(error.message || 'Failed to send reset link');
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          Password reset link sent to your email.
        </div>
        <Link to="/login" className="text-sm font-medium text-black hover:text-gray-600">
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email address and we will send you a secure link to reset your password.
        </p>
      </div>

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
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
        </button>
      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="text-sm font-medium text-black hover:text-gray-600">
          ← Back to login
        </Link>
      </div>
    </form>
  );
};
