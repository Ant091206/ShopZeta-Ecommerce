import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const finalAmount = location.state?.amount || "0";
    const [userId, setUserId] = useState("");
    const [formData, setFormData] = useState({
        shipping_name: "", shipping_mobile: "", shipping_address: "", payment_method: "COD"
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const token = import.meta.env.VITE_API_TOKEN;

    useEffect(() => {
        const s = JSON.parse(localStorage.getItem("userSession"));
        if (!s?.user_id) { toast.warning("Please login to continue."); navigate("/login"); return; }
        setUserId(s.user_id);
    }, [navigate]);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    /* ── Save order to DB after successful payment ── */
    const saveOrderToDB = async (paymentId) => {
        const fd = new FormData();
        fd.append("user_id", userId);
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
        fd.append("payment_id", paymentId);
        fd.append("payment_status", "Paid");
        const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api-add-order.php`, fd,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res;
    };

    /* ── Send confirmation email via EmailJS ── */
    const sendOrderEmail = async (orderData) => {
        try {
            const session = JSON.parse(localStorage.getItem("userSession"));
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    customer_name: session?.user_name || "Customer",
                    customer_email: session?.user_email || "",
                    order_id: orderData.orderId || "N/A",
                    amount: orderData.amount,
                    payment_method: orderData.paymentMethod,
                    address: formData.shipping_address,
                    order_date: new Date().toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                    }),
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            console.log("✓ Order confirmation email sent");
        } catch (err) {
            // Email failure should never block the order success flow
            console.warn("Email send failed (non-critical):", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.shipping_name || !formData.shipping_mobile || !formData.shipping_address) {
            toast.warning("Please fill all shipping details."); return;
        }

        /* ── COD: skip Razorpay ── */
        if (formData.payment_method === "COD") {
            setSubmitting(true);
            try {
                const codRes = await saveOrderToDB("COD");
                await sendOrderEmail({
                    orderId: codRes?.data?.order_id || "N/A",
                    amount: finalAmount,
                    paymentMethod: "Cash on Delivery",
                });
                toast.success("Order placed! Confirmation email sent 🎉");
                setSuccess(true);
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong. Please try again.");
            } finally { setSubmitting(false); }
            return;
        }

        /* ── Card / UPI: Razorpay flow ── */

        // Safety check — Razorpay script must be loaded
        if (!window.Razorpay) {
            toast.error("Payment gateway not loaded. Please refresh the page.");
            return;
        }

        // Safety check — Key ID must be present
        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!keyId) {
            toast.error("Razorpay Key ID missing. Check your .env file.");
            return;
        }

        setSubmitting(true);
        try {
            /* Step 1 — Create Razorpay order via Vercel serverless function */
            const { data: rzpOrder } = await axios.post(
                "/api/create-order",
                { amount: Number(finalAmount) },
                { headers: { "Content-Type": "application/json" } }
            );

            if (!rzpOrder?.id) {
                toast.error("Could not create payment order. Try again.");
                setSubmitting(false);
                return;
            }

            /* Step 2 — Open Razorpay checkout popup */
            const options = {
                key: keyId,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || "INR",
                order_id: rzpOrder.id,
                name: "ShopZeta",
                description: "Order Payment",
                image: "/vite.svg",
                prefill: {
                    name: formData.shipping_name,
                    contact: formData.shipping_mobile,
                },
                theme: { color: "#6366f1" },

                /* Step 3 — Payment SUCCESS */
                handler: async (response) => {
                    try {
                        // Verify signature on backend
                        const { data: verify } = await axios.post(
                            "/api/verify-payment",
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        if (verify?.valid) {
                            const rzpRes = await saveOrderToDB(response.razorpay_payment_id);
                            await sendOrderEmail({
                                orderId: rzpRes?.data?.order_id || response.razorpay_order_id,
                                amount: finalAmount,
                                paymentMethod: formData.payment_method === "UPI" ? "UPI / Net Banking" : "Credit / Debit Card",
                            });
                            toast.success("Payment successful! Confirmation email sent 🎉");
                            setSuccess(true);
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Verify error:", err);
                        toast.error("Error verifying payment. Please contact support.");
                    } finally {
                        setSubmitting(false);
                    }
                },

                /* Step 4 — Modal dismissed (user closed popup) */
                modal: {
                    ondismiss: () => {
                        setSubmitting(false);
                        toast.info("Payment cancelled. Your order was not placed.");
                    }
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", (resp) => {
                setSubmitting(false);
                toast.error(`Payment failed: ${resp.error?.description || "Unknown error"}`);
            });

            rzp.open();

        } catch (err) {
            console.error("Checkout error:", err);
            const msg = err?.response?.data?.error || err.message || "Unknown error";
            toast.error(`Could not connect to payment gateway: ${msg}`);
            setSubmitting(false);
        }
    };

    /* ── Success screen ── */
    if (success) return (
        <div className="d-flex align-items-center justify-content-center px-3"
            style={{ minHeight: "calc(100vh - 68px)" }}>
            <div className="sz-auth-card p-5 text-center" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="sz-success-icon mb-4">✓</div>
                <div className="sz-sec-title mb-2">Order Placed!</div>
                <p className="sz-muted mb-4">
                    Your order has been confirmed. We'll send you delivery updates.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <button className="sz-btn sz-btn-primary" onClick={() => navigate("/orders")}>View Orders</button>
                    <button className="sz-btn sz-btn-outline" onClick={() => navigate("/")}>Go Home</button>
                </div>
            </div>
        </div>
    );

    const payMethods = [
        ["COD", "💵", "Cash on Delivery"],
        ["Card", "💳", "Credit / Debit Card"],
        ["UPI", "📱", "UPI / Net Banking"],
    ];

    return (
        <div className="container-xl py-4 px-3 px-md-4" style={{ maxWidth: "640px" }}>
            <div className="mb-4">
                <div className="sz-sec-label">Step 2 of 2</div>
                <div className="sz-sec-title">Checkout</div>
            </div>

            {/* Amount bar */}
            <div className="sz-amt-bar d-flex justify-content-between align-items-center p-3 mb-4">
                <div>
                    <div className="sz-accent-c fw-bold"
                        style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Order Total
                    </div>
                    <div className="sz-text fw-bold" style={{ fontSize: "26px" }}>₹{finalAmount}</div>
                </div>
                <span style={{ fontSize: "28px" }}>🛍️</span>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {/* Shipping */}
                <div className="sz-ch-section p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="sz-step-badge">1</div>
                        <span className="sz-text fw-bold" style={{ fontSize: "15px" }}>Shipping Details</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div>
                            <label className="sz-label">Full Name</label>
                            <input className="sz-input" type="text" name="shipping_name"
                                value={formData.shipping_name} onChange={handleChange}
                                placeholder="Enter your full name" required />
                        </div>
                        <div>
                            <label className="sz-label">Mobile Number</label>
                            <input className="sz-input" type="tel" name="shipping_mobile"
                                value={formData.shipping_mobile} onChange={handleChange}
                                placeholder="10-digit mobile number" required />
                        </div>
                        <div>
                            <label className="sz-label">Delivery Address</label>
                            <textarea className="sz-input" name="shipping_address"
                                value={formData.shipping_address} onChange={handleChange}
                                placeholder="House no., Street, Area, City, Pincode"
                                rows="3" required style={{ resize: "none" }} />
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div className="sz-ch-section p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="sz-step-badge">2</div>
                        <span className="sz-text fw-bold" style={{ fontSize: "15px" }}>Payment Method</span>
                    </div>
                    <div className="row g-2">
                        {payMethods.map(([val, icon, label]) => (
                            <div key={val} className="col-4">
                                <label className={`sz-pay-opt d-block ${formData.payment_method === val ? "selected" : ""}`}>
                                    <input type="radio" name="payment_method" value={val}
                                        checked={formData.payment_method === val}
                                        onChange={handleChange} className="d-none" />
                                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</div>
                                    <div className={`fw-bold ${formData.payment_method === val ? "sz-accent-c" : "sz-muted"}`}
                                        style={{ fontSize: "11px" }}>
                                        {label}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Razorpay test hint */}
                    {formData.payment_method !== "COD" && (
                        <div style={{
                            marginTop: "12px", padding: "10px 12px",
                            background: "rgba(99,102,241,0.07)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: "8px", fontSize: "12px"
                        }}>
                            <span className="sz-accent-c fw-bold">Test card: </span>
                            <span className="sz-muted">4111 1111 1111 1111 · Any expiry · Any CVV · OTP: 1234</span>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={submitting}
                    className="sz-btn sz-btn-primary w-100"
                    style={{ padding: "15px", fontSize: "15px" }}>
                    {submitting ? "Processing..." : `Place Order · ₹${finalAmount}`}
                </button>
            </form>
        </div>
    );
}

export default Checkout;