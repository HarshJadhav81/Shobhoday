import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { useCartStore } from '../store/useCartStore';
import { Loader2 } from 'lucide-react';
import { SEOMeta } from '../components/SEOMeta';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [method, setMethod] = useState<'email' | 'otp'>('email');
  const navigate = useNavigate();
  const location = useLocation();
  const { guestId } = useCartStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await AuthService.login(data);
      
      // Merge guest cart into user cart
      if (guestId) {
        try {
          await CartService.mergeCart(guestId);
        } catch (mergeErr) {
          console.error('Failed to merge cart', mergeErr);
        }
      }

      // Redirect to intended page or home
      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get('redirect') || '/profile';
      navigate(redirect);
      
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-24 md:py-32 flex items-center justify-center">
      <SEOMeta title="Login | Shobhoday" />
      <div className="w-full max-w-md px-6">
        <SectionHeader title="Welcome Back" align="center" subtitle="Sign in to your account" />
        
        <div className="bg-white p-8 border border-charcoal/5 shadow-sm">
          <div className="flex mb-6 border-b border-slate/20">
            <button 
              className={`flex-1 pb-3 text-sm font-medium uppercase tracking-wider ${method === 'email' ? 'text-charcoal border-b-2 border-gold' : 'text-slate'}`}
              onClick={() => setMethod('email')}
            >
              Email
            </button>
            <button 
              className={`flex-1 pb-3 text-sm font-medium uppercase tracking-wider ${method === 'otp' ? 'text-charcoal border-b-2 border-gold' : 'text-slate'}`}
              onClick={() => { setMethod('otp'); alert('OTP Login coming soon!'); setMethod('email'); }}
            >
              Phone / OTP
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" {...register('email')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-slate uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-gold hover:underline">Forgot?</Link>
              </div>
              <input type="password" {...register('password')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-charcoal text-ivory py-4 uppercase tracking-widest font-medium text-sm hover:bg-gold transition-colors mt-6 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="relative py-4 mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-slate uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          <button type="button" className="w-full border border-slate/30 py-3 text-sm font-medium text-charcoal flex justify-center items-center gap-2 hover:bg-slate/5 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center text-sm text-slate mt-8">
            Don't have an account? <Link to="/register" className="text-gold font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
