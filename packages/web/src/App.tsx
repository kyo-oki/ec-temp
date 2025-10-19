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
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { CartProvider } from "./contexts/CartContext";

// Admin pages
import { ProductListPage } from "./pages/admin/ProductListPage";
import { ProductFormPage } from "./pages/admin/ProductFormPage";
import { OrderListPage } from "./pages/admin/OrderListPage";
import { OrderDetailPage } from "./pages/admin/OrderDetailPage";
import { BlogListPage } from "./pages/admin/BlogListPage";
import { BlogFormPage } from "./pages/admin/BlogFormPage";
import { BlogPreviewPage } from "./pages/admin/BlogPreviewPage";
import { FAQListPage } from "./pages/admin/FAQListPage";
import { FAQFormPage } from "./pages/admin/FAQFormPage";
import { PromotionListPage } from "./pages/admin/PromotionListPage";
import { PromotionFormPage } from "./pages/admin/PromotionFormPage";
import { ContactListPage } from "./pages/admin/ContactListPage";
import { ContactDetailPage } from "./pages/admin/ContactDetailPage";
import { AboutEditPage } from "./pages/admin/AboutEditPage";

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
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StoreListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/create"
                element={
                  <ProtectedRoute>
                    <CreateStorePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/:storeId/settings"
                element={
                  <ProtectedRoute>
                    <StoreSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Store-specific Admin routes */}
              <Route
                path="/stores/:storeId/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <AdminDashboardPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Product Management */}
              <Route
                path="/stores/:storeId/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ProductListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/products/create"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ProductFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/products/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ProductFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/products/:id/edit"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ProductFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Order Management */}
              <Route
                path="/stores/:storeId/admin/orders"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <OrderListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/orders/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <OrderDetailPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Blog Management */}
              <Route
                path="/stores/:storeId/admin/blog"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <BlogListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/blog/create"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <BlogFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/blog/:id/edit"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <BlogFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/blog/:id/preview"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <BlogPreviewPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* FAQ Management */}
              <Route
                path="/stores/:storeId/admin/faq"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <FAQListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/faq/create"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <FAQFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/faq/:id/edit"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <FAQFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Promotion Management */}
              <Route
                path="/stores/:storeId/admin/promotions"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <PromotionListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/promotions/create"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <PromotionFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/promotions/:id/edit"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <PromotionFormPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Contact Management */}
              <Route
                path="/stores/:storeId/admin/contacts"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ContactListPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/stores/:storeId/admin/contacts/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <ContactDetailPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* About Page Management */}
              <Route
                path="/stores/:storeId/admin/about"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <AboutEditPage />
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
