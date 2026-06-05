import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../services/auth.service';
import { Loader2 } from 'lucide-react';
import { SEOMeta } from '../components/SEOMeta';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await AuthService.register(data);
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <SEOMeta title="Register | Shobhoday" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" {...register('name')} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" {...register('email')} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" {...register('password')} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-black text-white rounded-md font-medium flex justify-center">
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <button onClick={() => navigate('/login')} className="text-black font-medium hover:underline">Log in</button>
        </div>
      </div>
    </div>
  );
}
