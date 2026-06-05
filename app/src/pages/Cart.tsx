import { SectionHeader } from '../components/SectionHeader';
import { Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartService } from '../services/cart.service';
import { useCartStore } from '../store/useCartStore';
import { SEOMeta } from '../components/SEOMeta';
import type { Cart, CartItem } from '../types';

export default function CartPage() {
  const { guestId } = useCartStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => CartService.getCart(guestId)
  });

  const updateMutation = useMutation({
    mutationFn: (data: { itemId: string, quantity: number }) => 
      CartService.updateItem(data.itemId, { quantity: data.quantity, guestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => CartService.removeItem(itemId, guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const items = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;

  if (isLoading) {
    return (
      <div className="bg-beige min-h-screen py-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-charcoal/50" />
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen py-24 md:py-32">
      <SEOMeta title="Your Cart | Shobhoday" />
      <div className="max-w-[1440px] mx-auto px-6">
        <SectionHeader title="Your Cart" />
        
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-slate mb-6">Your cart is empty.</p>
            <Link to="/shop" className="bg-charcoal text-ivory px-8 py-3 uppercase tracking-widest font-medium text-sm hover:bg-gold transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="hidden md:grid grid-cols-6 border-b border-slate/20 pb-4 mb-6 font-body text-sm font-medium text-slate uppercase tracking-wider">
                <div className="col-span-3">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              
              {items.map((item: CartItem) => {
                const product = item.product;
                const variant = item.variant;
                const imageUrl = product.media?.[0]?.secureUrl || 'https://via.placeholder.com/400';
                const currentPrice = variant.price;

                return (
                  <div key={item._id} className="grid grid-cols-1 md:grid-cols-6 items-center gap-6 py-6 border-b border-slate/10">
                    <div className="col-span-3 flex gap-4">
                      <img src={imageUrl} alt={product.title} className="w-24 h-32 object-cover" />
                      <div>
                        <h3 className="font-body text-charcoal font-medium mb-1">{product.title}</h3>
                        {variant.size && <p className="text-sm text-slate">Size: {variant.size}</p>}
                        {variant.color && <p className="text-sm text-slate">Color: {variant.color}</p>}
                        <button 
                          onClick={() => removeMutation.mutate(item._id)} 
                          className="text-error text-sm mt-3 flex items-center gap-1 hover:underline disabled:opacity-50"
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:block text-center font-accent text-gold text-lg">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center border border-slate/30">
                        <button 
                          onClick={() => updateMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })} 
                          className="px-3 py-1 disabled:opacity-50"
                          disabled={updateMutation.isPending}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })} 
                          className="px-3 py-1 disabled:opacity-50"
                          disabled={updateMutation.isPending}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-accent text-gold text-lg md:text-xl font-semibold">
                      ₹{(currentPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-ivory p-8 h-fit border border-charcoal/5">
              <h3 className="font-display text-2xl text-charcoal mb-6">Order Summary</h3>
              
              <div className="space-y-4 font-body text-sm text-charcoal border-b border-slate/20 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between font-body text-lg font-medium text-charcoal mb-8">
                <span>Total</span>
                <span className="font-accent text-2xl text-gold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="block w-full text-center bg-charcoal text-ivory py-4 uppercase tracking-widest font-medium text-sm hover:bg-gold transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
