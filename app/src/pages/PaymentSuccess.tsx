
import { Link } from 'react-router';
import { SEOMeta } from '../components/SEOMeta';

export default function PaymentSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <SEOMeta title="Order Confirmed | Shobhoday" />
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. We've sent a confirmation email with your order details.</p>
        <Link to="/profile/orders" className="inline-block mt-4 px-6 py-3 bg-black text-white font-medium rounded-md w-full">
          View Order Status
        </Link>
      </div>
    </div>
  );
}
