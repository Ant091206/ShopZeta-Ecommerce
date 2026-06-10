import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function OrderDetails() {
    const { orderId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = API_TOKEN;

    useEffect(() => {
        const s = JSON.parse(localStorage.getItem("userSession"));
        if (!orderId || !s?.user_id) { setLoading(false); return; }
        const fd = new FormData(); fd.append("user_id", s.user_id); fd.append("order_id", orderId);
        axios.post(`${API_BASE}/api-list-order-detail.php`, fd, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setProducts(r.data?.order_detail_list || r.data?.order_details || (Array.isArray(r.data) ? r.data : [])))
            .catch(console.error).finally(() => setLoading(false));
    }, [orderId]);

    const session = JSON.parse(localStorage.getItem("userSession"));
    if (!session) return (
        <div className="container-xl py-5 px-3 text-center">
            <button className="sz-btn sz-btn-primary" onClick={() => navigate("/login")}>Sign In</button>
        </div>
    );

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
            <div className="sz-spinner" /><span className="sz-muted">Loading order details...</span>
        </div>
    );

    return (
        <div className="container-xl py-4 px-3 px-md-4" style={{ maxWidth: "800px" }}>
            <button className="sz-btn sz-btn-outline mb-4" style={{ fontSize: "13px" }} onClick={() => navigate("/orders")}>← Back to Orders</button>
            <div className="mb-4">
                <div className="sz-sec-label">Order Details</div>
                <div className="sz-sec-title d-flex align-items-center gap-2">
                    Order <span className="sz-accent-c">#{orderId}</span>
                </div>
                <div className="sz-sec-sub">{products.length} item{products.length !== 1 ? "s" : ""} in this order</div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-5 sz-card">
                    <div style={{ fontSize: "44px", opacity: .4 }}>📦</div>
                    <div className="sz-text fw-bold mt-3">No items found</div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {products.map((item, i) => (
                        <div key={item.product_id || i} className="sz-cart-item d-flex align-items-center gap-3 p-3 sz-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="sz-cart-thumb">
                                {item.product_image || item.image
                                    ? <img src={item.product_image || item.image} alt={item.product_name} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                                    : <span style={{ fontSize: "22px", opacity: .4 }}>📦</span>
                                }
                            </div>
                            <div className="flex-grow-1">
                                <div className="sz-text fw-semibold" style={{ fontSize: "14px" }}>{item.product_name || "Item"}</div>
                                <div className="sz-muted" style={{ fontSize: "12px" }}>Qty: <strong className="sz-text">{item.product_qty || item.qty || 1}</strong></div>
                            </div>
                            <div className="text-end">
                                <div className="sz-muted" style={{ fontSize: "10px", textTransform: "uppercase" }}>Price</div>
                                <div className="sz-price" style={{ fontSize: "18px" }}>₹{item.product_price || item.price || "0"}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderDetails;