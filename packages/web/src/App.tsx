import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { OrderFormPage } from "./pages/OrderFormPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FAQPage } from "./pages/FAQPage";
import { BlogPage } from "./pages/BlogPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { StoreListPage } from "./pages/StoreListPage";
import { CreateStorePage } from "./pages/CreateStorePage";
import { StoreSettingsPage } from "./pages/StoreSettingsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CartProvider } from "./contexts/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/order" element={<OrderFormPage />} />
              <Route path="/orders" element={<OrderFormPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogPage />} />
              
              {/* Auth routes */}
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <StoreListPage />
                </ProtectedRoute>
              } />
              <Route path="/stores/create" element={
                <ProtectedRoute>
                  <CreateStorePage />
                </ProtectedRoute>
              } />
              <Route path="/stores/:storeId/settings" element={
                <ProtectedRoute>
                  <StoreSettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
