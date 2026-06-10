import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("user_email", email);
    fd.append("user_password", password);
    try {
      const res = await axios.post("http://akashsir.in/atproject/at-shop/api/api-login.php", fd, {
        headers: { Authorization: "Bearer dbacace63c8bf2885869b81660c2b289" },
      });
      if (res.data.flag === "1" || res.data.status === "1") {
        localStorage.setItem("userSession", JSON.stringify(res.data));
        onLoginSuccess(res.data);
      } else alert(res.data.message || "Invalid credentials.");
    } catch (err) { console.error(err); alert("Login failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="sz-auth-wrap w-100">
        <div className="text-center mb-4">
          <div className="sz-auth-logo">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <path d="M11 11 L25 11 L11 25 L25 25" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="25" cy="11" r="2.2" fill="white" /><circle cx="11" cy="25" r="2.2" fill="white" />
            </svg>
          </div>
          <div className="sz-sec-title mb-1">Welcome back</div>
          <div className="sz-muted" style={{ fontSize: "14px" }}>Sign in to your ShopZeta account</div>
        </div>

        <div className="sz-auth-card p-4">
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div>
              <label className="sz-label">Email Address</label>
              <input className="sz-input" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="position-relative">
              <label className="sz-label">Password</label>
              <input className="sz-input" type={showPass ? "text" : "password"} placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: "56px" }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="position-absolute border-0 bg-transparent sz-muted fw-bold"
                style={{ right: "12px", top: "32px", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px" }}>
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className="text-end mt-n2">
              <Link to="/forgotpassword" className="sz-accent-c fw-semibold text-decoration-none" style={{ fontSize: "12px" }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="sz-btn sz-btn-primary w-100" style={{ padding: "13px" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <hr className="sz-hr my-4" />

          <Link to="/otp-login" className="d-flex align-items-center justify-content-center gap-2 text-decoration-none sz-btn sz-btn-outline w-100" style={{ fontSize: "13px" }}>
            📱 Login with OTP
          </Link>

          <p className="text-center sz-muted mt-3 mb-0" style={{ fontSize: "13px" }}>
            No account?{" "}
            <Link to="/signup" className="sz-accent-c fw-bold text-decoration-none">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;