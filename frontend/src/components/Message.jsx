import ReactMarkdown from "react-markdown";

export default function Message({ role, text, time }) {
  return (
    <div className={`msg-row ${role}`}>
      {role === "assistant" && (
        <div className="avatar">🤖</div>
      )}

      <div className="bubble-wrapper">
        <div className={`bubble ${role}`}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        {time && (
          <div className="time">
            {new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        )}
      </div>
    </div>
  );
}