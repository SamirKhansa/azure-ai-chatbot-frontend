import React, { useState } from "react";
import "../Styles/Chat.css";
import Loader from "../Components/Shared/Loader";
import { sendMessageToBackend } from "../Services/Chat";
import MicButton from "../Components/Shared/MicButton";

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your chess instructor 🤖♟️. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null); // store latest audio blob URL

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToBackend(input);
      setMessages(prev => [...prev, { role: "ai", text: response }]);

      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem("sessionId", response.sessionId);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong 😅" }]);
    } finally {
      setLoading(false);
    }
  };

  // function for audio messages
  const sendAudio = async (base64data, audioBlobUrl) => {
    setMessages(prev => [...prev, { role: "user", text: "🎤 (voice message)" }]);
    setLatestAudio(audioBlobUrl); // save the blob URL of the latest audio
    setLoading(true);

    try {
      const response = await sendMessageToBackend(null, base64data);
      setMessages(prev => [...prev, { role: "ai", text: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Something went wrong with audio 😅" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const playLatestAudio = () => {
    if (latestAudio) {
      const audio = new Audio(latestAudio);
      audio.play();
    }
  };

  return (
    <div className="chat-container">
      <h2>♟️ Chess Instructor Chat</h2>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Coach"}:</strong> {msg.text}
          </div>
        ))}
        {loading && <Loader />}
      </div>

      <div className="input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about chess..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        <MicButton onSendAudio={sendAudio} />

        {latestAudio && (
          <button onClick={playLatestAudio}>▶ Play Last Audio</button>
        )}
      </div>
    </div>
  );
};

export default Chat;
