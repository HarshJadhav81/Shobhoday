import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../../services/orders.service';
import { SEOMeta } from '../../components/SEOMeta';
import { Loader2, Package } from 'lucide-react';
import { Link } from 'react-router';

export default function OrderHistory() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => OrderService.getOrders({ sort: '-createdAt' })
  });

  const orders = response?.data || [];

  return (
    <div className="bg-ivory min-h-screen py-24 md:py-32">
      <SEOMeta title="My Orders | Shobhoday" />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-display text-charcoal mb-8">Order History</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-charcoal/50" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-charcoal/5">
            <Package className="w-12 h-12 text-slate mx-auto mb-4" />
            <p className="text-charcoal mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="bg-charcoal text-ivory px-6 py-3 uppercase tracking-widest text-sm hover:bg-gold transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white border border-charcoal/5 p-6 shadow-sm">
                <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-charcoal/5">
                  <div>
                    <p className="text-sm text-slate mb-1">Order Number</p>
                    <p className="font-medium text-charcoal">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate mb-1">Date</p>
                    <p className="font-medium text-charcoal">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate mb-1">Total</p>
                    <p className="font-medium text-charcoal">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-charcoal/5">
                        <img 
                          src={item.product?.media?.[0]?.secureUrl || 'https://via.placeholder.com/150'} 
                          alt="Product" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-charcoal text-sm">{item.product?.title || 'Unknown Product'}</p>
                        <p className="text-xs text-slate">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-accent text-gold font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
