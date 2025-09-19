import React, { useState, useRef } from "react";
import Recorder from "recorder-js";

const MicButton = ({ onSendAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const recorderRef = useRef(null);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);

      // Convert to Base64 for backend
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        onSendAudio(base64data); // 🚀 pass audio to parent
      };
    } else {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        recorderRef.current = new Recorder(audioContextRef.current, { onAnalysed: () => {} });
        await recorderRef.current.init(stream);

        recorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  return (
    <button onClick={toggleRecording}>
      {isRecording ? "⏹ Stop" : "🎤 Speak"}
    </button>
  );
};

export default MicButton;
