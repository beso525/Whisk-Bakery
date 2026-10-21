import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/shop')
    )) {
    return <Navigate to='/login' />;
  }

  if (isAuthenticated && (location.pathname.startsWith('/login') || location.pathname.startsWith('/register'))) {
    return (user?.role === "admin")
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/shop/home" />
  }

  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauth" />;
  }

  if (isAuthenticated && user?.role === 'admin' && location.pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>
}

export default CheckAuth;