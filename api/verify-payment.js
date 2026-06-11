// api/verify-payment.js
// Vercel Serverless Function — verifies Razorpay signature server-side

const crypto = require("crypto");

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ valid: false, error: "Missing parameters" });
        }

        // Razorpay signature formula:
        // HMAC-SHA256(order_id + "|" + payment_id, key_secret)
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expected),
            Buffer.from(razorpay_signature)
        );

        if (isValid) {
            return res.status(200).json({
                valid: true,
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
                message: "Payment verified successfully",
            });
        } else {
            // Signature mismatch — possible tampered/fake request
            return res.status(400).json({
                valid: false,
                message: "Invalid payment signature",
            });
        }
    } catch (err) {
        console.error("Verify payment error:", err);
        return res.status(500).json({ valid: false, error: err.message });
    }
};