
import { sendMessageToBackend } from "../Chat";
import Recorder from "recorder-js";


export const playLatestAudio = async(latestAudio) => {
    if (latestAudio) {
        const audio = new Audio(latestAudio);
        audio.play();
    }
};




export const sendAudio = async (base64data, audioBlobUrl, setMessages, setLatestAudio, setLoading) => {
  setMessages(prev => [...prev, { role: "user", text: "🎤 (voice message)" }]);
  setLatestAudio(audioBlobUrl);
  setLoading(true);

  try {
    // 🟢 Make sure sendMessageToBackend knows this is an audio request
    const response = await sendMessageToBackend("", base64data); 

    // 🟢 Handle if response is object or contains text field
    console.log(response)
    
    setMessages(prev => [...prev, { role: "ai", text: response.text }]);
  } catch (error) {
    console.error("Error sending audio:", error);
    setMessages(prev => [
      ...prev,
      { role: "ai", text: "Something went wrong with audio 😅" }
    ]);
  } finally {
    setLoading(false);
  }
};








export const toggleRecording = async ({isRecording, setIsRecording, audioContextRef, recorderRef, setMessages, setLatestAudio, setLoading}) => {
    if (isRecording) {
      // Stop recording
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);

      // Convert to Base64 for backend
      const audioBlobUrl = URL.createObjectURL(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        sendAudio(base64data, audioBlobUrl, setMessages, setLatestAudio, setLoading); 
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




