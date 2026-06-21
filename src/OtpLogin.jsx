import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OtpLogin({ setUserSession }) {
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const token = "dbacace63c8bf2885869b81660c2b289";

    const requestOtp = async (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(mobile)) { toast.warning("Enter a valid 10-digit number."); return; }
        setLoading(true);
        const fd = new FormData(); fd.append("user_mobile", mobile);
        try {
            const res = await axios.post("http://akashsir.in/atproject/at-shop/api/api-otp-login.php", fd, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.flag === "1" || res.data.status === "1") {
                console.log("🔑 OTP:", res.data.mobile_otp); setOtpSent(true);
            } else toast.error(res.data.message || "Mobile not found.");
        } catch { toast.error("Network error."); } finally { setLoading(false); }
    };

    const resendOtp = async () => {
        setResending(true);
        const fd = new FormData(); fd.append("user_mobile", mobile);
        try {
            const res = await axios.post("http://akashsir.in/atproject/at-shop/api/api-otp-resend.php", fd, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.flag === "1" || res.data.status === "1") {
                console.log("🔄 New OTP:", res.data.mobile_otp); toast.success("New OTP sent! Check console.");
            }
        } catch { console.error("Resend failed"); } finally { setResending(false); }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) { toast.warning("Enter the OTP."); return; }
        setLoading(true);
        const fd = new FormData(); fd.append("user_mobile", mobile); fd.append("mobile_otp", otp);
        try {
            const res = await axios.post("http://akashsir.in/atproject/at-shop/api/api-otp-verify.php", fd, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.flag === "1" || res.data.status === "1") {
                const sessionData = { user_id: res.data.user_id || "4", user_name: res.data.user_name || "User", user_mobile: mobile };
                localStorage.setItem("userSession", JSON.stringify(sessionData));
                if (setUserSession) setUserSession(sessionData);
                toast.success(`Welcome back, ${sessionData.user_name}! 👋`);
                navigate("/");
            } else toast.error(res.data.message || "Incorrect OTP.");
        } catch { toast.error("Verification failed."); } finally { setLoading(false); }
    };

    return (
        <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: "calc(100vh - 68px)" }}>
            <div className="sz-auth-wrap w-100">
                <div className="text-center mb-4">
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📱</div>
                    <div className="sz-sec-title mb-1">{otpSent ? "Enter OTP" : "OTP Login"}</div>
                    <div className="sz-muted" style={{ fontSize: "14px" }}>
                        {otpSent ? `OTP sent to +91 ${mobile} (check browser console)` : "Sign in with your mobile number"}
                    </div>
                </div>
                <div className="sz-auth-card p-4">
                    {!otpSent ? (
                        <form onSubmit={requestOtp} className="d-flex flex-column gap-3">
                            <div>
                                <label className="sz-label">Mobile Number</label>
                                <input className="sz-input" type="tel" maxLength="10" placeholder="10-digit mobile number"
                                    value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ""))} required />
                            </div>
                            <button type="submit" disabled={loading} className="sz-btn sz-btn-primary w-100" style={{ padding: "13px" }}>
                                {loading ? "Sending OTP..." : "Get OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={verifyOtp} className="d-flex flex-column gap-3">
                            <div>
                                <label className="sz-label">6-Digit OTP</label>
                                <input className="sz-input sz-otp-input" type="text" maxLength="6" placeholder="• • • • • •"
                                    value={otp} onChange={e => setOtp(e.target.value.replace(/\s/g, ""))} required />
                                <div className="sz-muted mt-1" style={{ fontSize: "11px" }}>Check your browser developer console for the OTP</div>
                            </div>
                            <button type="submit" disabled={loading} className="sz-btn sz-btn-primary w-100" style={{ padding: "13px" }}>
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                            <div className="d-flex justify-content-between">
                                <button type="button" onClick={resendOtp} disabled={resending}
                                    className="bg-transparent border-0 sz-accent-c fw-semibold" style={{ cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                                    {resending ? "Resending..." : "Resend OTP"}
                                </button>
                                <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }}
                                    className="bg-transparent border-0 sz-muted fw-semibold" style={{ cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                                    Change Number
                                </button>
                            </div>
                        </form>
                    )}
                    <hr className="sz-hr" />
                    <button onClick={() => navigate("/login")}
                        className="w-100 bg-transparent border-0 sz-muted fw-semibold" style={{ cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                        ← Back to Password Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OtpLogin;