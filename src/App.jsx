import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Shopzeta.css";

import Home from "./Home";
import CategoryList from "./Category";
import SubCategoryList from "./Subcategory";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import Login from "./Login";
import Signup from "./Signup";
import Forgotpassword from "./Forgotpassword";
import AboutUs from "./AboutUs";
import Checkout from "./Checkout";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import OtpLogin from "./OtpLogin";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import Chatbot from "./Chatbot";

const NAV_LINKS = [
  { name: "Home",       path: "/",           icon: "🏠" },
  { name: "About",      path: "/about",      icon: "ℹ️" },
  { name: "Categories", path: "/categories", icon: "⊞"  },
  { name: "Products",   path: "/products",   icon: "📦" },
  { name: "Orders",     path: "/orders",     icon: "📋" },
];

const NO_FOOTER = ["/login", "/signup", "/forgotpassword", "/otp-login"];

/* ── Scroll to top whenever route changes ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  return null;
}

function App() {
  const [userSession, setUserSession] = useState(() => {
    const s = localStorage.getItem("userSession");
    return s ? JSON.parse(s) : null;
  });

  /* ── Theme: read saved preference, default dark ── */
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("sz-theme");
    return saved ? saved === "dark" : true;
  });

  /* Apply data-theme attribute to <html> whenever theme changes */
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("sz-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(p => !p);

  const navigate   = useNavigate();
  const location   = useLocation();
  const isActive   = (path) => location.pathname === path;
  const showFooter = !NO_FOOTER.includes(location.pathname);

  const handleLoginSuccess = (userData) => { setUserSession(userData); navigate("/"); };
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setUserSession(null);
    toast.info("You've been signed out. See you soon! 👋");
    navigate("/login");
  };

  const initials = userSession
    ? (userSession.user_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  /* ── Theme toggle (see inline styles in JSX) ── */

  return (
    <>
      <ScrollToTop />

      {/* ── NAVBAR ── */}
      <nav className="sz-navbar d-flex align-items-center px-3 px-md-4 gap-3">

        {/* Brand */}
        <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
          <svg width="200" height="48" viewBox="0 0 340 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lgA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
              <linearGradient id="lgB" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
            {/* Cart handle */}
            <line x1="6" y1="12" x2="18" y2="12" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="18" y1="12" x2="24" y2="30" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            {/* Cart body */}
            <line x1="24" y1="30" x2="82" y2="30" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="82" y1="30" x2="76" y2="56" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="76" y1="56" x2="30" y2="56" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="30" y1="56" x2="24" y2="30" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            {/* Cart wheels */}
            <circle cx="40" cy="66" r="6" fill="url(#lgA)"/>
            <circle cx="68" cy="66" r="6" fill="url(#lgA)"/>
            {/* Z inside cart */}
            <line x1="34" y1="38" x2="72" y2="38" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="72" y1="38" x2="34" y2="52" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="34" y1="52" x2="72" y2="52" stroke="url(#lgA)" strokeWidth="4" strokeLinecap="round"/>
            {/* Shop text */}
            <text x="94" y="52" fontFamily="Outfit,system-ui,sans-serif" fontWeight="800" fontSize="36" fill="var(--sz-text)" letterSpacing="-0.5">Shop</text>
            {/* Zeta text gradient */}
            <text x="192" y="52" fontFamily="Outfit,system-ui,sans-serif" fontWeight="800" fontSize="36" fill="url(#lgB)" letterSpacing="-0.5">Zeta</text>
            {/* Tagline */}
            <text x="94" y="68" fontFamily="Outfit,system-ui,sans-serif" fontWeight="600" fontSize="8.5" fill="var(--sz-muted)" letterSpacing="2.5">SMART. MODERN. SIMPLE.</text>
          </svg>
        </div>

        {/* Center nav links */}
        <div className="sz-nav-links-wrap d-flex align-items-center gap-1 flex-grow-1 justify-content-center">
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path}
              className={`sz-nav-link${isActive(link.path) ? " active" : ""}`}>
              <span>{link.icon}</span> {link.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="d-flex align-items-center gap-2 ms-auto">

          {/* ── THEME TOGGLE ── */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "6px 12px 6px 8px",
              borderRadius: "20px", cursor: "pointer",
              border: isDark ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(0,0,0,0.15)",
              background: isDark
                ? "linear-gradient(135deg,#1e1b4b,#2d2a5e)"
                : "linear-gradient(135deg,#fef3c7,#fed7aa)",
              transition: "all 0.3s ease",
              boxShadow: isDark
                ? "0 0 14px rgba(99,102,241,0.3)"
                : "0 2px 8px rgba(251,146,60,0.3)",
              minWidth: "80px",
            }}>
            {/* Track with sliding thumb */}
            <div style={{
              position: "relative", width: "36px", height: "20px",
              borderRadius: "10px", flexShrink: 0,
              background: isDark ? "#312e81" : "#fb923c",
              transition: "background 0.3s",
            }}>
              <div style={{
                position: "absolute", top: "2px",
                left: isDark ? "18px" : "2px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#fff",
                transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px",
              }}>
                {isDark ? "🌙" : "☀️"}
              </div>
            </div>
            {/* Label */}
            <span style={{
              fontSize: "11px", fontWeight: "700",
              color: isDark ? "#a5b4fc" : "#92400e",
              letterSpacing: "0.5px", textTransform: "uppercase",
              transition: "color 0.3s",
              userSelect: "none",
            }}>
              {isDark ? "Dark" : "Light"}
            </span>
          </button>

          <div className="sz-vr mx-1" style={{ height: "22px" }} />

          {/* Wishlist */}
          <Link to="/wishlist"
            className={`sz-icon-btn${isActive("/wishlist") ? " active" : ""}`}
            title="Wishlist">
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill={isActive("/wishlist") ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </Link>

          {/* Cart */}
          <Link to="/cart"
            className={`sz-icon-btn${isActive("/cart") ? " active" : ""}`}
            title="Cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <span className="sz-badge-dot">!</span>
          </Link>

          <div className="sz-vr mx-1" style={{ height: "22px" }} />

          {userSession ? (
            <>
              <div className="sz-user-chip" onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }} title="My Dashboard">
                <div className="sz-avatar">{initials}</div>
                <span className="sz-text fw-semibold d-none d-md-inline" style={{ fontSize: "13px" }}>
                  {userSession.user_name || "User"}
                </span>
              </div>
              <button className="sz-btn-logout" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="sz-btn-login">Sign In</Link>
          )}
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="sz-main">
        <Routes>
          <Route path="/"                                    element={<Home />} />
          <Route path="/about"                               element={<AboutUs />} />
          <Route path="/categories"                          element={<CategoryList />} />
          <Route path="/subcategories"                       element={<SubCategoryList />} />
          <Route path="/products"                            element={<Product />} />
          <Route path="/subcategories/:categoryId"           element={<SubCategoryList />} />
          <Route path="/products/subcategory/:subCategoryId" element={<Product />} />
          <Route path="/product-details/:productId"          element={<ProductDetails userSession={userSession} />} />
          <Route path="/wishlist"                            element={<Wishlist userSession={userSession} />} />
          <Route path="/cart"                                element={<Cart userSession={userSession} />} />
          <Route path="/dashboard"                           element={<Dashboard userSession={userSession} />} />
          <Route path="/login"                               element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/otp-login"                           element={<OtpLogin setUserSession={setUserSession} />} />
          <Route path="/signup"                              element={<Signup />} />
          <Route path="/forgotpassword"                      element={<Forgotpassword />} />
          <Route path="/checkout"                            element={<Checkout />} />
          <Route path="/orders"                              element={<Orders />} />
          <Route path="/order-details/:orderId"              element={<OrderDetails />} />
        </Routes>

        {showFooter && <Footer />}
      </div>
      <Chatbot />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastStyle={{
          borderRadius: "12px",
          fontFamily: "inherit",
          fontSize: "13.5px",
          fontWeight: 500,
        }}
      />
    </>
  );
}

export default App;