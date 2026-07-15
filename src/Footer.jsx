import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Footer({ isDark }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  /* Navigate and scroll to top */
  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  const cols = [
    {
      title: "Shop", items: [
        ["All Products", "/products"],
        ["Categories", "/categories"],
        ["Subcategories", "/subcategories"],
        ["New Arrivals", "/products"],
      ]
    },
    {
      title: "Account", items: [
        ["Dashboard", "/dashboard"],
        ["My Orders", "/orders"],
        ["Wishlist", "/wishlist"],
        ["Cart", "/cart"],
        ["Sign In", "/login"],
      ]
    },
    {
      title: "Help", items: [
        ["About Us", "/about"],
        ["Track Order", "/orders"],
        ["Returns", "/"],
        ["Privacy Policy", "/"],
      ]
    },
  ];

  const socials = [
    ["𝕏", "Twitter"], ["in", "LinkedIn"], ["f", "Facebook"],
    ["▶", "YouTube"], ["📷", "Instagram"],
  ];

  return (
    <footer style={{
      background: "var(--sz-bg)",
      borderTop: "1px solid var(--sz-border)",
      marginTop: "60px",
      fontFamily: "inherit",
    }}>

      {/* ── Main body ── */}
      <div style={{ borderBottom: "1px solid var(--sz-border)", background: "var(--sz-surface)" }}>
        <div className="container-xl px-4 py-5">
          <div className="row g-4">

            {/* ── Brand column ── */}
            <div className="col-lg-4 col-md-12">
              {/* Logo — 3D Z */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <svg width="42" height="42" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ filter: "drop-shadow(0 4px 14px rgba(99,102,241,0.55))", flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="flf" x1="10%" y1="0%" x2="90%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" /><stop offset="50%" stopColor="#6366f1" /><stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="flt" x1="0%" y1="0%" x2="10%" y2="100%">
                      <stop offset="0%" stopColor="#c7d2fe" /><stop offset="100%" stopColor="#a5b4fc" />
                    </linearGradient>
                    <linearGradient id="fls" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#3730a3" />
                    </linearGradient>
                    <linearGradient id="flb" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#312e81" />
                    </linearGradient>
                    <linearGradient id="flsh" x1="0%" y1="0%" x2="90%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.38" /><stop offset="45%" stopColor="white" stopOpacity="0.05" /><stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="90" cy="148" rx="58" ry="8" fill="#6366f1" opacity="0.2" />
                  <polygon points="30,138 118,138 136,120 48,120" fill="url(#flb)" />
                  <polygon points="118,38 136,20 136,120 118,138" fill="url(#fls)" />
                  <rect x="30" y="38" width="88" height="100" rx="10" fill="url(#flf)" />
                  <polygon points="30,38 118,38 136,20 48,20" fill="url(#flt)" />
                  <polygon points="86,60 94,53 94,68 86,75" fill="#312e81" />
                  <polygon points="86,75 94,68 58,108 50,115" fill="#2d2a7a" />
                  <polygon points="58,108 94,102 94,117 58,122" fill="#312e81" />
                  <path d="M42 60 L88 60 L42 108 L88 108" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="30" y="38" width="88" height="100" rx="10" fill="url(#flsh)" />
                  <line x1="30" y1="38" x2="118" y2="38" stroke="white" strokeWidth="1.5" opacity="0.7" />
                  <line x1="30" y1="38" x2="48" y2="20" stroke="white" strokeWidth="1" opacity="0.45" />
                  <circle cx="30" cy="38" r="2.5" fill="white" opacity="0.8" />
                </svg>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--sz-text)", letterSpacing: "-0.5px" }}>
                    Shop<span style={{ color: "var(--sz-accent)" }}>Zeta</span>
                  </div>
                  <div style={{ fontSize: "8px", color: "var(--sz-muted)", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
                    Smart. Modern. Simple.
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "var(--sz-muted)", lineHeight: "1.65", marginBottom: "16px", maxWidth: "300px" }}>
                Your one-stop destination for premium products — quality, speed, and a seamless shopping experience.
              </p>

              {/* Trust badges */}
              <div className="d-flex flex-column gap-1 mb-4">
                {[["🚚", "Free shipping above ₹499"], ["🔒", "100% secure payments"], ["↩️", "30-day easy returns"]].map(([icon, text]) => (
                  <div key={text} className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "13px" }}>{icon}</span>
                    <span style={{ fontSize: "12px", color: "var(--sz-muted)", fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div style={{
                display: "flex", borderRadius: "10px", overflow: "hidden",
                border: "1px solid var(--sz-border)", background: "var(--sz-surface)", marginBottom: "12px",
              }}>
                {subscribed ? (
                  <div style={{ padding: "10px 14px", color: "var(--sz-success)", fontSize: "13px", fontWeight: 600 }}>
                    ✓ Subscribed! Welcome aboard 🎉
                  </div>
                ) : (
                  <>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address..."
                      style={{
                        flex: 1, padding: "10px 14px", background: "transparent",
                        border: "none", outline: "none", color: "var(--sz-text)",
                        fontSize: "13px", fontFamily: "inherit",
                      }}
                    />
                    <button onClick={handleSubscribe} style={{
                      padding: "10px 16px", background: "var(--sz-accent)", color: "#fff",
                      border: "none", fontWeight: 700, fontSize: "12px",
                      cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                    }}>
                      Subscribe →
                    </button>
                  </>
                )}
              </div>

              {/* Social icons */}
              <div className="d-flex gap-2">
                {socials.map(([icon, label]) => (
                  <button key={label} title={label} style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1px solid var(--sz-border)",
                    background: "var(--sz-surface2)", color: "var(--sz-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: "11px", fontWeight: 800,
                    transition: "all .2s", padding: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--sz-accent)"; e.currentTarget.style.color = "var(--sz-accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--sz-border)"; e.currentTarget.style.color = "var(--sz-muted)"; }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Link columns ── */}
            {cols.map(col => (
              <div key={col.title} className="col-lg col-6 col-md-4">
                <div style={{
                  fontSize: "10px", fontWeight: 800, color: "var(--sz-text)",
                  letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px",
                }}>
                  {col.title}
                </div>
                <div className="d-flex flex-column gap-2">
                  {col.items.map(([label, path]) => (
                    <button
                      key={label}
                      onClick={() => goTo(path)}
                      style={{
                        background: "none", border: "none", padding: 0,
                        color: "var(--sz-muted)", fontSize: "13px", fontWeight: 500,
                        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        transition: "color .15s", display: "block",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--sz-accent)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--sz-muted)"}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ background: "var(--sz-bg)" }}>
        <div className="container-xl px-4 py-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div style={{ fontSize: "12px", color: "var(--sz-muted)" }}>
              © {year} ShopZeta. Built with ❤️ by Aryan.
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {["Visa", "Mastercard", "UPI", "PayTM", "RuPay", "COD"].map(p => (
                <span key={p} style={{
                  padding: "2px 8px", borderRadius: "4px",
                  border: "1px solid var(--sz-border)",
                  background: "var(--sz-surface)", color: "var(--sz-dim)",
                  fontSize: "10px", fontWeight: 700,
                }}>
                  {p}
                </span>
              ))}
            </div>
            <div className="d-flex gap-3">
              {[["Privacy", "/"], ["Terms", "/"], ["Cookies", "/"]].map(([label, path]) => (
                <button key={label} onClick={() => goTo(path)} style={{
                  background: "none", border: "none", padding: 0,
                  color: "var(--sz-muted)", fontSize: "11px", fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit", transition: "color .15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--sz-accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--sz-muted)"}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;