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
                <svg width="40" height="40" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.5))", flexShrink: 0 }}>
                  <defs>
                    <linearGradient id="flf" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="flt" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a5b4fc" /><stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <linearGradient id="fls" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3730a3" /><stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                    <linearGradient id="flsh" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3" /><stop offset="60%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="80" cy="128" rx="52" ry="8" fill="#1e1b4b" opacity="0.35" />
                  <polygon points="110,30 128,14 128,110 110,126" fill="url(#fls)" />
                  <polygon points="20,126 110,126 128,110 38,110" fill="#312e81" />
                  <rect x="20" y="14" width="90" height="96" rx="2" fill="url(#flf)" />
                  <polygon points="20,14 110,14 128,0 38,0" fill="url(#flt)" />
                  <polygon points="72,38 80,32 80,48 72,54" fill="#3730a3" />
                  <polygon points="72,54 80,48 48,86 40,92" fill="#312e81" />
                  <polygon points="48,86 80,80 80,96 48,100" fill="#3730a3" />
                  <path d="M30 38 L72 38 L30 86 L72 86" stroke="white" strokeWidth="11" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
                  <rect x="20" y="14" width="90" height="96" rx="2" fill="url(#flsh)" />
                  <line x1="20" y1="14" x2="110" y2="14" stroke="white" strokeWidth="1.5" opacity="0.55" />
                  <line x1="20" y1="14" x2="38" y2="0" stroke="white" strokeWidth="1" opacity="0.35" />
                  <circle cx="20" cy="14" r="2" fill="white" opacity="0.7" />
                  <circle cx="110" cy="14" r="2" fill="white" opacity="0.4" />
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