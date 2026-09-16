import { Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/account/LoginPage';
import RegisterPage from './pages/account/RegisterPage';
import AccountPage from './pages/account/AccountPage';
import ProfileTab from './pages/account/ProfileTab';
import OrdersTab from './pages/account/OrdersTab';
import WishlistTab from './pages/account/WishlistTab';
import ChangePasswordTab from './pages/account/ChangePasswordTab';
import { BlogListPage, BlogPostPage } from './pages/BlogPage';
import { StaticPage, ContactPage, AboutPage } from './pages/StaticPages';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAccountPage from './pages/admin/AdminAccountPage';

const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage'));
const AdminPagesPage = lazy(() => import('./pages/admin/AdminPagesPage'));

const Spin = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1a3a2a', borderTopColor: 'transparent' }} />
  </div>
);

function CategoryPage() {
  const { slug } = useParams();
  return <ShopPage categorySlug={slug} />;
}

function AdminHomepagePage() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
      <div className="text-4xl mb-4">🏠</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: '#1a3a2a' }}>Homepage Manager</h2>
      <p className="text-gray-500 text-sm">Section order and visibility coming soon. Use Settings to update site content.</p>
    </div>
  );
}

function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl font-bold mb-4" style={{ color: '#1a3a2a' }}>404</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a2a' }}>Page Not Found</h2>
          <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="px-8 py-3 rounded-xl font-semibold text-white" style={{ background: '#1a3a2a' }}>Go Home</a>
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Store */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/offers" element={<Layout><ShopPage title="Offer Sale" /></Layout>} />
        <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/product/:slug" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/order-confirmation" element={<Layout><OrderConfirmationPage /></Layout>} />
        <Route path="/track-order" element={<Layout><TrackOrderPage /></Layout>} />

        {/* Auth */}
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

        {/* Account */}
        <Route path="/account" element={<Layout><AccountPage /></Layout>}>
          <Route index element={<ProfileTab />} />
          <Route path="orders" element={<OrdersTab />} />
          <Route path="wishlist" element={<WishlistTab />} />
          <Route path="addresses" element={<ProfileTab />} />
          <Route path="change-password" element={<ChangePasswordTab />} />
        </Route>

        {/* Blog */}
        <Route path="/blog" element={<Layout><BlogListPage /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />

        {/* Static pages */}
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><StaticPage slug="privacy-policy" /></Layout>} />
        <Route path="/return-refund-policy" element={<Layout><StaticPage slug="return-refund-policy" /></Layout>} />
        <Route path="/terms-conditions" element={<Layout><StaticPage slug="terms-conditions" /></Layout>} />
        <Route path="/faq" element={<Layout><StaticPage slug="faq" /></Layout>} />
        <Route path="/page/:slug" element={<Layout><StaticPage /></Layout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="customizer" element={<AdminSettingsPage />} />
          <Route path="account" element={<AdminAccountPage />} />
          <Route path="homepage" element={<AdminHomepagePage />} />
          <Route path="customers" element={<Suspense fallback={<Spin />}><AdminCustomersPage /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<Spin />}><AdminReviewsPage /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<Spin />}><AdminBlogPage /></Suspense>} />
          <Route path="media" element={<Suspense fallback={<Spin />}><AdminMediaPage /></Suspense>} />
          <Route path="pages" element={<Suspense fallback={<Spin />}><AdminPagesPage /></Suspense>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 }
      }} />
    </>
  );
}
