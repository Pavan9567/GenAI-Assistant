import { useState } from "react";

export default function Input({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask HR question..."
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button disabled={disabled} onClick={submit}>
        Send
      </button>
    </div>
  );
}