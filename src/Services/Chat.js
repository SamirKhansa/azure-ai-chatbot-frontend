import axios from "axios";

export const sendMessageToBackend = async (userMessage = null, audioBase64 = null) => {
  try {
    // 1. Get sessionId from localStorage (if it exists)
    let sessionId = localStorage.getItem("sessionId");

    // 2. Build request payload
    const payload = {
      sessionId: sessionId || null,
    };

    if (userMessage) payload.message = userMessage;
    if (audioBase64) payload.audioBase64 = audioBase64;

    // 3. Send message + sessionId (if any)
    const response = await axios.post("http://localhost:7071/api/ChatbotFunction", payload);

    // 4. Extract data from backend response
    const { reply, audioBase64: replyAudio, sessionId: newSessionId } = response.data;

    // 5. If backend sent a new sessionId, store it
    if (newSessionId && !sessionId) {
      localStorage.setItem("sessionId", newSessionId);
    }

    // 6. Play audio if available
    if (replyAudio) {
      const audio = new Audio("data:audio/wav;base64," + replyAudio);
      audio.play();
    }

    console.log("Backend replied: " + reply);
    return reply;

  } catch (error) {
    if(error.response){
      console.log("1");
       console.error("Backend error:", error.response.data);
       console.error("Status:", error.response.status);
    }
    else{
      console.log("2");
      console.error("Request error:", error.message);
    }
    console.log("3");
    console.error("Error sending message:", error);
    return "Sorry, something went wrong 😅";
  }
};
