import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { ROUTES } from './constants';
import Layout from './components/Layout';
import PlaceholderPage from './pages/PlaceholderPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy loading all pages
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const AccountDashboard = React.lazy(() => import('./pages/account/AccountDashboard'));
const OrderHistory = React.lazy(() => import('./pages/account/OrderHistory'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />

        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path={ROUTES.SHOP} element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<PlaceholderPage title="Forgot Password" />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<PlaceholderPage title="Reset Password" />} />

          {/* Protected Customer Routes */}
          <Route path={ROUTES.PROFILE} element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
          <Route path={ROUTES.ORDERS} element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><PlaceholderPage title="Order Details" /></ProtectedRoute>} />
          <Route path={ROUTES.CHECKOUT} element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/checkout/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/checkout/failure" element={<ProtectedRoute><PlaceholderPage title="Payment Failed" /></ProtectedRoute>} />

          {/* Placeholders for unimplemented public pages */}
          <Route path={ROUTES.COLLECTIONS} element={<PlaceholderPage title="Collections" />} />
          <Route path={ROUTES.OFFERS} element={<PlaceholderPage title="Offers" />} />
          <Route path={ROUTES.BLOGS} element={<PlaceholderPage title="Blogs" />} />
          <Route path={ROUTES.ABOUT} element={<PlaceholderPage title="About Us" />} />
          <Route path={ROUTES.CONTACT} element={<PlaceholderPage title="Contact Us" />} />
          <Route path={ROUTES.FAQ} element={<PlaceholderPage title="FAQ" />} />
        </Route>

        <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
      </Routes>
    </Suspense>
  );
}
