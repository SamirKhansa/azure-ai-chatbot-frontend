import axios from "axios";

export const sendMessageToBackend = async (userMessage = null, audioBase64 = null) => {
  try {
    let sessionId = localStorage.getItem("sessionId");

    const payload = {
      sessionId: sessionId || null,
    };
    if (userMessage) payload.message = userMessage;
    if (audioBase64) payload.audioBase64 = audioBase64;

    const response = await axios.post("http://localhost:7071/api/ChatbotFunction/Chat", payload);

    // Use the correct keys from backend
    const { text, type, url, audioBase64: replyAudio, sessionId: newSessionId } = response.data;

    if (newSessionId && !sessionId) {
      localStorage.setItem("sessionId", newSessionId);
    }

    if (replyAudio) {
      const audio = new Audio("data:audio/wav;base64," + replyAudio);
      audio.play();
    }

    console.log("Backend replied:", response.data);

    return {
      type: type,
      text: text,
      url: url|| null
    };

  } catch (error) {
    if(error.response){
      console.error("Backend error:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Request error:", error.message);
    }
    return {
      type: "text",
      text: "Sorry, something went wrong 😅",
      url: null
    };
  }
};


export const handleSend = async ({input, setMessages, setInput, setLoading}) => {
    console.log(" i AM inside HandleSend");
    console.log(input+" This is the input value is should not be undefined!!");
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToBackend(userMessage);

      // Add AI reply to messages based on type
      if (reply.type === "Image" && reply.url) {
        console.log(reply.url);
        console.log("I am the image url above");
        setMessages(prev => [
          ...prev,
          { role: "ai", type: "image", text: reply.text, url: reply.url }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "ai", type: "text", text: reply.text }
        ]);
      }

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", type: "text", text: "Something went wrong 😅" }
      ]);
    } finally {
      setLoading(false);
    }
};

// Handle Enter key
export const handleKeyDown = (e, input, setMessages, setInput, setLoading) => {
  if (e.key === "Enter") handleSend(input, setMessages, setInput, setLoading);
};



export const ClearHistory= async()=>{
  const SessionId= localStorage.getItem("sessionId");
  await axios.post(
        "http://localhost:7071/api/ChatbotFunction/ClearHistory",
        { SessionId:SessionId
         },
        { headers: { "Content-Type": "application/json" } }
    );

    console.log("History is deleted sucessfully");
    
}



export const handleFileUpload = async (base64File, fileType, setMessages) => {
  try {
    const payload = {
      message: "User uploaded a file", // you can replace this with actual user input
      file: base64File,
      file_type: fileType,
      first_interaction: false
    };

    const response = await axios.post(
      "http://localhost:7071/api/ChatbotFunction/UserImageUpload",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Axios wraps the response in `data`
    const data = response.data;

    // Optional: add AI reply to messages
    if (data.reply) {
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    }

    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    setMessages(prev => [...prev, { role: "ai", text: "Failed to process the uploaded file." }]);
  }
};
