import React, { useState, useRef } from "react";
import "../Styles/Chat.css";
import Loader from "../Components/Shared/Loader";
import { handleSend} from "../Services/Chat"; 
import Input from "../Components/Shared/Input";

import FileButton from "../Components/Shared/Button/FileButton";


const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your chess instructor 🤖♟️. How can I help?" }
  ]);
  const [Inputs, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleKeyDown = (e) => {
      if (e.key === "Enter" && Inputs!=="") handleSend({input:Inputs, setMessages: setMessages,setInput: setInput,setLoading: setLoading});
    };
  const audioContextRef = useRef(null);
  const recorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showMicOverlay, setShowMicOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null);
  
  const wsRef = useRef(null);
  const onUploadSuccess = () => {
    setMessages([])
  }










  // File input ref
  

  // Trigger file picker
  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file); // store file in state
  };







           
  return (
    
    <div className="chatContainer">
      {showMicOverlay && (
          <div className="micOverlay">
            <div className="micContainer">
              <div className={`pulsingCircle ${isRecording ? "animate" : ""}`}></div>
              <div className="micIcon">🎤</div>
              <FileButton
                attribute={{
                  Purpose:"RealTimeChat",
                  ClassNames: "stopButton",
                  text: "Stop",
                  isRecording:isRecording,
                  setIsRecording:setIsRecording,
                  setShowMicOverlay: setShowMicOverlay,
                  wsRef:wsRef,
                  isRecording,
                  audioContextRef,
                  recorderRef,
                  setMessages

                }}
                
              />
            </div>
          </div>
        )}
      <h2 className="chatHeader">♟️ Chess Instructor Chat</h2>

      <div className="chatWindow">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
            <strong>{msg.role === "user" ? "You" : "Coach"}:</strong>
            {msg.url ? (
              <img src={msg.url} alt="Chess Opening" className="chessImage" />
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
        {loading && <Loader />}
      </div>
      <div className="realtimeButtonContainer">

        <FileButton
          attribute={{
            Purpose:"RealTimeChat",
            ClassNames: "chatSendButton",
            text: isRecording ? "⏹ End Realtime Chat" : "🎙️ Start Realtime Chat",
            isRecording:isRecording,
            setIsRecording:setIsRecording,
            setShowMicOverlay, setShowMicOverlay,
            wsRef:wsRef,
            isRecording,
            audioContextRef,
            recorderRef,
            setMessages

          }}
          
        />

        {/* <button className="chatSendButton" onClick={handleMicClick}>
          {isRecording ? "⏹ End Realtime Chat" : "🎙️ Start Realtime Chat"}
        </button> */}
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

        {/* File Upload Button */}
        {/* <button className="chatSendButton" onClick={triggerFilePicker}>
          📁 Upload File
        </button> */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <FileButton 

        attribute={{
          Purpose: "SendMessage",
          text: "Send",
          ClassNames:"chatSendButton",
          input: Inputs,
          setMessages: setMessages,
          setInput: setInput,
          setLoading: setLoading
          

        }}
        
        
        />

        <FileButton 
        attribute={{
          Purpose: "MicButton",
          text: isRecording ? "⏹ Stop" : "🎤 Talk",
          ClassNames: "chatSendButton",
          isRecording: isRecording,
          setIsRecording: setIsRecording,
          audioContextRef: audioContextRef,
          recorderRef: recorderRef,
          setLoading: setLoading,
          setLatestAudio: setLatestAudio,
          setMessages: setMessages
          

        }}
        
        
       
        />
        <FileButton 
        attribute={{
          Purpose:"ClearHistory",
          text: "Clear History",
          ClassNames: "chatSendButton",
          onSuccess: onUploadSuccess

        }}
        
        
        />

        
      </div>
    </div>
  );
};

export default Chat;
