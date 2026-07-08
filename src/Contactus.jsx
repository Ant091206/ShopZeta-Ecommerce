import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ContactUs() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.warning("Please fill all required fields."); return;
        }
        setSending(true);
        // Simulate send — replace with EmailJS or your backend
        await new Promise(r => setTimeout(r, 1200));
        toast.success("Message sent! We'll get back to you soon 🎉");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSending(false);
    };

    const socials = [
        {
            name: "LinkedIn",
            handle: "your-linkedin-handle",
            desc: "Connect with me professionally",
            href: "https://linkedin.com/in/your-linkedin-handle",
            color: "#0A66C2",
            glow: "rgba(10,102,194,0.3)",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#0A66C2" />
                    <path d="M6.5 9.5h2.5v8H6.5v-8zM7.75 8.5a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM11 9.5h2.4v1.1h.03c.33-.63 1.15-1.3 2.37-1.3 2.54 0 3 1.67 3 3.84v4.36H16.3v-3.87c0-.92-.02-2.1-1.28-2.1-1.28 0-1.47 1-1.47 2.03v3.94H11v-8z" fill="white" />
                </svg>
            ),
        },
        {
            name: "GitHub",
            handle: "your-github-username",
            desc: "Check out my projects & code",
            href: "https://github.com/your-github-username",
            color: "#333",
            glow: "rgba(100,100,100,0.3)",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#24292e" />
                    <path fillRule="evenodd" clipRule="evenodd"
                        d="M12 4C7.58 4 4 7.58 4 12c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0020 12c0-4.42-3.58-8-8-8z"
                        fill="white" />
                </svg>
            ),
        },
        {
            name: "Gmail",
            handle: "yourname@gmail.com",
            desc: "Drop me an email anytime",
            href: "mailto:yourname@gmail.com",
            color: "#EA4335",
            glow: "rgba(234,67,53,0.3)",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#EA4335" />
                    <path d="M4 8l8 5 8-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="4" y="7" width="16" height="11" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
            ),
        },
    ];

    const faqs = [
        { q: "How do I track my order?", a: "Go to Orders page after logging in to see real-time status of all your orders." },
        { q: "What payment methods are accepted?", a: "We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery." },
        { q: "How do I return a product?", a: "We have a 30-day easy return policy. Contact us with your order ID and we'll arrange a pickup." },
        { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Express delivery is available for select pincodes." },
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="container-xl py-5 px-3 px-md-4" style={{ maxWidth: "1100px" }}>

            {/* ── Hero ── */}
            <div className="text-center mb-5">
                <div className="sz-sec-label mb-2">Get In Touch</div>
                <h1 className="sz-sec-title" style={{ fontSize: "clamp(28px,5vw,42px)" }}>
                    We'd love to hear from you
                </h1>
                <p className="sz-muted mx-auto" style={{ maxWidth: "480px", lineHeight: 1.7 }}>
                    Have a question, feedback, or just want to say hi? Reach out through any of the channels below.
                </p>
            </div>

            <div className="row g-4">

                {/* ── LEFT — Social cards + info ── */}
                <div className="col-lg-5">

                    {/* Social cards */}
                    <div className="d-flex flex-column gap-3 mb-4">
                        {socials.map((s) => (
                            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "var(--sz-surface)",
                                    border: "1px solid var(--sz-border)",
                                    borderRadius: "16px",
                                    padding: "18px 20px",
                                    display: "flex", alignItems: "center", gap: "16px",
                                    transition: "all 220ms cubic-bezier(0.34,1.56,0.64,1)",
                                    cursor: "pointer",
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                        e.currentTarget.style.borderColor = s.color;
                                        e.currentTarget.style.boxShadow = `0 8px 28px ${s.glow}`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.borderColor = "var(--sz-border)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: "52px", height: "52px", borderRadius: "14px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, overflow: "hidden",
                                        boxShadow: `0 4px 16px ${s.glow}`,
                                    }}>
                                        {s.icon}
                                    </div>
                                    {/* Text */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--sz-text)", marginBottom: "2px" }}>
                                            {s.name}
                                        </div>
                                        <div style={{ fontSize: "12px", color: s.color, fontWeight: 600, marginBottom: "2px" }}>
                                            {s.handle}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "var(--sz-muted)" }}>{s.desc}</div>
                                    </div>
                                    {/* Arrow */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="var(--sz-muted)" strokeWidth="2" strokeLinecap="round">
                                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Response time card */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "16px", padding: "20px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                            <div style={{
                                width: "10px", height: "10px", borderRadius: "50%",
                                background: "#10b981", flexShrink: 0,
                                boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                            }} />
                            <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--sz-text)" }}>
                                Usually responds within 24 hours
                            </span>
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--sz-muted)", lineHeight: 1.6 }}>
                            For order-related issues, please mention your Order ID in the subject line for faster resolution.
                        </div>
                    </div>
                </div>

                {/* ── RIGHT — Contact form ── */}
                <div className="col-lg-7">
                    <div style={{
                        background: "var(--sz-surface)",
                        border: "1px solid var(--sz-border)",
                        borderRadius: "20px",
                        padding: "32px",
                        boxShadow: "var(--sz-shadow-lg)",
                    }}>
                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ fontWeight: 800, fontSize: "20px", color: "var(--sz-text)", marginBottom: "6px" }}>
                                Send us a message
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--sz-muted)" }}>
                                Fill in the form and we'll get back to you as soon as possible.
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Name */}
                                <div className="col-sm-6">
                                    <label className="sz-label">Full Name <span style={{ color: "var(--sz-danger)" }}>*</span></label>
                                    <input className="sz-input" type="text" name="name"
                                        value={formData.name} onChange={handleChange}
                                        placeholder="John Doe" />
                                </div>
                                {/* Email */}
                                <div className="col-sm-6">
                                    <label className="sz-label">Email Address <span style={{ color: "var(--sz-danger)" }}>*</span></label>
                                    <input className="sz-input" type="email" name="email"
                                        value={formData.email} onChange={handleChange}
                                        placeholder="john@example.com" />
                                </div>
                                {/* Subject */}
                                <div className="col-12">
                                    <label className="sz-label">Subject</label>
                                    <input className="sz-input" type="text" name="subject"
                                        value={formData.subject} onChange={handleChange}
                                        placeholder="Order issue, feedback, partnership..." />
                                </div>
                                {/* Message */}
                                <div className="col-12">
                                    <label className="sz-label">Message <span style={{ color: "var(--sz-danger)" }}>*</span></label>
                                    <textarea className="sz-input" name="message" rows={5}
                                        value={formData.message} onChange={handleChange}
                                        placeholder="Describe your issue or message in detail..."
                                        style={{ resize: "none" }} />
                                </div>
                                {/* Submit */}
                                <div className="col-12">
                                    <button type="submit" disabled={sending}
                                        className="sz-btn sz-btn-primary w-100"
                                        style={{ padding: "13px", fontSize: "15px" }}>
                                        {sending
                                            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                <div className="sz-spinner" style={{ width: "18px", height: "18px" }} />
                                                Sending...
                                            </span>
                                            : "Send Message →"
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── FAQ Section ── */}
            <div className="mt-5">
                <div className="text-center mb-4">
                    <div className="sz-sec-label mb-2">FAQ</div>
                    <div className="sz-sec-title">Frequently Asked Questions</div>
                </div>
                <div className="d-flex flex-column gap-2" style={{ maxWidth: "720px", margin: "0 auto" }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{
                            background: "var(--sz-surface)",
                            border: `1px solid ${openFaq === i ? "var(--sz-accent)" : "var(--sz-border)"}`,
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: openFaq === i ? "0 0 0 3px var(--sz-glow)" : "none",
                            transition: "all 200ms ease",
                        }}>
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{
                                    width: "100%", padding: "16px 20px",
                                    background: "none", border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    fontFamily: "inherit",
                                }}>
                                <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--sz-text)", textAlign: "left" }}>
                                    {faq.q}
                                </span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="var(--sz-accent)" strokeWidth="2.5" strokeLinecap="round"
                                    style={{
                                        flexShrink: 0, transition: "transform 200ms ease",
                                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)"
                                    }}>
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            {openFaq === i && (
                                <div style={{ padding: "0 20px 16px", fontSize: "13.5px", color: "var(--sz-muted)", lineHeight: 1.7 }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default ContactUs;