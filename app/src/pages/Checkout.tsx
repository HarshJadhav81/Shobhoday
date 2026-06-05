import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { CartService } from '../services/cart.service';
import { PaymentService } from '../services/payments.service';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { SEOMeta } from '../components/SEOMeta';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP is required'),
  country: z.string(),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { guestId } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => CartService.getCart(guestId),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India' }
  });

  const processPayment = async (data: AddressForm) => {
    try {
      setIsProcessing(true);
      
      // 1. Create order on backend
      const orderPayload = {
        shippingAddress: data,
        guestId: user ? undefined : guestId,
        paymentMethod: 'razorpay' as const
      };
      
      const { razorpayOrder, order } = await PaymentService.createOrder(orderPayload);

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this exists in frontend .env
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Shobhoday',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment
            await PaymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            });
            
            navigate('/checkout/success');
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            navigate('/checkout/failure');
          }
        },
        prefill: {
          name: data.fullName,
          email: user?.email || '',
          contact: data.phone
        },
        theme: {
          color: '#1a1a1a'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any){
        console.error('Payment Failed:', response.error);
        navigate('/checkout/failure');
      });

      rzp.open();
      
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCartLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-charcoal/50" /></div>;
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-beige min-h-screen py-24 px-4 md:px-6">
      <SEOMeta title="Checkout | Shobhoday" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Address Form */}
        <div>
          <h1 className="text-3xl font-display text-charcoal mb-8">Checkout</h1>
          <form id="checkout-form" onSubmit={handleSubmit(processPayment)} className="space-y-6">
            <h2 className="text-xl font-body font-medium text-charcoal pb-2 border-b border-charcoal/10">Shipping Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" {...register('fullName')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Phone</label>
                <input type="text" {...register('phone')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Street Address</label>
              <input type="text" {...register('street')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
              {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">City</label>
                <input type="text" {...register('city')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">State</label>
                <input type="text" {...register('state')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">ZIP Code</label>
                <input type="text" {...register('zipCode')} className="w-full border border-slate/30 px-4 py-3 text-sm focus:outline-none focus:border-gold bg-transparent" />
                {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Country</label>
                <input type="text" {...register('country')} readOnly className="w-full border border-slate/30 px-4 py-3 text-sm bg-black/5 text-slate" />
              </div>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-ivory p-8 border border-charcoal/5 sticky top-24">
            <h2 className="text-xl font-body font-medium text-charcoal pb-4 border-b border-charcoal/10 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.items.map((item: any) => (
                <div key={item._id} className="flex gap-4">
                  <img src={item.product.media?.[0]?.secureUrl} alt={item.product.title} className="w-16 h-20 object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.title}</h4>
                    <p className="text-xs text-slate">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate">Subtotal</span>
                <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-charcoal/10 mt-4 pt-4 flex justify-between items-center font-display text-2xl">
              <span>Total</span>
              <span className="text-gold">₹{cart.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-8 bg-charcoal text-ivory py-4 uppercase tracking-widest font-medium text-sm hover:bg-gold transition-colors flex justify-center disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
