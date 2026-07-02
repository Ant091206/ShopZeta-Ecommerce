import React, { useState } from "react";
import logoLight from "./assets/shopzeta-logo-light.svg";
import logoDark  from "./assets/shopzeta-logo-dark.svg";
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
    { title: "Shop", items: [
      ["All Products",  "/products"],
      ["Categories",    "/categories"],
      ["Subcategories", "/subcategories"],
      ["New Arrivals",  "/products"],
    ]},
    { title: "Account", items: [
      ["Dashboard",    "/dashboard"],
      ["My Orders",    "/orders"],
      ["Wishlist",     "/wishlist"],
      ["Cart",         "/cart"],
      ["Sign In",      "/login"],
    ]},
    { title: "Help", items: [
      ["About Us",       "/about"],
      ["Track Order",    "/orders"],
      ["Returns",        "/"],
      ["Privacy Policy", "/"],
    ]},
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
              {/* Logo */}
              <div style={{marginBottom:"16px"}}>
                <img
                  src={isDark ? logoDark : logoLight}
                  alt="ShopZeta"
                  style={{ height: "44px", width: "auto", display: "block", objectFit: "contain" }}
                />
              </div>

              <p style={{ fontSize:"13px", color:"var(--sz-muted)", lineHeight:"1.65", marginBottom:"16px", maxWidth:"300px" }}>
                Your one-stop destination for premium products — quality, speed, and a seamless shopping experience.
              </p>

              {/* Trust badges */}
              <div className="d-flex flex-column gap-1 mb-4">
                {[["🚚","Free shipping above ₹499"],["🔒","100% secure payments"],["↩️","30-day easy returns"]].map(([icon,text]) => (
                  <div key={text} className="d-flex align-items-center gap-2">
                    <span style={{ fontSize:"13px" }}>{icon}</span>
                    <span style={{ fontSize:"12px", color:"var(--sz-muted)", fontWeight:500 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div style={{
                display:"flex", borderRadius:"10px", overflow:"hidden",
                border:"1px solid var(--sz-border)", background:"var(--sz-surface)", marginBottom:"12px",
              }}>
                {subscribed ? (
                  <div style={{ padding:"10px 14px", color:"var(--sz-success)", fontSize:"13px", fontWeight:600 }}>
                    ✓ Subscribed! Welcome aboard 🎉
                  </div>
                ) : (
                  <>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address..."
                      style={{
                        flex:1, padding:"10px 14px", background:"transparent",
                        border:"none", outline:"none", color:"var(--sz-text)",
                        fontSize:"13px", fontFamily:"inherit",
                      }}
                    />
                    <button onClick={handleSubscribe} style={{
                      padding:"10px 16px", background:"var(--sz-accent)", color:"#fff",
                      border:"none", fontWeight:700, fontSize:"12px",
                      cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit",
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
                    width:"32px", height:"32px", borderRadius:"8px",
                    border:"1px solid var(--sz-border)",
                    background:"var(--sz-surface2)", color:"var(--sz-muted)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", fontSize:"11px", fontWeight:800,
                    transition:"all .2s", padding:0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="var(--sz-accent)"; e.currentTarget.style.color="var(--sz-accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--sz-border)"; e.currentTarget.style.color="var(--sz-muted)"; }}
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
                  fontSize:"10px", fontWeight:800, color:"var(--sz-text)",
                  letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"14px",
                }}>
                  {col.title}
                </div>
                <div className="d-flex flex-column gap-2">
                  {col.items.map(([label, path]) => (
                    <button
                      key={label}
                      onClick={() => goTo(path)}
                      style={{
                        background:"none", border:"none", padding:0,
                        color:"var(--sz-muted)", fontSize:"13px", fontWeight:500,
                        cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                        transition:"color .15s", display:"block",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color="var(--sz-accent)"}
                      onMouseLeave={e => e.currentTarget.style.color="var(--sz-muted)"}
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
      <div style={{ background:"var(--sz-bg)" }}>
        <div className="container-xl px-4 py-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div style={{ fontSize:"12px", color:"var(--sz-muted)" }}>
              © {year} ShopZeta. Built with ❤️ by Aryan.
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {["Visa","Mastercard","UPI","PayTM","RuPay","COD"].map(p => (
                <span key={p} style={{
                  padding:"2px 8px", borderRadius:"4px",
                  border:"1px solid var(--sz-border)",
                  background:"var(--sz-surface)", color:"var(--sz-dim)",
                  fontSize:"10px", fontWeight:700,
                }}>
                  {p}
                </span>
              ))}
            </div>
            <div className="d-flex gap-3">
              {[["Privacy","/"],["Terms","/"],["Cookies","/"]].map(([label, path]) => (
                <button key={label} onClick={() => goTo(path)} style={{
                  background:"none", border:"none", padding:0,
                  color:"var(--sz-muted)", fontSize:"11px", fontWeight:500,
                  cursor:"pointer", fontFamily:"inherit", transition:"color .15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color="var(--sz-accent)"}
                  onMouseLeave={e => e.currentTarget.style.color="var(--sz-muted)"}
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