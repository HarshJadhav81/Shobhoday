import { Link } from 'react-router';
import { XCircle } from 'lucide-react';
import { SEOMeta } from '../components/SEOMeta';

export default function PaymentFailed() {
  return (
    <div className="bg-beige min-h-screen py-32 flex items-center justify-center">
      <SEOMeta title="Payment Failed | Navjeevan Creation" />
      
      <div className="bg-white p-10 md:p-16 rounded-2xl shadow-xl max-w-lg w-full mx-6 text-center border border-charcoal/5">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Payment Failed</h1>
        <p className="font-body text-slate mb-8">
          We're sorry, but we were unable to process your payment. Your card has not been charged. Please try again with a different payment method.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/checkout" 
            className="block w-full bg-charcoal text-ivory py-4 uppercase tracking-widest font-medium text-sm hover:bg-gold transition-colors"
          >
            Try Again
          </Link>
          <Link 
            to="/contact" 
            className="block w-full bg-transparent border border-charcoal text-charcoal py-4 uppercase tracking-widest font-medium text-sm hover:bg-charcoal hover:text-ivory transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
