import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(); fd.append("user_email", email);
    try {
      const res = await axios.post("http://akashsir.in/atproject/at-shop/api/api-user-forgot-password.php", fd, {
        headers: { Authorization: "Bearer dbacace63c8bf2885869b81660c2b289" }
      });
      if (res.data.flag === "1" || res.data.flag == 1) {
        toast.success(`Your password: ${res.data.user_password || res.data.password}`, { autoClose: 8000 });
        navigate("/login");
      } else toast.error(res.data.message || "Email not found.");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="sz-auth-wrap w-100">
        <div className="text-center mb-4">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔐</div>
          <div className="sz-sec-title mb-1">Forgot Password</div>
          <div className="sz-muted" style={{ fontSize: "14px" }}>We'll help you get back in</div>
        </div>
        <div className="sz-auth-card p-4">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="sz-label">Registered Email</label>
              <input className="sz-input" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="sz-btn sz-btn-primary w-100" style={{ padding: "13px" }}>
              {loading ? "Retrieving..." : "Retrieve Password"}
            </button>
          </form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: "13px" }}>
            <Link to="/login" className="sz-accent-c fw-bold text-decoration-none">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;