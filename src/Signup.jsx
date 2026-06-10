import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "", user_email: "", user_password: "",
    user_gender: "Male", user_mobile: "", user_address: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    try {
      const res = await axios.post(`${API_BASE}/api-signup.php`, fd, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (res.data.flag === "1" || res.data.status === "1" || res.data.success) {
        alert("Account created! Please sign in."); navigate("/login");
      } else setError(res.data.message || "Signup failed.");
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="d-flex align-items-start justify-content-center px-3 py-5" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="sz-auth-wrap w-100">
        <div className="text-center mb-4">
          <div className="sz-auth-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="sz-sec-title mb-1">Create Account</div>
          <div className="sz-muted" style={{ fontSize: "14px" }}>Join ShopZeta today</div>
        </div>

        <div className="sz-auth-card p-4">
          {error && (
            <div className="rounded-3 p-3 mb-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--sz-danger)", fontSize: "13px", fontWeight: 600 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {[
              { label: "Full Name", name: "user_name", type: "text", ph: "Your full name" },
              { label: "Email Address", name: "user_email", type: "email", ph: "you@example.com" },
              { label: "Password", name: "user_password", type: "password", ph: "Create a password" },
              { label: "Mobile Number", name: "user_mobile", type: "tel", ph: "10-digit mobile" },
            ].map(f => (
              <div key={f.name}>
                <label className="sz-label">{f.label}</label>
                <input className="sz-input" type={f.type} name={f.name} placeholder={f.ph} value={formData[f.name]} onChange={handleChange} required />
              </div>
            ))}
            <div>
              <label className="sz-label">Gender</label>
              <select className="sz-input" name="user_gender" value={formData.user_gender} onChange={handleChange}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="sz-label">Address</label>
              <textarea className="sz-input" name="user_address" placeholder="Your delivery address" value={formData.user_address} onChange={handleChange} rows="2" required style={{ resize: "none" }} />
            </div>
            <button type="submit" disabled={loading} className="sz-btn sz-btn-primary w-100" style={{ padding: "13px" }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center sz-muted mt-3 mb-0" style={{ fontSize: "13px" }}>
            Already have an account?{" "}
            <Link to="/login" className="sz-accent-c fw-bold text-decoration-none">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;