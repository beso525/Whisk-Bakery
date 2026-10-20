import { Routes, Route } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminFeatures from './pages/admin-view/features'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import UserLayout from './components/user-view/layout'
import NotFound from './pages/not-found'
import UserAccount from './pages/user-view/account'
import UserCheckout from './pages/user-view/checkout'
import UserListing from './pages/user-view/listing'
import UserHome from './pages/user-view/home'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from './components/ui/skeleton'
import PaypalReturnPage from './pages/user-view/paypal-return'
import PaymentSuccessPage from './pages/user-view/payment-success'
import Search from './pages/user-view/search'
import PaymentCancelPage from './pages/user-view/payment-cancel'

function App() {

  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  if (isLoading) return <Skeleton className="h-[600px] w-[600px]" />
  return (
    <div className='flex flex-col overflow-hidden bg-white h-full'>
      <Routes>
        <Route path="/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="auth/login" element={<AuthLogin />} />
          <Route path="auth/register" element={<AuthRegister />} />
        </Route>

        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <UserLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<UserHome />} />
          <Route path="listing" element={<UserListing />} />
          <Route path="checkout" element={<UserCheckout />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-cancel" element={<PaymentCancelPage />} />
          <Route path="search" element={<Search />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth" element={<UnauthPage />} />

      </Routes>
    </div>
  )
}

export default App;
