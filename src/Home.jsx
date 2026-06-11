import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function HeroVisual({ navigate }) {
    return (
        <div onClick={() => navigate("/products")} className="w-100" style={{ cursor: "pointer" }}>
            <svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
                <defs>
                    <linearGradient id="laptopLid" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#1e293b" /></linearGradient>
                    <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
                    <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="transparent" /><stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                    <filter id="softShadow"><feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.5" /></filter>
                </defs>
                <ellipse cx="200" cy="170" rx="160" ry="100" fill="#6366f1" fillOpacity="0.06" />
                <ellipse cx="390" cy="130" rx="100" ry="80" fill="#8b5cf6" fillOpacity="0.08" />
                <g filter="url(#softShadow)">
                    <rect x="80" y="30" width="238" height="152" rx="10" fill="url(#laptopLid)" />
                    <rect x="88" y="38" width="222" height="138" rx="6" fill="#0a0a14" />
                    <rect x="92" y="42" width="214" height="130" rx="4" fill="#0f172a" />
                    <rect x="92" y="42" width="214" height="20" fill="#1e293b" />
                    <rect x="92" y="42" width="214" height="3" fill="#6366f1" fillOpacity="0.8" />
                    <circle cx="103" cy="52" r="4" fill="#6366f1" fillOpacity="0.7" />
                    <rect x="112" y="49" width="40" height="6" rx="3" fill="#334155" />
                    <rect x="158" y="49" width="28" height="6" rx="3" fill="#334155" />
                    <rect x="264" y="49" width="22" height="6" rx="3" fill="#6366f1" fillOpacity="0.8" />
                    <rect x="100" y="70" width="90" height="92" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                    <rect x="106" y="76" width="78" height="48" rx="4" fill="#0f172a" />
                    <rect x="122" y="86" width="46" height="30" rx="3" fill="#334155" />
                    <rect x="125" y="89" width="40" height="24" rx="2" fill="#1e40af" fillOpacity="0.6" />
                    <rect x="110" y="128" width="40" height="5" rx="2" fill="#334155" />
                    <rect x="112" y="148" width="54" height="10" rx="4" fill="#6366f1" fillOpacity="0.85" />
                    <text x="139" y="157" fontSize="6" fill="white" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">Add to Cart</text>
                    <rect x="200" y="70" width="90" height="92" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                    <rect x="206" y="76" width="78" height="48" rx="4" fill="#0f172a" />
                    <rect x="229" y="82" width="24" height="38" rx="4" fill="#334155" />
                    <rect x="231" y="85" width="20" height="32" rx="2" fill="#0ea5e9" fillOpacity="0.5" />
                    <rect x="212" y="148" width="54" height="10" rx="4" fill="#10b981" fillOpacity="0.85" />
                    <text x="239" y="157" fontSize="6" fill="white" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">Add to Cart</text>
                    <circle cx="199" cy="34" r="2.5" fill="#1e293b" /><circle cx="199" cy="34" r="1.2" fill="#374151" />
                </g>
                <g filter="url(#softShadow)">
                    <path d="M60 182 Q60 178 65 178 L333 178 Q338 178 338 182 L344 198 Q344 202 340 202 L58 202 Q54 202 54 198 Z" fill="#1e293b" />
                    <rect x="166" y="184" width="66" height="12" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
                </g>
                <g filter="url(#softShadow)">
                    <rect x="358" y="52" width="80" height="144" rx="14" fill="url(#phoneGrad)" stroke="#334155" strokeWidth="1" />
                    <rect x="362" y="60" width="72" height="128" rx="10" fill="#0a0f1e" />
                    <rect x="386" y="60" width="24" height="6" rx="3" fill="#1e293b" />
                    <rect x="362" y="66" width="72" height="12" fill="#111827" />
                    <rect x="366" y="82" width="64" height="80" rx="6" fill="#1e293b" />
                    <rect x="370" y="86" width="56" height="36" rx="4" fill="#0f172a" />
                    <rect x="381" y="90" width="34" height="28" rx="5" fill="#374151" />
                    <circle cx="398" cy="104" r="10" fill="#1e40af" fillOpacity="0.4" />
                    <line x1="398" y1="97" x2="398" y2="104" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="398" y1="104" x2="403" y2="104" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="370" y="142" width="56" height="14" rx="5" fill="#6366f1" fillOpacity="0.85" />
                    <text x="398" y="152" fontSize="5.5" fill="white" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">Buy Now</text>
                    <rect x="385" y="178" width="26" height="3" rx="2" fill="#374151" />
                    <rect x="357" y="90" width="2" height="16" rx="1" fill="#374151" />
                    <rect x="438" y="95" width="2" height="22" rx="1" fill="#374151" />
                </g>
                <rect x="22" y="58" width="90" height="34" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="32" y="72" fontSize="10" fill="#6366f1" fontFamily="sans-serif">🚚</text>
                <text x="46" y="72" fontSize="7" fill="#f1f1f3" fontFamily="sans-serif" fontWeight="700">Free Shipping</text>
                <text x="46" y="82" fontSize="6" fill="#6b7280" fontFamily="sans-serif">On all orders</text>
                <rect x="22" y="108" width="82" height="34" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="32" y="122" fontSize="10" fill="#f59e0b" fontFamily="sans-serif">★</text>
                <text x="46" y="122" fontSize="8" fill="#f59e0b" fontFamily="sans-serif" fontWeight="700">4.9 / 5.0</text>
                <text x="46" y="132" fontSize="6" fill="#6b7280" fontFamily="sans-serif">50K+ Reviews</text>
                <rect x="22" y="158" width="82" height="34" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="32" y="172" fontSize="10" fill="#10b981" fontFamily="sans-serif">🔒</text>
                <text x="46" y="172" fontSize="7" fill="#f1f1f3" fontFamily="sans-serif" fontWeight="700">Secure Pay</text>
                <text x="46" y="182" fontSize="6" fill="#6b7280" fontFamily="sans-serif">100% Safe</text>
                <rect x="80" y="202" width="260" height="1.5" rx="1" fill="url(#glowLine)" />
                <rect x="130" y="214" width="120" height="36" rx="10" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="160" y="228" fontSize="7" fill="#a5b4fc" fontFamily="sans-serif" fontWeight="600">Starting from</text>
                <text x="160" y="243" fontSize="13" fill="#6366f1" fontFamily="sans-serif" fontWeight="800">₹250 only</text>
                <text x="140" y="236" fontSize="16" fill="#6366f1" fontFamily="sans-serif">🏷️</text>
                <rect x="310" y="216" width="120" height="28" rx="14" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="340" y="226" fontSize="7" fill="#10b981" fontFamily="sans-serif" fontWeight="700">New Arrivals</text>
                <text x="340" y="237" fontSize="6" fill="#6b7280" fontFamily="sans-serif">10,000+ Products</text>
                <circle cx="460" cy="60" r="3" fill="#6366f1" fillOpacity="0.5" />
                <circle cx="474" cy="75" r="2" fill="#8b5cf6" fillOpacity="0.4" />
            </svg>
        </div>
    );
}

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    /* ── Rotating words ── */
    const rotatingWords = ["Premium", "Exclusive", "Legendary", "Curated", "Next-Gen", "Handpicked", "World-Class", "Unmatched"];
    const [wordIndex, setWordIndex] = useState(0);
    const [wordVisible, setWordVisible] = useState(true);

    // Check for payment success on location change
    useEffect(() => {
        if (location.state?.paymentSuccess) {
            setSuccessMessage(location.state?.message || "Payment successful! Your order has been placed.");
            setShowSuccess(true);
            // Clear the state so it doesn't show again on refresh
            window.history.replaceState({}, document.title);
            // Auto-hide after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
    }, [location]);

    // Rotating words animation
    useEffect(() => {
        const interval = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIndex(prev => (prev + 1) % rotatingWords.length);
                setWordVisible(true);
            }, 400);
        }, 2000);
        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    // Fetch products
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api-list-product.php`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
        }).then(r => {
            if (r.data?.product_list) setProducts(r.data.product_list.slice(0, 16));
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const features = [
        { icon: "🚚", title: "Free Shipping", sub: "Orders above ₹499" },
        { icon: "🔒", title: "Secure Payments", sub: "100% protected" },
        { icon: "↩️", title: "Easy Returns", sub: "30-day policy" },
        { icon: "🎧", title: "24/7 Support", sub: "Always here for you" },
    ];

    return (
        <>
            {/* Success Toast Notification */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        maxWidth: '90vw',
                        whiteSpace: 'nowrap'
                    }}>
                        <span style={{ fontSize: '20px' }}>✅</span>
                        {successMessage}
                        <button
                            onClick={() => setShowSuccess(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                marginLeft: '8px',
                                fontSize: '16px'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                /* Dark mode — default */
                .hero-plain {
                    color: #6366f1 !important;
                    -webkit-text-fill-color: #6366f1 !important;
                    display: inline;
                }
                .hero-accent {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                    display: inline-block;
                    transition: opacity 0.4s ease, transform 0.4s ease;
                    min-width: 10px;
                }
                .hero-accent.fade-out {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                .hero-accent.fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                /* Light mode overrides */
                html[data-theme="light"] .hero-plain {
                    color: #6366f1 !important;
                    -webkit-text-fill-color: #6366f1 !important;
                }
                html[data-theme="light"] .hero-accent {
                    color: #0f172a !important;
                    -webkit-text-fill-color: #0f172a !important;
                }
            `}</style>

            <div className="container-xl py-4 px-3 px-md-4">
                {/* Hero */}
                <div className="sz-hero mb-4">
                    <div className="sz-hero-glow1" /><div className="sz-hero-glow2" />
                    <div className="row g-0 align-items-center" style={{ minHeight: "340px" }}>
                        <div className="col-md-6 p-4 p-md-5 position-relative" style={{ zIndex: 1 }}>
                            <span className="sz-chip sz-chip-accent mb-3">🛍️ New Arrivals 2026</span>
                            <h1 className="sz-hero-title mb-3">
                                <span className="hero-plain">Discover</span><br />
                                <span className={`hero-accent ${wordVisible ? "fade-in" : "fade-out"}`}>
                                    {rotatingWords[wordIndex]}
                                </span><br />
                                <span className="hero-plain">Products</span>
                            </h1>
                            <p className="sz-muted mb-4" style={{ maxWidth: "340px", lineHeight: "1.65" }}>
                                Curated selection of top-quality items delivered fast to your doorstep.
                            </p>
                            <div className="d-flex gap-2 mb-4">
                                <button className="sz-btn sz-btn-primary" onClick={() => navigate("/products")}>Shop Now →</button>
                                <button className="sz-btn sz-btn-outline" onClick={() => navigate("/categories")}>Browse Categories</button>
                            </div>
                            <div className="d-flex gap-4 pt-3" style={{ borderTop: "1px solid var(--sz-border)" }}>
                                {[["10K+", "Products"], ["50K+", "Customers"], ["4.9★", "Rating"]].map(([v, l]) => (
                                    <div key={l}><div className="sz-stat-val">{v}</div><div className="sz-stat-lbl">{l}</div></div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-center p-3 p-md-4">
                            <HeroVisual navigate={navigate} />
                        </div>
                    </div>
                </div>

                {/* Feature Strip */}
                <div className="row g-2 mb-5">
                    {features.map(f => (
                        <div key={f.title} className="col-6 col-md-3">
                            <div className="sz-feat-card d-flex align-items-center gap-2 p-3 h-100">
                                <span style={{ fontSize: "20px" }}>{f.icon}</span>
                                <div>
                                    <div className="sz-text fw-bold" style={{ fontSize: "13px" }}>{f.title}</div>
                                    <div className="sz-muted" style={{ fontSize: "11px" }}>{f.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Products */}
                <div className="mb-4">
                    <div className="sz-sec-label">Featured Collection</div>
                    <div className="sz-sec-title">Best Products</div>
                    <div className="sz-sec-sub">Hand-picked items just for you</div>
                </div>

                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
                        <div className="sz-spinner" /><span className="sz-muted">Loading products...</span>
                    </div>
                ) : (
                    <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-3">
                        {products.map((p, i) => (
                            <div key={p.product_id} className="col">
                                <div className="sz-product-card h-100 sz-fade-up" style={{ animationDelay: `${i * 40}ms` }}
                                    onClick={() => navigate(`/product-details/${p.product_id}`)}>
                                    <div className="sz-product-img">
                                        <img src={p.product_image} alt={p.product_name} />
                                    </div>
                                    <div className="p-3 d-flex flex-column gap-2 flex-grow-1">
                                        <div className="sz-text fw-semibold" style={{ fontSize: "13.5px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.product_name}</div>
                                        <div className="d-flex align-items-center justify-content-between mt-auto">
                                            <span className="sz-price">₹{p.product_price}</span>
                                            <span className="sz-accent-c fw-semibold" style={{ fontSize: "11px" }}>View →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;