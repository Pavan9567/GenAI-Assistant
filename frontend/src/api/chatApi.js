export async function sendMessage(sessionId, message) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message })
  });

  return res.json();
}