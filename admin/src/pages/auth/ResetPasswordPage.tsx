import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../../services/auth.service';
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      setServerError('Reset token is missing from the URL.');
      return;
    }
    try {
      setServerError(null);
      await AuthService.resetPassword(token, data.password);
      // Navigate to login after successful reset
      navigate('/login', { state: { message: 'Password reset successful. You can now log in.' } });
    } catch (error: any) {
      setServerError(error.message || 'Failed to reset password');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Set new password</h3>
        <p className="text-sm text-gray-500 mt-2">
          Your new password must be at least 8 characters long.
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
          {serverError}
        </div>
      )}
      
      {!token && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm mb-4 border border-yellow-100">
          Warning: Missing reset token in URL. The reset will fail.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">New Password</label>
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="mt-1">
          <input 
            type="password" 
            {...register('confirmPassword')}
            placeholder="••••••••"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={isSubmitting || !token}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};
