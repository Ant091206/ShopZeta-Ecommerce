import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function Wishlist({ userSession }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();
    const token = API_TOKEN;

    const fetchWishlist = async (s) => {
        try {
            const fd = new FormData(); fd.append("user_id", s.user_id);
            const r = await axios.post(`${API_BASE}/api-list-wishlist.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
            setItems(r.data?.wishlist || r.data?.wishlist_list || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => {
        const s = userSession || JSON.parse(localStorage.getItem("userSession"));
        if (!s?.user_id) { setLoading(false); return; }
        fetchWishlist(s);
    }, [userSession]);

    const handleRemove = async (e, wishlistId) => {
        e.stopPropagation();
        if (!wishlistId || !window.confirm("Remove from wishlist?")) return;
        setRemovingId(wishlistId);
        const fd = new FormData(); fd.append("wishlist_id", wishlistId);
        try {
            const r = await axios.post(`${API_BASE}/api-delete-wishlist.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
            if (r.data.flag === "1" || r.data.status === "1")
                setItems(prev => prev.filter(i => i.wishlist_id !== wishlistId));
        } catch (e) { console.error(e); } finally { setRemovingId(null); }
    };

    const session = userSession || JSON.parse(localStorage.getItem("userSession"));

    if (!session) return (
        <div className="container-xl py-5 px-3">
            <div className="sz-card text-center py-5 mx-auto" style={{ maxWidth: "480px" }}>
                <div style={{ fontSize: "44px" }}>♡</div>
                <div className="sz-sec-title mt-3 mb-2">Your Wishlist</div>
                <p className="sz-muted mb-4">Sign in to view your saved items</p>
                <button className="sz-btn sz-btn-primary" onClick={() => navigate("/login")}>Sign In to Continue</button>
            </div>
        </div>
    );

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
            <div className="sz-spinner" /><span className="sz-muted">Loading wishlist...</span>
        </div>
    );

    return (
        <div className="container-xl py-4 px-3 px-md-4">
            <div className="mb-4">
                <div className="sz-sec-label">Saved Items</div>
                <div className="sz-sec-title">My Wishlist</div>
                <div className="sz-sec-sub">{items.length} saved item{items.length !== 1 ? "s" : ""}</div>
            </div>

            {items.length === 0 ? (
                <div className="sz-card text-center py-5">
                    <div style={{ fontSize: "44px", opacity: .4 }}>♡</div>
                    <div className="sz-text fw-bold fs-5 mt-3 mb-2">Nothing saved yet</div>
                    <p className="sz-muted mb-4">Browse products and tap the heart to save them here</p>
                    <button className="sz-btn sz-btn-primary" onClick={() => navigate("/products")}>Browse Products</button>
                </div>
            ) : (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-3">
                    {items.map((item, i) => {
                        const pid = item.product_id || item.wishlist_product_id;
                        const name = item.product_name || item.wishlist_product_name || "Unknown";
                        const price = item.product_price || item.wishlist_product_price || "0";
                        const img = item.product_image || item.wishlist_product_image;
                        return (
                            <div key={item.wishlist_id || i} className="col">
                                <div className="sz-product-card h-100 sz-fade-up" style={{ animationDelay: `${i * 40}ms` }}
                                    onClick={() => navigate(`/product-details/${pid}`)}>
                                    <div className="sz-product-img position-relative">
                                        {img && <img src={img} alt={name} />}
                                        <button className="sz-wish-rm" onClick={(e) => handleRemove(e, item.wishlist_id)}>
                                            {removingId === item.wishlist_id ? "·" : "✕"}
                                        </button>
                                    </div>
                                    <div className="p-3">
                                        <div className="sz-text fw-semibold mb-2" style={{ fontSize: "13.5px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{name}</div>
                                        <span className="sz-price">₹{price}</span>
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

export default Wishlist;