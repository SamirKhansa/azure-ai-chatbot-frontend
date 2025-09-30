import React, { useState, useRef } from "react";
import "../Styles/Chat.css";
import Loader from "../Components/Shared/Loader";
import { handleSend } from "../Services/Chat";
import Input from "../Components/Shared/Input";

import FileButton from "../Components/Shared/Button/FileButton";

const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your chess instructor 🤖♟️. How can I help?" }
  ]);
  const [Inputs, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestAudio, setLatestAudio] = useState(null);
  const handleKeyDown = (e) => {
      if (e.key === "Enter" && Inputs!=="") handleSend(Inputs, setMessages,setInput, setLoading);
    };
  const audioContextRef = useRef(null);
  const recorderRef = useRef(null);

  const onUploadSuccess = () => {
    setMessages([])
  }
  
  return (
    <div className="chatContainer">
      <h2 className="chatHeader">♟️ Chess Instructor Chat</h2>

      <div className="chatWindow">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
            <strong>{msg.role === "user" ? "You" : "Coach"}:</strong>
            
            {msg.url ? (
              // Show only the image if URL exists
              <img src={msg.url} alt="Chess Opening" className="chessImage" />
            ) : (
              // Otherwise show text
              <p>{msg.text}</p>
            )}
          </div>
        ))}
        {loading && <Loader />}
      </div>

      <div className="inputBar">
        <Input 
        StylingClass={"chatInput"}
        type={"text"}
        value={Inputs}
        onChangeListener={(e) => setInput(e.target.value)}
        hint={"Ask about chess..."}
        EnterKey={handleKeyDown}

        
         />
        
        <FileButton Purpose={"SendMessage"}
                     text="Send"
                     ClassNames={"chatSendButton"}
                     attribute={{
                      input:Inputs,
                      setMessages: setMessages,
                      setInput: setInput,
                      setLoading: setLoading

                     }}
                     />

            
        <FileButton Purpose={"MicButton"}
            text={isRecording ? "⏹ Stop" : "🎤 Talk"}
            ClassNames={"chatSendButton"}
            attribute={{
              isRecording: isRecording,
              setIsRecording: setIsRecording,
              audioContextRef: audioContextRef,
              recorderRef: recorderRef,
              setLoading: setLoading,
              setLatestAudio: setLatestAudio,
              setMessages: setMessages
            }}
          />
          <FileButton Purpose={"ClearHistory"}
            text={"Clear History"}
            ClassNames={"chatSendButton"}
            onSuccess={onUploadSuccess}
            
          />
              
        {latestAudio && (
          <FileButton Purpose={"AudioMessage"}
                     text="▶ Play Last Audio"
                     ClassNames={"chatPlayAudioButton"}/>
        )}
      </div>
    </div>
  );
};

export default Chat;
