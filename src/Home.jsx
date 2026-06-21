import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import fashionImg from "./assets/fashion.png";
import electronicsImg from "./assets/electronics.png";

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

                        {/* Bootstrap Crossfade Carousel — Fashion & Electronics */}
                        <div className="col-md-6 d-flex align-items-center justify-content-center p-2 p-md-3">
                            <div
                                id="heroCarousel"
                                className="carousel slide carousel-fade w-100"
                                data-bs-ride="carousel"
                                data-bs-interval="3500"
                                style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}
                            >
                                <div className="carousel-indicators" style={{ bottom: "10px" }}>
                                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"
                                        style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", border: "none", opacity: 0.9, margin: "0 3px" }}
                                        aria-current="true" aria-label="Fashion" />
                                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"
                                        style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", border: "none", margin: "0 3px" }}
                                        aria-label="Electronics" />
                                </div>

                                <div className="carousel-inner">
                                    {/* Slide 1 — Fashion */}
                                    <div className="carousel-item active">
                                        <img src={fashionImg} alt="Fashion & Clothing Store"
                                            style={{ width: "100%", height: "320px", objectFit: "cover", objectPosition: "center", display: "block" }} />
                                        <div className="carousel-caption" style={{
                                            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 45%, transparent 100%)",
                                            bottom: 0, left: 0, right: 0, padding: "48px 18px 18px", textAlign: "left", borderRadius: "0 0 14px 14px"
                                        }}>
                                            <div style={{ fontSize: "10px", fontWeight: 800, color: "#f59e0b", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>✦ Fashion & Style</div>
                                            <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Premium Clothing Collection</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", marginTop: "2px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Curated fashion for every occasion</div>
                                        </div>
                                    </div>

                                    {/* Slide 2 — Electronics */}
                                    <div className="carousel-item">
                                        <img src={electronicsImg} alt="Electronics & Tech Store"
                                            style={{ width: "100%", height: "320px", objectFit: "cover", objectPosition: "center", display: "block" }} />
                                        <div className="carousel-caption" style={{
                                            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 45%, transparent 100%)",
                                            bottom: 0, left: 0, right: 0, padding: "48px 18px 18px", textAlign: "left", borderRadius: "0 0 14px 14px"
                                        }}>
                                            <div style={{ fontSize: "10px", fontWeight: 800, color: "#8398ff", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>⚡ Tech Hub</div>
                                            <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Latest Electronics & Gadgets</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", marginTop: "2px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Cutting-edge tech at your fingertips</div>
                                        </div>
                                    </div>
                                </div>

                                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" style={{ width: "36px", left: "8px" }}>
                                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px" }}>‹</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" style={{ width: "36px", right: "8px" }}>
                                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px" }}>›</span>
                                </button>
                            </div>
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