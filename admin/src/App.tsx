import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { ProductListPage } from './modules/products/pages/ProductListPage';
import { ProductCreatePage } from './modules/products/pages/ProductCreatePage';
import { CategoryManagerPage } from './modules/categories/pages/CategoryManagerPage';
import { InventoryDashboardPage } from './modules/inventory/pages/InventoryDashboardPage';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { UserListPage } from './modules/users/pages/UserListPage';
import { RolesPage } from './modules/roles/pages/RolesPage';
import { SecurityPage } from './modules/security/pages/SecurityPage';
import { OrderListPage } from './modules/orders/pages/OrderListPage';

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 border-dashed text-gray-500 p-8">
    <h2 className="text-2xl font-semibold">{title} Module (Under Construction)</h2>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            
            {/* Phase 4D: Product Management */}
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<ProductCreatePage />} />
            
            <Route path="categories" element={<CategoryManagerPage />} />
            <Route path="inventory" element={<InventoryDashboardPage />} />
            
            
            <Route path="users" element={<UserListPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="security" element={<SecurityPage />} />
            
            <Route path="orders" element={<OrderListPage />} />
            
            {/* Unbuilt Placeholders */}
            <Route path="customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="coupons" element={<PlaceholderPage title="Coupons" />} />
            <Route path="reviews" element={<PlaceholderPage title="Reviews" />} />
            <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>
        </Route>
        
        <Route path="/403" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
