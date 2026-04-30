import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { CartPage } from './pages/Cart'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { CheckoutPage } from './pages/Checkout'
import { TrackOrderPage } from './pages/TrackOrder'
import { ContactPage } from './pages/Contact'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/Home'
import { OrderConfirmationPage } from './pages/OrderConfirmation'
import { ProductCustomizePage } from './pages/ProductCustomize'
import { ShopPage } from './pages/Shop'
import { AdminLayout } from './pages/Admin/AdminLayout'
import { AdminDashboardPage } from './pages/Admin/AdminDashboard'
import { AdminProductsPage } from './pages/Admin/AdminProducts'
import { AdminOrdersPage } from './pages/Admin/AdminOrders'
import { AdminGate } from './pages/Admin/AdminGate'

function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ works here */}

      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="product/:productId" element={<ProductCustomizePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="order/confirmation" element={<OrderConfirmationPage />} />

          <Route path="admin/login" element={<AdminLoginPage />} />

          <Route
            path="admin"
            element={
              <AdminGate>
                <AdminLayout />
              </AdminGate>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App