export interface Media {
  _id: string;
  publicId: string;
  secureUrl: string;
  mediaType: string;
  altText?: string;
}

export interface ProductVariant {
  _id?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  color?: string;
  size?: string;
  media?: Media[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: Category;
  shortDescription?: string;
  variants: ProductVariant[];
  basePrice: number;
  media: Media[];
  brand?: string;
  isActive: boolean;
  seoData?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailMedia?: Media;
  bannerMedia?: Media;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CartItem {
  _id: string;
  variant: ProductVariant;
  product: Product;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  _id: string;
  user?: string;
  guestId?: string;
  items: CartItem[];
  totalAmount: number;
}

export interface Address {
  _id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: User;
  guestId?: string;
  items: {
    product: string | Product;
    variant: string | ProductVariant;
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'payment_failed';
  paymentInfo?: {
    provider: string;
    transactionId?: string;
    status: string;
  };
  createdAt: string;
}
