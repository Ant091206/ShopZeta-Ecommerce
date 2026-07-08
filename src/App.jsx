import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Shopzeta.css";
import logoLight from "./assets/shopzeta-logo-light.svg";
import logoDark from "./assets/shopzeta-logo-dark.svg";

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
import ContactUs from "./Contactus";

const NAV_LINKS = [
  { name: "Home",       path: "/",           icon: "🏠" },
  { name: "About",      path: "/about",      icon: "ℹ️" },
  { name: "Contact",    path: "/contactus",  icon: "✉️" },
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
          <img
            src={isDark ? logoDark : logoLight}
            alt="ShopZeta"
            style={{ height: "44px", width: "auto", display: "block", objectFit: "contain" }}
          />
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
          <Route path="/contactus"                           element={<ContactUs />} />
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

        {showFooter && <Footer isDark={isDark} />}
      </div>
      {/* WhatsApp floating button — left side, with bounce animation */}
      <style>{`
        @keyframes wa-bounce {
          0%, 100% { transform: translateY(0); }
          25%       { transform: translateY(-8px); }
          50%       { transform: translateY(-4px); }
          75%       { transform: translateY(-10px); }
        }
        .wa-btn {
          animation: wa-bounce 2.8s ease-in-out infinite;
        }
        .wa-btn:hover {
          animation: none !important;
          transform: scale(1.12) !important;
          box-shadow: 0 6px 24px rgba(37,211,102,0.65) !important;
        }
      `}</style>
      <a
        href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20help%20with%20my%20ShopZeta%20order!"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="wa-btn"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "20px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,211,102,0.45)",
          zIndex: 1200,
          transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease",
          textDecoration: "none",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.698-1.807A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
          <path d="M16 5.5c-5.238 0-9.5 4.262-9.5 9.5 0 2.09.68 4.02 1.832 5.59l-.96 3.54 3.66-.96A9.46 9.46 0 0016 24.5c5.238 0 9.5-4.262 9.5-9.5S21.238 5.5 16 5.5z" fill="#25D366"/>
          <path d="M21.5 18.72c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.09 3.2 5.08 4.36.71.27 1.26.43 1.69.55.71.2 1.36.17 1.87.1.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" fill="#fff"/>
        </svg>
      </a>

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