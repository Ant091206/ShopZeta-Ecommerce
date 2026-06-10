import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const S = {
    bg: "var(--sz-bg)",
    surface: "var(--sz-surface)",
    surface2: "var(--sz-surface2)",
    border: "var(--sz-border)",
    borderH: "var(--sz-border-h)",
    accent: "var(--sz-accent)",
    accent2: "var(--sz-accent2)",
    glow: "rgba(99,102,241,0.28)",
    gold: "var(--sz-gold)",
    text: "var(--sz-text)",
    muted: "var(--sz-muted)",
    success: "var(--sz-success)",
    danger: "var(--sz-danger)",
};

function Dashboard({ userSession }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const token = "dbacace63c8bf2885869b81660c2b289";
    const session = userSession || JSON.parse(localStorage.getItem("userSession"));

    useEffect(() => {
        if (!session?.user_id) { setLoading(false); return; }
        const uid = session.user_id;
        const post = (url) => {
            const fd = new FormData(); fd.append("user_id", uid);
            return axios.post(url, fd, { headers: { Authorization: `Bearer ${token}` } });
        };
        Promise.all([
            post("http://akashsir.in/atproject/at-shop/api/api-list-order.php"),
            post("http://akashsir.in/atproject/at-shop/api/api-list-wishlist.php"),
            post("http://akashsir.in/atproject/at-shop/api/api-list-cart.php"),
        ]).then(([o, w, c]) => {
            setOrders(o.data?.order_list || o.data?.orders || []);
            setWishlist(w.data?.wishlist || w.data?.wishlist_list || []);
            setCartItems(c.data?.cart || c.data?.cart_list || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (!session) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "16px", padding: "48px", textAlign: "center", maxWidth: "420px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>👤</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: S.text, marginBottom: "8px" }}>My Dashboard</div>
                <p style={{ color: S.muted, marginBottom: "24px" }}>Sign in to access your dashboard</p>
                <button onClick={() => navigate("/login")} style={{ padding: "11px 24px", background: S.accent, color: "#fff", border: "none", borderRadius: "9px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>Sign In</button>
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div className="sz-spinner" /><span style={{ color: S.muted, fontSize: "14px" }}>Loading your dashboard...</span>
        </div>
    );

    const totalSpent = orders.reduce((s, o) => s + parseFloat(o.total_amount || o.order_amount || 0), 0);
    const completed = orders.filter(o => o.order_status === "Completed").length;
    const initials = (session.user_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const tier = orders.length >= 10 ? "Gold" : orders.length >= 5 ? "Silver" : "Bronze";
    const tierColor = tier === "Gold" ? S.gold : tier === "Silver" ? "#94a3b8" : "#cd7f32";

    const tabs = [
        { key: "overview", label: "Overview", icon: "📊" },
        { key: "orders", label: "Orders", icon: "📦" },
        { key: "wishlist", label: "Wishlist", icon: "♡" },
        { key: "cart", label: "Cart", icon: "🛒" },
        { key: "profile", label: "Profile", icon: "👤" },
    ];

    const statCards = [
        { icon: "📦", label: "Total Orders", val: orders.length, color: S.accent, bg: "rgba(99,102,241,0.12)", to: "/orders" },
        { icon: "✅", label: "Completed", val: completed, color: S.success, bg: "rgba(16,185,129,0.12)", to: "/orders" },
        { icon: "♡", label: "Wishlist", val: wishlist.length, color: S.gold, bg: "rgba(245,158,11,0.12)", to: "/wishlist" },
        { icon: "🛒", label: "Cart Items", val: cartItems.length, color: "#0ea5e9", bg: "rgba(14,165,233,0.12)", to: "/cart" },
        { icon: "💰", label: "Total Spent", val: `₹${totalSpent.toLocaleString()}`, color: S.success, bg: "rgba(16,185,129,0.12)", to: "/orders" },
        { icon: "⭐", label: "Member Since", val: "2024", color: S.gold, bg: "rgba(245,158,11,0.12)", to: "/dashboard" },
    ];

    /* ── Reusable sub-components ── */
    const MiniCard = ({ item, i }) => {
        const img = item.product_image || item.wishlist_product_image;
        const name = item.product_name || item.wishlist_product_name || "Product";
        const price = item.product_price || item.wishlist_product_price || "0";
        const pid = item.product_id || item.wishlist_product_id;
        return (
            <div key={i} onClick={() => navigate(`/product-details/${pid}`)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: "10px", cursor: "pointer" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {img && <img src={img} alt={name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: S.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: S.accent }}>₹{price}</div>
                </div>
            </div>
        );
    };

    const OrderRow = ({ o, i }) => {
        const done = o.order_status === "Completed";
        return (
            <div key={i} onClick={() => navigate(`/order-details/${o.order_id}`)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: "12px", cursor: "pointer", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = S.borderH}
                onMouseLeave={e => e.currentTarget.style.borderColor = S.border}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", fontSize: "15px" }}>
                    {done ? "✓" : "⏳"}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: S.text }}>Order #{o.order_id}</div>
                    <div style={{ fontSize: "11px", color: S.muted }}>{o.order_date || "N/A"} · {o.payment_method || "N/A"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: S.accent }}>₹{o.total_amount || o.order_amount || "0"}</div>
                    <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 700, background: done ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: done ? S.success : S.gold }}>
                        {o.order_status || "Processing"}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-xl py-4 px-3 px-md-4">

            {/* ── Hero ── */}
            <div style={{ background: "linear-gradient(135deg,var(--sz-surface) 0%,var(--sz-surface2) 100%)", border: `1px solid ${S.border}`, borderRadius: "18px", padding: "28px 32px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle,var(--sz-glow) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    {/* Avatar */}
                    <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg,var(--sz-accent),var(--sz-accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "5px", background: "rgba(16,185,129,0.12)", color: S.success, fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                            ● Active Account
                        </div>
                        <h1 style={{ fontSize: "clamp(20px,3.5vw,30px)", fontWeight: 800, color: S.text, margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
                            Welcome back, <span style={{ color: S.accent }}>{session.user_name || "Shopper"}</span> 👋
                        </h1>
                        <div style={{ fontSize: "13px", color: S.muted }}>
                            {session.user_email && <span style={{ marginRight: "16px" }}>✉️ {session.user_email}</span>}
                            {session.user_mobile && <span>📱 {session.user_mobile}</span>}
                        </div>
                    </div>
                    <div style={{ padding: "6px 14px", borderRadius: "8px", background: `rgba(${tier === "Gold" ? "245,158,11" : tier === "Silver" ? "148,163,184" : "205,127,50"},.12)`, border: `1px solid ${tierColor}40`, color: tierColor, fontSize: "12px", fontWeight: 700 }}>
                        🏅 {tier} Member
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="row g-2 mb-3">
                {statCards.map(s => (
                    <div key={s.label} className="col-6 col-md-4 col-lg-2">
                        <div onClick={() => navigate(s.to)}
                            style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "14px 12px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = S.borderH; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.transform = "none"; }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", margin: "0 auto 8px" }}>
                                {s.icon}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                            <div style={{ fontSize: "10px", color: S.muted, marginTop: "4px", fontWeight: 500 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: "flex", gap: "4px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "5px", marginBottom: "20px", overflowX: "auto" }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        style={{
                            display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "8px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s",
                            background: activeTab === t.key ? S.accent : "transparent",
                            color: activeTab === t.key ? "#fff" : S.muted,
                            boxShadow: activeTab === t.key ? "0 4px 12px rgba(99,102,241,0.3)" : "none"
                        }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
                <div className="row g-3">
                    {/* Recent Orders */}
                    <div className="col-lg-7">
                        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <div style={{ fontSize: "14px", fontWeight: 700, color: S.text }}>📦 Recent Orders</div>
                                <Link to="/orders" style={{ fontSize: "12px", color: S.accent, textDecoration: "none", fontWeight: 600 }}>View all →</Link>
                            </div>
                            {orders.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "32px 0" }}>
                                    <div style={{ fontSize: "32px", opacity: .3 }}>📦</div>
                                    <div style={{ color: S.muted, fontSize: "13px", marginTop: "8px" }}>No orders yet</div>
                                    <button onClick={() => navigate("/products")} style={{ marginTop: "12px", padding: "8px 18px", background: S.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>Start Shopping</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {orders.slice(0, 5).map((o, i) => <OrderRow key={i} o={o} i={i} />)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="col-lg-5" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {/* Quick Actions */}
                        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "20px" }}>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: S.text, marginBottom: "14px" }}>⚡ Quick Actions</div>
                            <div className="row g-2">
                                {[
                                    { icon: "🛍️", label: "Products", to: "/products", color: S.accent },
                                    { icon: "♡", label: "Wishlist", to: "/wishlist", color: S.gold },
                                    { icon: "🛒", label: "Cart", to: "/cart", color: "#0ea5e9" },
                                    { icon: "📋", label: "Orders", to: "/orders", color: S.success },
                                    { icon: "⊞", label: "Categories", to: "/categories", color: S.accent2 },
                                    { icon: "ℹ️", label: "About", to: "/about", color: S.muted },
                                ].map(a => (
                                    <div key={a.label} className="col-6">
                                        <div onClick={() => navigate(a.to)}
                                            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "9px", background: S.surface2, border: `1px solid ${S.border}`, cursor: "pointer", transition: "all .2s" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = S.borderH; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.surface2; }}>
                                            <span style={{ fontSize: "16px", color: a.color }}>{a.icon}</span>
                                            <span style={{ fontSize: "12px", fontWeight: 600, color: S.text }}>{a.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wishlist preview */}
                        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "20px", flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <div style={{ fontSize: "14px", fontWeight: 700, color: S.text }}>♡ Saved Items</div>
                                <Link to="/wishlist" style={{ fontSize: "12px", color: S.accent, textDecoration: "none", fontWeight: 600 }}>View all →</Link>
                            </div>
                            {wishlist.length === 0
                                ? <div style={{ color: S.muted, fontSize: "13px", textAlign: "center", padding: "20px 0" }}>Nothing saved yet</div>
                                : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{wishlist.slice(0, 4).map((item, i) => <MiniCard key={i} item={item} i={i} />)}</div>
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === "orders" && (
                <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: S.text }}>📦 All Orders ({orders.length})</div>
                        <button onClick={() => navigate("/products")} style={{ padding: "7px 14px", background: S.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>+ Shop Now</button>
                    </div>
                    {orders.length === 0
                        ? <div style={{ textAlign: "center", padding: "40px" }}><div style={{ fontSize: "36px", opacity: .3 }}>📦</div><div style={{ color: S.muted, marginTop: "8px" }}>No orders yet</div></div>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{orders.map((o, i) => <OrderRow key={i} o={o} i={i} />)}</div>
                    }
                </div>
            )}

            {/* ── WISHLIST ── */}
            {activeTab === "wishlist" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: S.text }}>♡ Wishlist ({wishlist.length})</div>
                        <Link to="/wishlist" style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${S.border}`, color: S.text, borderRadius: "8px", fontWeight: 600, fontSize: "12px", textDecoration: "none" }}>Manage →</Link>
                    </div>
                    {wishlist.length === 0
                        ? <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "48px", textAlign: "center" }}><div style={{ fontSize: "36px", opacity: .3 }}>♡</div><div style={{ color: S.muted, marginTop: "8px" }}>Nothing saved yet</div></div>
                        : <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-3">{wishlist.map((item, i) => (
                            <div key={i} className="col">
                                <div onClick={() => navigate(`/product-details/${item.product_id || item.wishlist_product_id}`)}
                                    style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}>
                                    <div style={{ background: S.surface2, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                                        {(item.product_image || item.wishlist_product_image) && <img src={item.product_image || item.wishlist_product_image} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
                                    </div>
                                    <div style={{ padding: "10px" }}>
                                        <div style={{ fontSize: "12px", fontWeight: 600, color: S.text, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product_name || item.wishlist_product_name}</div>
                                        <div style={{ fontSize: "14px", fontWeight: 800, color: S.accent }}>₹{item.product_price || item.wishlist_product_price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}</div>
                    }
                </div>
            )}

            {/* ── CART ── */}
            {activeTab === "cart" && (
                <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: S.text }}>🛒 Cart ({cartItems.length})</div>
                        <Link to="/cart" style={{ padding: "7px 14px", background: S.accent, color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "12px", textDecoration: "none" }}>Go to Cart →</Link>
                    </div>
                    {cartItems.length === 0
                        ? <div style={{ textAlign: "center", padding: "40px" }}><div style={{ fontSize: "36px", opacity: .3 }}>🛒</div><div style={{ color: S.muted, marginTop: "8px" }}>Cart is empty</div></div>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{cartItems.map((item, i) => (
                            <div key={i} onClick={() => navigate(`/product-details/${item.product_id}`)}
                                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: "12px", cursor: "pointer" }}>
                                <div style={{ width: "48px", height: "48px", background: S.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                    {item.product_image && <img src={item.product_image} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />}
                                </div>
                                <div style={{ flex: 1 }}><div style={{ fontSize: "13px", fontWeight: 600, color: S.text }}>{item.product_name}</div><div style={{ fontSize: "11px", color: S.muted }}>Qty: {item.product_qty || 1}</div></div>
                                <div style={{ fontSize: "15px", fontWeight: 800, color: S.accent }}>₹{item.product_price}</div>
                            </div>
                        ))}</div>
                    }
                </div>
            )}

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
                <div className="row g-3">
                    <div className="col-lg-4">
                        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                            <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg,var(--sz-accent),var(--sz-accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#fff", margin: "0 auto 16px", boxShadow: "0 0 24px rgba(99,102,241,0.35)" }}>
                                {initials}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: S.text, marginBottom: "4px" }}>{session.user_name || "User"}</div>
                            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "6px", background: `rgba(${tier === "Gold" ? "245,158,11" : tier === "Silver" ? "148,163,184" : "205,127,50"},.12)`, color: tierColor, fontSize: "11px", fontWeight: 700, marginBottom: "20px" }}>
                                🏅 {tier} Member
                            </div>
                            <div style={{ height: "1px", background: S.border, margin: "0 0 16px" }} />
                            {[
                                { icon: "📦", label: "Total Orders", val: orders.length },
                                { icon: "✅", label: "Completed", val: completed },
                                { icon: "♡", label: "Wishlist", val: wishlist.length },
                                { icon: "💰", label: "Total Spent", val: `₹${totalSpent.toLocaleString()}` },
                            ].map(s => (
                                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ fontSize: "13px", color: S.muted }}>{s.icon} {s.label}</span>
                                    <span style={{ fontSize: "13px", fontWeight: 800, color: S.text }}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: "14px", padding: "24px" }}>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: S.text, marginBottom: "16px" }}>👤 Account Info</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                                {[
                                    { icon: "👤", label: "Full Name", val: session.user_name },
                                    { icon: "✉️", label: "Email", val: session.user_email || "Not provided" },
                                    { icon: "📱", label: "Mobile", val: session.user_mobile || "Not provided" },
                                    { icon: "🔑", label: "User ID", val: `#${session.user_id}` },
                                    { icon: "⭐", label: "Account", val: "Standard Customer" },
                                    { icon: "📅", label: "Since", val: "2024" },
                                ].map(f => (
                                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: "10px" }}>
                                        <span style={{ fontSize: "18px", width: "24px", flexShrink: 0 }}>{f.icon}</span>
                                        <div>
                                            <div style={{ fontSize: "10px", color: S.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</div>
                                            <div style={{ fontSize: "13px", fontWeight: 600, color: S.text }}>{f.val}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: "1px", background: S.border, margin: "0 0 16px" }} />
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                <button onClick={() => navigate("/orders")} style={{ padding: "9px 18px", background: S.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>📦 My Orders</button>
                                <button onClick={() => navigate("/wishlist")} style={{ padding: "9px 18px", background: "transparent", color: S.text, border: `1px solid ${S.border}`, borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>♡ Wishlist</button>
                                <button onClick={() => { localStorage.removeItem("userSession"); navigate("/login"); }} style={{ padding: "9px 18px", background: "rgba(239,68,68,0.08)", color: S.danger, border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;