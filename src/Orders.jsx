import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = import.meta.env.VITE_API_TOKEN;

    useEffect(() => {
        const s = JSON.parse(localStorage.getItem("userSession"));
        if (!s?.user_id) { setLoading(false); return; }
        const fd = new FormData(); fd.append("user_id", s.user_id);
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api-list-order.php`, fd, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setOrders(r.data?.order_list || r.data?.orders || []))
            .catch(console.error).finally(() => setLoading(false));
    }, []);

    const session = JSON.parse(localStorage.getItem("userSession"));
    if (!session) return (
        <div className="container-xl py-5 px-3">
            <div className="sz-card text-center py-5 mx-auto" style={{ maxWidth: "480px" }}>
                <div style={{ fontSize: "44px" }}>📋</div>
                <div className="sz-sec-title mt-3 mb-2">Your Orders</div>
                <p className="sz-muted mb-4">Sign in to view your order history</p>
                <button className="sz-btn sz-btn-primary" onClick={() => navigate("/login")}>Sign In</button>
            </div>
        </div>
    );

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
            <div className="sz-spinner" /><span className="sz-muted">Loading orders...</span>
        </div>
    );

    return (
        <div className="container-xl py-4 px-3 px-md-4" style={{ maxWidth: "860px" }}>
            <div className="mb-4">
                <div className="sz-sec-label">Order History</div>
                <div className="sz-sec-title">Your Orders</div>
                <div className="sz-sec-sub">Click any order to view details</div>
            </div>

            {orders.length === 0 ? (
                <div className="sz-card text-center py-5">
                    <div style={{ fontSize: "44px", opacity: .4 }}>📦</div>
                    <div className="sz-text fw-bold fs-5 mt-3 mb-2">No orders yet</div>
                    <p className="sz-muted mb-4">Start shopping to see your orders here</p>
                    <button className="sz-btn sz-btn-primary" onClick={() => navigate("/products")}>Start Shopping</button>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {orders.map((order, i) => {
                        const done = order.order_status === "Completed";
                        return (
                            <div key={order.order_id || i} className="sz-order-card sz-fade-up" style={{ animationDelay: `${i * 40}ms` }}
                                onClick={() => navigate(`/order-details/${order.order_id}`)}>
                                <div className="sz-order-head d-flex justify-content-between align-items-center flex-wrap gap-2 px-4 py-3">
                                    <div className="d-flex gap-4">
                                        <div>
                                            <div style={{ fontSize: "10px" }} className="sz-muted text-uppercase fw-bold">Order</div>
                                            <div className="sz-accent-c fw-bold" style={{ fontFamily: "monospace" }}># {order.order_id}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "10px" }} className="sz-muted text-uppercase fw-bold">Date</div>
                                            <div className="sz-text fw-semibold" style={{ fontSize: "13px" }}>{order.order_date || "N/A"}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`sz-chip ${done ? "sz-chip-success" : "sz-chip-gold"}`}>
                                            ● {order.order_status || "Processing"}
                                        </span>
                                        <span className="sz-muted" style={{ fontSize: "12px" }}>View →</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 px-4 py-3">
                                    <div>
                                        <div className="sz-text fw-bold" style={{ fontSize: "14px" }}>{order.shipping_name}</div>
                                        <div className="sz-muted" style={{ fontSize: "12px" }}>{order.shipping_mobile} · {order.payment_method || "N/A"}</div>
                                    </div>
                                    <div className="text-end">
                                        <div className="sz-muted" style={{ fontSize: "11px" }}>Total</div>
                                        <div className="sz-price" style={{ fontSize: "20px" }}>₹{order.total_amount || order.order_amount || "0"}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Orders;