// api/create-order.js
// Vercel Serverless Function — runs on the server, Key Secret is safe here

const Razorpay = require("razorpay");

module.exports = async (req, res) => {
    // Allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,     // from Vercel env vars
            key_secret: process.env.RAZORPAY_KEY_SECRET, // NEVER exposed to frontend
        });

        const order = await razorpay.orders.create({
            amount: Math.round(parseFloat(amount) * 100), // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return res.status(200).json(order);
    } catch (err) {
        console.error("Razorpay create-order error:", err);
        return res.status(500).json({ error: err.message || "Order creation failed" });
    }
};