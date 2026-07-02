import React, { useState, useRef, useEffect } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are ShopBot, a friendly and helpful shopping assistant for ShopZeta — a modern e-commerce platform. 

You help users with:
- Finding products and categories
- Order tracking and order history
- Wishlist and cart queries
- Shipping, returns and refund policies
- Account and login issues
- General shopping advice and recommendations

Keep responses short, friendly and helpful. Use emojis occasionally to keep things lively.
If asked about specific order details or account info, politely let them know to check their Dashboard or Orders page.
Never make up product prices or stock availability.
Always stay on-topic about shopping and ShopZeta.`;

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "👋 Hey there! I'm **ShopBot**, your ShopZeta assistant. How can I help you today?\n\nYou can ask me about orders, products, shipping, returns, or anything else! 🛍️",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isMinimized]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg = {
            role: "user",
            text: trimmed,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Build Groq messages array (OpenAI-compatible)
            const groqMessages = [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map(m => ({
                    role: m.role === "user" ? "user" : "assistant",
                    content: m.text,
                })),
                { role: "user", content: trimmed },
            ];

            const res = await fetch(GROQ_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: groqMessages,
                    temperature: 0.7,
                    max_tokens: 400,
                    stream: false,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.error?.message || "";
                const isRate = res.status === 429 || msg.toLowerCase().includes("rate");
                if (isRate) {
                    setMessages(prev => [...prev, {
                        role: "bot",
                        text: "⏳ **Rate limit reached!** Groq's free tier allows 30 requests/min.\n\nPlease wait a moment and try again. 🙏",
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        isError: true,
                    }]);
                    setLoading(false);
                    return;
                }
                throw new Error(msg || `HTTP ${res.status}`);
            }

            const botText =
                data?.choices?.[0]?.message?.content ||
                "Sorry, I couldn't get a response. Please try again! 🙏";

            setMessages(prev => [...prev, {
                role: "bot",
                text: botText,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }]);
        } catch (err) {
            console.error("Gemini error:", err);
            const isRateLimit = err.message?.includes("429") || err.message?.toLowerCase().includes("quota");
            setMessages(prev => [...prev, {
                role: "bot",
                text: isRateLimit
                    ? "⏳ **Rate limit reached!** The free Gemini API allows 15 requests/min and 1,500/day. Please wait a moment and try again! 🙏"
                    : "⚠️ Something went wrong. Please check your `VITE_GROQ_API_KEY` in `.env` and try again.",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isError: true,
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([{
            role: "bot",
            text: "👋 Chat cleared! How can I help you today? 🛍️",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
    };

    /* ── Render markdown-like bold (**text**) ── */
    const renderText = (text) => {
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, i) =>
            i % 2 === 1
                ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
                : part
        );
    };

    const quickReplies = [
        "Track my order 📦",
        "Return policy ↩️",
        "Best deals 🔥",
        "Contact support 🎧",
    ];

    return (
        <>
            {/* ── Floating Button — Zap + Chat premium ── */}
            <style>{`
        @keyframes fab-pulse {
          0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(99,102,241,0.6), 0 6px 24px rgba(99,102,241,0.4); }
          50%  { transform: scale(1.04); box-shadow: 0 0 0 10px rgba(99,102,241,0), 0 6px 24px rgba(99,102,241,0.4); }
          100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(99,102,241,0), 0 6px 24px rgba(99,102,241,0.4); }
        }
        .chat-fab-btn { animation: fab-pulse 2.5s ease-out infinite; }
        .chat-fab-btn:hover {
          animation: none !important;
          transform: scale(1.13) !important;
          box-shadow: 0 8px 36px rgba(99,102,241,0.75) !important;
        }
        .chat-fab-btn:active { transform: scale(0.96) !important; }
      `}</style>
            <button
                onClick={() => { setIsOpen(p => !p); setIsMinimized(false); }}
                className={isOpen ? "" : "chat-fab-btn"}
                title={isOpen ? "Close chat" : "Chat with ShopBot"}
                style={{
                    position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
                    width: "58px", height: "58px", borderRadius: "50%",
                    background: "linear-gradient(145deg, #4338ca 0%, #6366f1 45%, #a855f7 100%)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    cursor: "pointer", outline: "none",
                    boxShadow: isOpen
                        ? "0 4px 16px rgba(99,102,241,0.4)"
                        : "0 6px 24px rgba(99,102,241,0.45)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 220ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 220ms ease",
                    transform: isOpen ? "scale(0.92) rotate(90deg)" : "scale(1) rotate(0deg)",
                }}
            >
                {isOpen
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    : <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Chat bubble background */}
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                            fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.4"
                            strokeLinecap="round" strokeLinejoin="round" />
                        {/* Zap bolt inside */}
                        <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
                            fill="white" />
                    </svg>
                }
            </button>

            {/* ── Chat Window ── */}
            {isOpen && (
                <div style={{
                    position: "fixed", bottom: "96px", right: "24px", zIndex: 9999,
                    width: "360px",
                    maxHeight: isMinimized ? "56px" : "520px",
                    borderRadius: "20px",
                    background: "var(--sz-surface, #111118)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                    fontFamily: "inherit",
                }}>

                    {/* ── Header ── */}
                    <div style={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        padding: "14px 16px",
                        display: "flex", alignItems: "center", gap: "10px",
                        flexShrink: 0,
                    }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: "rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.177 2 11.5c0 2.014.624 3.885 1.688 5.437L2.5 21.5l4.563-1.188A9.948 9.948 0 0012 21c5.523 0 10-4.177 10-9.5S17.523 2 12 2z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="8.5" cy="11.5" r="1.25" fill="white" />
                                <circle cx="12" cy="11.5" r="1.25" fill="white" />
                                <circle cx="15.5" cy="11.5" r="1.25" fill="white" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>ShopBot</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                                Powered by Groq AI
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={clearChat} title="Clear chat" style={{
                                background: "rgba(255,255,255,0.1)", border: "none",
                                color: "#fff", width: "28px", height: "28px", borderRadius: "6px",
                                cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                            }}>🗑️</button>
                            <button onClick={() => setIsMinimized(p => !p)} title="Minimize" style={{
                                background: "rgba(255,255,255,0.1)", border: "none",
                                color: "#fff", width: "28px", height: "28px", borderRadius: "6px",
                                cursor: "pointer", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{isMinimized ? "▲" : "▼"}</button>
                            <button onClick={() => setIsOpen(false)} title="Close" style={{
                                background: "rgba(255,255,255,0.1)", border: "none",
                                color: "#fff", width: "28px", height: "28px", borderRadius: "6px",
                                cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                            }}>✕</button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* ── Messages ── */}
                            <div style={{
                                flex: 1, overflowY: "auto", padding: "16px",
                                display: "flex", flexDirection: "column", gap: "12px",
                                scrollbarWidth: "thin",
                            }}>
                                {messages.map((msg, i) => (
                                    <div key={i} style={{
                                        display: "flex",
                                        flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                        alignItems: "flex-end", gap: "8px",
                                    }}>
                                        {/* Avatar */}
                                        {msg.role === "bot" && (
                                            <div style={{
                                                width: "28px", height: "28px", borderRadius: "50%",
                                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2C6.477 2 2 6.177 2 11.5c0 2.014.624 3.885 1.688 5.437L2.5 21.5l4.563-1.188A9.948 9.948 0 0012 21c5.523 0 10-4.177 10-9.5S17.523 2 12 2z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="8.5" cy="11.5" r="1.25" fill="white" />
                                                    <circle cx="12" cy="11.5" r="1.25" fill="white" />
                                                    <circle cx="15.5" cy="11.5" r="1.25" fill="white" />
                                                </svg>
                                            </div>
                                        )}
                                        <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                            <div style={{
                                                padding: "10px 13px",
                                                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                                background: msg.role === "user"
                                                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                                    : msg.isError ? "rgba(239,68,68,0.1)" : "var(--sz-surface2, #16161f)",
                                                border: msg.role === "bot" ? `1px solid ${msg.isError ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}` : "none",
                                                color: msg.role === "user" ? "#fff" : msg.isError ? "#ef4444" : "var(--sz-text, #f1f1f3)",
                                                fontSize: "13.5px", lineHeight: "1.55",
                                                wordBreak: "break-word",
                                                whiteSpace: "pre-wrap",
                                            }}>
                                                {renderText(msg.text)}
                                            </div>
                                            <div style={{ fontSize: "10px", color: "var(--sz-muted, #6b7280)", paddingInline: "4px" }}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading indicator */}
                                {loading && (
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.477 2 2 6.177 2 11.5c0 2.014.624 3.885 1.688 5.437L2.5 21.5l4.563-1.188A9.948 9.948 0 0012 21c5.523 0 10-4.177 10-9.5S17.523 2 12 2z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="8.5" cy="11.5" r="1.25" fill="white" />
                                                <circle cx="12" cy="11.5" r="1.25" fill="white" />
                                                <circle cx="15.5" cy="11.5" r="1.25" fill="white" />
                                            </svg>
                                        </div>
                                        <div style={{
                                            padding: "12px 16px",
                                            background: "var(--sz-surface2, #16161f)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            borderRadius: "16px 16px 16px 4px",
                                            display: "flex", gap: "5px", alignItems: "center",
                                        }}>
                                            {[0, 1, 2].map(i => (
                                                <div key={i} style={{
                                                    width: "7px", height: "7px", borderRadius: "50%",
                                                    background: "#6366f1",
                                                    animation: `chatbot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* ── Quick Replies ── */}
                            {messages.length <= 2 && (
                                <div style={{ padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {quickReplies.map(q => (
                                        <button key={q} onClick={() => { setInput(q); setTimeout(sendMessage, 0); }}
                                            style={{
                                                padding: "5px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                                                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
                                                color: "#6366f1", cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
                                        >{q}</button>
                                    ))}
                                </div>
                            )}

                            {/* ── Input ── */}
                            <div style={{
                                padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)",
                                display: "flex", gap: "8px", alignItems: "flex-end", flexShrink: 0,
                                background: "var(--sz-surface, #111118)",
                            }}>
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Ask me anything..."
                                    rows={1}
                                    style={{
                                        flex: 1, padding: "10px 14px",
                                        background: "var(--sz-surface2, #16161f)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px", color: "var(--sz-text, #f1f1f3)",
                                        fontSize: "13.5px", fontFamily: "inherit",
                                        outline: "none", resize: "none",
                                        maxHeight: "80px", overflowY: "auto",
                                        lineHeight: "1.5",
                                        transition: "border-color .2s",
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    style={{
                                        width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                                        background: loading || !input.trim() ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                        border: "none", color: "#fff", fontSize: "16px",
                                        cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all .2s",
                                        boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(99,102,241,0.4)",
                                    }}
                                >
                                    {loading ? "⏳" : "➤"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Keyframe Animations ── */}
            <style>{`
        @keyframes chatbot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes chatbot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
        </>
    );
}

export default Chatbot;