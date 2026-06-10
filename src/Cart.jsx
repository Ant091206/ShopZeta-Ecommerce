import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function Cart({ userSession }) {
    const [cartItems, setCartItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState("0");
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();
    const token = API_TOKEN;

    const fetchCart = async (s) => {
        try {
            const fd = new FormData(); fd.append("user_id", s.user_id);
            const r = await axios.post(`${API_BASE}/api-list-cart.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
            const items = r.data?.cart || r.data?.cart_list || [];
            setCartItems(items); setGrandTotal(r.data?.grand_total || "0");
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => {
        const s = userSession || JSON.parse(localStorage.getItem("userSession"));
        if (!s?.user_id) { setLoading(false); return; }
        fetchCart(s);
    }, [userSession]);

    const handleRemove = async (e, cartId) => {
        e.stopPropagation();
        if (!cartId || !window.confirm("Remove this item?")) return;
        setRemovingId(cartId);
        const fd = new FormData(); fd.append("cart_id", cartId);
        try {
            const r = await axios.post(`${API_BASE}/api-delete-cart.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
            if (r.data.flag === "1" || r.data.status === "1") {
                const s = userSession || JSON.parse(localStorage.getItem("userSession"));
                if (s) fetchCart(s); else setCartItems(c => c.filter(i => i.cart_id !== cartId));
            }
        } catch (e) { console.error(e); } finally { setRemovingId(null); }
    };

    const session = userSession || JSON.parse(localStorage.getItem("userSession"));

    if (!session) return (
        <div className="container-xl py-5 px-3">
            <div className="sz-card text-center py-5 mx-auto" style={{ maxWidth: "480px" }}>
                <div style={{ fontSize: "44px" }}>🛒</div>
                <div className="sz-sec-title mt-3 mb-2">Your Cart</div>
                <p className="sz-muted mb-4">Sign in to view your saved items</p>
                <button className="sz-btn sz-btn-primary" onClick={() => navigate("/login")}>Sign In to Continue</button>
            </div>
        </div>
    );

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
            <div className="sz-spinner" /><span className="sz-muted">Loading your cart...</span>
        </div>
    );

    return (
        <div className="container-xl py-4 px-3 px-md-4">
            <div className="mb-4">
                <div className="sz-sec-label">Checkout</div>
                <div className="sz-sec-title">Your Cart</div>
                <div className="sz-sec-sub">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</div>
            </div>

            {cartItems.length === 0 ? (
                <div className="sz-card text-center py-5">
                    <div style={{ fontSize: "44px", opacity: .4 }}>🛒</div>
                    <div className="sz-text fw-bold fs-5 mt-3 mb-2">Your cart is empty</div>
                    <p className="sz-muted mb-4">Add some products to get started</p>
                    <button className="sz-btn sz-btn-primary" onClick={() => navigate("/products")}>Browse Products</button>
                </div>
            ) : (
                <div className="row g-3 align-items-start">
                    <div className="col-lg-8 d-flex flex-column gap-3">
                        {cartItems.map((item, i) => (
                            <div key={item.cart_id || i} className="sz-cart-item d-flex align-items-center gap-3 p-3 sz-fade-up"
                                style={{ animationDelay: `${i * 50}ms`, cursor: "pointer" }}
                                onClick={() => navigate(`/product-details/${item.product_id}`)}>
                                <div className="sz-cart-thumb">
                                    {item.product_image && <img src={item.product_image} alt={item.product_name} style={{ width: "52px", height: "52px", objectFit: "contain" }} />}
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="sz-text fw-semibold text-truncate" style={{ fontSize: "14px" }}>{item.product_name || "Unknown Item"}</div>
                                    <div className="sz-muted" style={{ fontSize: "12px" }}>Qty: {item.product_qty || 1}</div>
                                </div>
                                <span className="sz-price">{`₹${item.product_price || "0"}`}</span>
                                <button className="sz-btn sz-btn-danger p-2" style={{ borderRadius: "8px", lineHeight: 1 }}
                                    onClick={(e) => handleRemove(e, item.cart_id)} disabled={removingId === item.cart_id}>
                                    {removingId === item.cart_id ? "…" : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        <div className="sz-summary p-4">
                            <div className="sz-text fw-bold mb-3" style={{ fontSize: "16px" }}>Order Summary</div>
                            <div className="d-flex justify-content-between mb-2 sz-muted" style={{ fontSize: "14px" }}><span>Subtotal</span><span className="sz-text fw-semibold">₹{grandTotal}</span></div>
                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: "14px" }}><span className="sz-muted">Shipping</span><span className="sz-success-c fw-bold">FREE</span></div>
                            <hr className="sz-hr" />
                            <div className="d-flex justify-content-between fw-bold mb-4"><span className="sz-text">Total</span><span className="sz-price" style={{ fontSize: "22px" }}>₹{grandTotal}</span></div>
                            <button className="sz-btn sz-btn-primary w-100 mb-2" onClick={() => navigate("/checkout", { state: { amount: grandTotal } })}>Proceed to Checkout →</button>
                            <button className="sz-btn sz-btn-outline w-100" style={{ fontSize: "13px" }} onClick={() => navigate("/products")}>Continue Shopping</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;