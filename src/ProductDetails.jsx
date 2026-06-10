import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function ProductDetails({ userSession }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [revName, setRevName] = useState("");
  const [revRate, setRevRate] = useState("");
  const [revMsg, setRevMsg] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = API_TOKEN;

  const fetchReviews = async () => {
    setRevLoading(true);
    try {
      const r = await axios.get(`${API_BASE}/api-list-rating.php`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.data?.rate_list) setReviews(r.data.rate_list.filter(rv => String(rv.product_id) === String(productId)));
      else setReviews([]);
    } catch (e) { console.error(e); } finally { setRevLoading(false); }
  };

  useEffect(() => {
    if (!productId) return;
    axios.get(`${API_BASE}/api-list-product.php?product_id=${productId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data.product_list) setProduct(r.data.product_list[0]); })
      .catch(console.error).finally(() => setLoading(false));
    fetchReviews();
  }, [productId]);

  const addToCart = async () => {
    const s = userSession || JSON.parse(localStorage.getItem("userSession"));
    if (!s?.user_id) { alert("Please login first."); navigate("/login"); return; }
    setCartLoading(true);
    const fd = new FormData(); fd.append("user_id", s.user_id); fd.append("product_id", productId); fd.append("product_qty", "1");
    try {
      const r = await axios.post(`${API_BASE}/api-add-cart.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
      if (r.data.flag === "1" || r.data.status === "1") { setCartAdded(true); setTimeout(() => setCartAdded(false), 2500); }
      else alert(r.data.message || "Could not add to cart.");
    } catch (e) { console.error(e); } finally { setCartLoading(false); }
  };

  const addToWishlist = async () => {
    const s = userSession || JSON.parse(localStorage.getItem("userSession"));
    if (!s?.user_id) { alert("Please login first."); navigate("/login"); return; }
    setWishLoading(true);
    const fd = new FormData(); fd.append("user_id", s.user_id); fd.append("product_id", productId);
    try {
      const r = await axios.post(`${API_BASE}/api-add-wishlist.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
      if (r.data.flag === "1" || r.data.status === "1") { setWishAdded(true); setTimeout(() => setWishAdded(false), 2500); }
      else alert(r.data.message || "Could not add to wishlist.");
    } catch (e) { console.error(e); } finally { setWishLoading(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const s = userSession || JSON.parse(localStorage.getItem("userSession"));
    if (!s?.user_id) { alert("Please login first."); navigate("/login"); return; }
    setRevSubmitting(true);
    const fd = new FormData();
    fd.append("product_id", productId); fd.append("user_id", s.user_id);
    fd.append("rating_number", revRate); fd.append("rating_name", revName); fd.append("rating_message", revMsg);
    try {
      await axios.post(`${API_BASE}/api-add-rating.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
      setRevName(""); setRevRate(""); setRevMsg(""); setShowForm(false); fetchReviews();
    } catch (e) { console.error(e); } finally { setRevSubmitting(false); }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="sz-spinner" /><span className="sz-muted">Loading product...</span>
    </div>
  );
  if (!product) return <div className="container-xl py-4 px-3"><p className="sz-muted">Product not found.</p></div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + Number(r.rating_number), 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="container-xl py-4 px-3 px-md-4" style={{ maxWidth: "960px" }}>
      <button className="sz-btn sz-btn-outline mb-4" style={{ fontSize: "13px" }} onClick={() => navigate(-1)}>← Back</button>

      {/* Main Product Card */}
      <div className="sz-card overflow-hidden mb-4">
        <div className="row g-0">
          {/* Image */}
          <div className="col-md-5 d-flex align-items-center justify-content-center p-5" style={{ background: "var(--sz-surface2)", borderRight: "1px solid var(--sz-border)", minHeight: "360px", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center,rgba(99,102,241,0.06) 0%,transparent 70%)" }} />
            <img src={product.product_image} alt={product.product_name} style={{ maxWidth: "100%", maxHeight: "280px", objectFit: "contain", position: "relative", zIndex: 1 }} />
          </div>
          {/* Info */}
          <div className="col-md-7 p-4 d-flex flex-column gap-3">
            {avgRating && (
              <div className="d-flex align-items-center gap-2">
                <span className="sz-gold-c" style={{ fontSize: "14px" }}>{"★".repeat(Math.round(Number(avgRating)))}</span>
                <span className="sz-muted" style={{ fontSize: "12px" }}>{avgRating} ({reviews.length} reviews)</span>
              </div>
            )}
            <h1 className="sz-text fw-bold mb-0" style={{ fontSize: "clamp(20px,3vw,26px)", lineHeight: "1.3" }}>{product.product_name}</h1>
            <p className="sz-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.7" }}>{product.product_details}</p>
            <div className="sz-price" style={{ fontSize: "34px" }}>₹{product.product_price}</div>
            <div className="d-flex flex-column gap-2">
              <button onClick={addToCart} disabled={cartLoading} className="sz-btn w-100"
                style={{ padding: "13px", background: cartAdded ? "var(--sz-success)" : "var(--sz-accent)", color: "#fff", fontSize: "15px" }}>
                {cartLoading ? "Adding..." : cartAdded ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button onClick={addToWishlist} disabled={wishLoading} className="sz-btn sz-btn-outline w-100"
                style={{ padding: "13px", fontSize: "14px", borderColor: wishAdded ? "var(--sz-gold)" : "", color: wishAdded ? "var(--sz-gold)" : "" }}>
                {wishLoading ? "Saving..." : wishAdded ? "♥ Saved to Wishlist!" : "♡ Add to Wishlist"}
              </button>
            </div>
            <div className="d-flex gap-3 pt-2" style={{ borderTop: "1px solid var(--sz-border)" }}>
              {["🚚 Free Shipping", "🔒 Secure", "↩️ Easy Returns"].map(b => (
                <span key={b} className="sz-muted fw-semibold" style={{ fontSize: "11px" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="sz-card overflow-hidden">
        <div style={{ borderBottom: "1px solid var(--sz-border)" }}>
          <button className="sz-tab active">
            Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
          </button>
        </div>
        <div className="p-4">
          {revLoading ? (
            <div className="d-flex justify-content-center py-3"><div className="sz-spinner" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-4">
              <div style={{ fontSize: "36px", opacity: .4 }}>💬</div>
              <div className="sz-text fw-bold mt-2 mb-1">No reviews yet</div>
              <div className="sz-muted" style={{ fontSize: "13px" }}>Be the first to share your experience</div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev, i) => (
                <div key={rev.rating_id || i} className="sz-review-item p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="sz-reviewer-avatar">{rev.rating_name?.[0]?.toUpperCase() || "U"}</div>
                      <span className="sz-text fw-bold" style={{ fontSize: "14px" }}>{rev.rating_name}</span>
                    </div>
                    <span className="sz-chip sz-chip-gold">{"★".repeat(Number(rev.rating_number))} {rev.rating_number}/5</span>
                  </div>
                  <p className="sz-muted mb-0" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>{rev.rating_message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <button className="sz-btn sz-btn-outline" style={{ fontSize: "13px" }} onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Cancel" : "+ Write a Review"}
            </button>
          </div>

          {showForm && (
            <div className="sz-card p-4 mt-3" style={{ background: "var(--sz-surface2)" }}>
              <div className="sz-text fw-bold mb-3" style={{ fontSize: "17px" }}>Write a Review</div>
              <form onSubmit={submitReview} className="d-flex flex-column gap-3">
                <div><label className="sz-label">Your Name</label><input className="sz-input" type="text" placeholder="Your name" value={revName} onChange={e => setRevName(e.target.value)} required /></div>
                <div>
                  <label className="sz-label">Rating</label>
                  <select className="sz-input" value={revRate} onChange={e => setRevRate(e.target.value)} required>
                    <option value="">Select rating</option>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{"★".repeat(n)} {n} Star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div><label className="sz-label">Your Review</label><textarea className="sz-input" rows="4" placeholder="Share your experience..." value={revMsg} onChange={e => setRevMsg(e.target.value)} required style={{ resize: "vertical" }} /></div>
                <button type="submit" disabled={revSubmitting} className="sz-btn sz-btn-primary" style={{ alignSelf: "flex-start", padding: "10px 22px" }}>
                  {revSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;