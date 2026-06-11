import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const finalAmount = location.state?.amount || "0";
    const [userId, setUserId] = useState("");
    const [formData, setFormData] = useState({ shipping_name: "", shipping_mobile: "", shipping_address: "", payment_method: "COD" });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const s = JSON.parse(localStorage.getItem("userSession"));
        if (!s?.user_id) { alert("Please login to continue."); navigate("/login"); return; }
        setUserId(s.user_id);
    }, [navigate]);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    /* ── Save order in your DB after successful payment ── */
    const saveOrderToDB = async (paymentId) => {
        const fd = new FormData();
        fd.append("user_id", userId);
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
        fd.append("payment_id", paymentId);
        fd.append("payment_status", "Paid");
        await axios.post("http://akashsir.in/atproject/at-shop/api/api-add-order.php", fd, {
            headers: { Authorization: "Bearer dbacace63c8bf2885869b81660c2b289" }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.shipping_name || !formData.shipping_mobile || !formData.shipping_address) {
            alert("Please fill all shipping details."); return;
        }

        /* ── COD: skip Razorpay, save directly ── */
        if (formData.payment_method === "COD") {
            setSubmitting(true);
            try {
                await saveOrderToDB("COD");
                setSuccess(true);
            } catch { alert("Something went wrong."); }
            finally { setSubmitting(false); }
            return;
        }

        /* ── Card / UPI: go through Razorpay ── */
        setSubmitting(true);
        try {
            /* Step 1: Ask your backend to create a Razorpay order */
            const fd = new FormData();
            fd.append("amount", finalAmount);
            const { data: rzpOrder } = await axios.post(
                "/api/create-order",
                { amount: finalAmount },
                { headers: { "Content-Type": "application/json" } }
            );

            if (!rzpOrder.id) { alert("Could not initiate payment. Try again."); setSubmitting(false); return; }

            /* Step 2: Open Razorpay checkout popup */
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,   // rzp_test_XXXX from .env
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                order_id: rzpOrder.id,
                name: "ShopZeta",
                description: "Order Payment",
                image: "/vite.svg",
                prefill: {
                    name: formData.shipping_name,
                    contact: formData.shipping_mobile,
                },
                theme: { color: "#6366f1" },

                /* Step 3: Payment SUCCESS handler */
                handler: async (response) => {
                    /* response contains:
                       razorpay_payment_id, razorpay_order_id, razorpay_signature
                       Send these to your backend to VERIFY the signature */
                    try {
                        const vfd = new FormData();
                        vfd.append("razorpay_payment_id", response.razorpay_payment_id);
                        vfd.append("razorpay_order_id", response.razorpay_order_id);
                        vfd.append("razorpay_signature", response.razorpay_signature);

                        const { data: verify } = await axios.post(
                            "/api/verify-payment",
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        if (verify.valid) {
                            await saveOrderToDB(response.razorpay_payment_id);
                            setSuccess(true);
                        } else {
                            alert("Payment verification failed. Contact support.");
                        }
                    } catch { alert("Error verifying payment."); }
                    finally { setSubmitting(false); }
                },

                /* Step 4: Payment FAILURE / modal close */
                modal: {
                    ondismiss: () => {
                        setSubmitting(false);
                        alert("Payment cancelled. Your order was not placed.");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (resp) => {
                setSubmitting(false);
                alert(`Payment failed: ${resp.error.description}`);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Could not connect to payment gateway. Please try again.");
            setSubmitting(false);
        }
    };

    if (success) return (
        <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: "calc(100vh - 68px)" }}>
            <div className="sz-auth-card p-5 text-center" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="sz-success-icon mb-4">✓</div>
                <div className="sz-sec-title mb-2">Order Placed!</div>
                <p className="sz-muted mb-4">Your order has been confirmed. We'll send you delivery updates.</p>
                <div className="d-flex gap-2 justify-content-center">
                    <button className="sz-btn sz-btn-primary" onClick={() => navigate("/orders")}>View Orders</button>
                    <button className="sz-btn sz-btn-outline" onClick={() => navigate("/")}>Go Home</button>
                </div>
            </div>
        </div>
    );

    const payMethods = [["COD", "💵", "Cash on Delivery"], ["Card", "💳", "Credit / Debit Card"], ["UPI", "📱", "UPI / Net Banking"]];

    return (
        <div className="container-xl py-4 px-3 px-md-4" style={{ maxWidth: "640px" }}>
            <div className="mb-4">
                <div className="sz-sec-label">Step 2 of 2</div>
                <div className="sz-sec-title">Checkout</div>
            </div>

            {/* Amount bar */}
            <div className="sz-amt-bar d-flex justify-content-between align-items-center p-3 mb-4">
                <div>
                    <div className="sz-accent-c fw-bold" style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>Order Total</div>
                    <div className="sz-text fw-bold" style={{ fontSize: "26px" }}>₹{finalAmount}</div>
                </div>
                <span style={{ fontSize: "28px" }}>🛍️</span>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {/* Shipping section */}
                <div className="sz-ch-section p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="sz-step-badge">1</div>
                        <span className="sz-text fw-bold" style={{ fontSize: "15px" }}>Shipping Details</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div>
                            <label className="sz-label">Full Name</label>
                            <input className="sz-input" type="text" name="shipping_name" value={formData.shipping_name} onChange={handleChange} placeholder="Enter your full name" required />
                        </div>
                        <div>
                            <label className="sz-label">Mobile Number</label>
                            <input className="sz-input" type="tel" name="shipping_mobile" value={formData.shipping_mobile} onChange={handleChange} placeholder="10-digit mobile number" required />
                        </div>
                        <div>
                            <label className="sz-label">Delivery Address</label>
                            <textarea className="sz-input" name="shipping_address" value={formData.shipping_address} onChange={handleChange} placeholder="House no., Street, Area, City, Pincode" rows="3" required style={{ resize: "none" }} />
                        </div>
                    </div>
                </div>

                {/* Payment section */}
                <div className="sz-ch-section p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="sz-step-badge">2</div>
                        <span className="sz-text fw-bold" style={{ fontSize: "15px" }}>Payment Method</span>
                    </div>
                    <div className="row g-2">
                        {payMethods.map(([val, icon, label]) => (
                            <div key={val} className="col-4">
                                <label className={`sz-pay-opt d-block ${formData.payment_method === val ? "selected" : ""}`}>
                                    <input type="radio" name="payment_method" value={val} checked={formData.payment_method === val} onChange={handleChange} className="d-none" />
                                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</div>
                                    <div className={`fw-bold ${formData.payment_method === val ? "sz-accent-c" : "sz-muted"}`} style={{ fontSize: "11px" }}>{label}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={submitting} className="sz-btn sz-btn-primary w-100" style={{ padding: "15px", fontSize: "15px" }}>
                    {submitting ? "Placing Order..." : `Place Order · ₹${finalAmount}`}
                </button>
            </form>
        </div>
    );
}

export default Checkout;