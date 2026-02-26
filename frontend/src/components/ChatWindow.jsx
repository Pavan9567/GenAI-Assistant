import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import Input from "./Input";
import { sendMessage } from "../api/chatApi";
import "../chat.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const sessionId =
    localStorage.getItem("sessionId") ||
    crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const newChat = () => {
    localStorage.setItem("sessionId", crypto.randomUUID());
    setMessages([]);
  };

  const handleSend = async (text) => {
    const time = new Date();

    setMessages((m) => [...m, { role: "user", text, time }]);
    setLoading(true);

    const res = await sendMessage(sessionId, text);

    setMessages((m) => [
      ...m,
      { role: "assistant", text: res.reply, time: new Date() }
    ]);

    setLoading(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        <div className="chat-header">
            <div className="assistant-info">
                <div className="assistant-title">HR Assistant</div>
                <div className="assistant-status">
                <span className="status-dot" />
                Online
                </div>
            </div>

            <button className="new-chat-btn" onClick={newChat}>
                New Chat
            </button>
        </div>

        <div className="chat-messages">
          {!messages.length && !loading && (
            <div className="empty-state">
              Ask me anything about HR policies 👋
            </div>
          )}

          {messages.map((m, i) => (
            <Message key={i} {...m} />
          ))}

          {loading && (
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          )}

          <div ref={endRef} />
        </div>

        <Input onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}