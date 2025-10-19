import { floatTo16BitPCM, arrayBufferToBase64, base64ToArrayBuffer, createWavHeader, combineWav } from '../../Utils/AudioHelperFunctions'

let nextStartTime = 0;


export const startWebSocket = ({wsRef, playAudio, setMessages}) => {
  if (wsRef.current) return;
  console.log("11111111111111111111111111111111111111111111111111111111111");

  const ws = new WebSocket("ws://127.0.0.1:8000/realtime");

  ws.onopen = () => console.log("🎤 Frontend connected to Realtime");
  ws.onclose = () => console.log("❌ WebSocket disconnected");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log("Received an audio for realtime from the backend:", msg);
    if (msg.type === "audio.delta") {
    //   console.log("Audio delta (base64) length:", msg.data.length);
    //   console.log("First 50 chars:", msg.data.slice(0, 50));
      playAudio(msg.data);
    }

    // if (msg.type === "audio.delta") playAudio(msg.data);
    else if (msg.type === "transcript") {
      setMessages(prev => [...prev, { role: "ai", text: msg.text }]);
    }
  };

  wsRef.current = ws;
};


export const startRecording = async ({ audioContextRef, recorderRef, wsRef, setIsRecording, setShowMicOverlay }) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create AudioContext at 16kHz
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0); // mono
      const buffer = floatTo16BitPCM(inputData);
      const base64Audio = arrayBufferToBase64(buffer);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: base64Audio
        }));
      }
    };

    recorderRef.current = processor;

  } catch (err) {
    console.error("Error accessing microphone:", err);
    setIsRecording(false);
    setShowMicOverlay(false);
  }

};

export const stopRecording = ({recorderRef, wsRef}) => {
  if (recorderRef.current) {
    recorderRef.current.disconnect();
    recorderRef.current = null;
  }

  
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
  }
};

export const playAudio =async  (base64PCM,audioContextRef, speed = 1) => { 
  const audioContext = audioContextRef.current;
  if (!audioContext) return;

  const pcmBuffer = base64ToArrayBuffer(base64PCM);
  const wavHeader = createWavHeader(pcmBuffer.byteLength);
  const wavBuffer = combineWav(wavHeader, pcmBuffer);

  const audioBuffer = await audioContext.decodeAudioData(wavBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = speed;
  source.connect(audioContext.destination);

  const now = audioContext.currentTime;
  const startTime = Math.max(nextStartTime, now + 0.05);
  source.start(startTime);

  nextStartTime = startTime + audioBuffer.duration / speed;
};




