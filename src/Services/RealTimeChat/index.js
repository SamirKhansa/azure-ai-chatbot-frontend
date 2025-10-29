import { 
  floatTo16BitPCM, 
  arrayBufferToBase64, 
  base64ToArrayBuffer, 
  createWavHeader, 
  combineWav 
} from '../../Utils/AudioHelperFunctions'

let nextStartTime = 0;
let activeSources = [];  // Track currently playing AI audio
let isUserSpeaking = false;

// ======================= WebSocket Setup =======================
export const startWebSocket = ({ wsRef, playAudio, setMessages }) => {
  if (wsRef.current) return;

  console.log("🌐 Connecting to backend realtime WebSocket...");
  const ws = new WebSocket("ws://127.0.0.1:8000/realtime");

  ws.onopen = () => console.log("🎤 Frontend connected to Realtime");
  ws.onclose = () => console.log("❌ WebSocket disconnected");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "audio.delta") {
      playAudio(msg.data); // Play AI audio
    } 
    else if (msg.type === "transcript") {
      setMessages(prev => [...prev, { role: "ai", text: msg.text }]);
    } 
    else if (msg.type === "stop_audio") {
      stopAllAIAudio(wsRef);
    }
  };

  wsRef.current = ws;
};

// ======================= Microphone + Speech Detection =======================
export const startRecording = async ({ audioContextRef, recorderRef, wsRef, setIsRecording, setShowMicOverlay }) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create AudioContext at 16kHz
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    // 🎙️ Monitor mic input for interruptions
    monitorMicInput(audioContext, source, wsRef);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
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
    console.error("❌ Error accessing microphone:", err);
    setIsRecording(false);
    setShowMicOverlay(false);
  }
};

export const stopRecording = ({ recorderRef, wsRef }) => {
  if (recorderRef.current) {
    recorderRef.current.disconnect();
    recorderRef.current = null;
  }

  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
  }
};

// ======================= AI Audio Playback =======================
export const playAudio = async (base64PCM, audioContextRef, speed = 1) => { 
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

  // Track for interruption
  activeSources.push(source);
  source.onended = () => {
    activeSources = activeSources.filter((s) => s !== source);
  };

  nextStartTime = startTime + audioBuffer.duration / speed;
};

// ======================= Stop All AI Audio =======================
function stopAllAIAudio(wsRef) {
  console.log("🛑 User started speaking — stopping AI playback...");

  // Stop local AI audio
  activeSources.forEach((src) => {
    try { src.stop(); } catch (e) {}
  });
  activeSources = [];
  nextStartTime = 0;

  // Tell backend to cancel model response
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({ type: "stop" }));
  }
}

// ======================= Detect User Speech =======================
function monitorMicInput(audioContext, sourceNode, wsRef) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  sourceNode.connect(analyser);

  function detectSpeech() {
    analyser.getByteFrequencyData(dataArray);
    const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    // 🎯 Adjust threshold based on mic sensitivity
    if (avgVolume > 25 && !isUserSpeaking) {
      isUserSpeaking = true;
      stopAllAIAudio(wsRef);
    }

    if (avgVolume < 10) {
      isUserSpeaking = false;
    }

    requestAnimationFrame(detectSpeech);
  }

  detectSpeech();
}
