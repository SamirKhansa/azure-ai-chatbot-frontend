
import { startWebSocket, startRecording, stopRecording, playAudio } from "../Services/RealTimeChat";


export const handleMicClick = ({isRecording,setIsRecording, setShowMicOverlay, wsRef, audioContextRef, recorderRef, setMessages }) => {
  if (!isRecording) {
    // Start recording
    setIsRecording(true);
    setShowMicOverlay(true);
    startWebSocket({ wsRef, playAudio: (data) => playAudio(data, audioContextRef), setMessages });
    startRecording({ audioContextRef, recorderRef, wsRef, setIsRecording, setShowMicOverlay });
  } else {
    // Stop recording
    setIsRecording(false);
    setShowMicOverlay(false);
    stopRecording({ recorderRef, wsRef });
  }
};







export function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

export const base64ToArrayBuffer=(base64)=> {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
}

export function createWavHeader(samplesLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  /* RIFF identifier */
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + samplesLength, true); // file length minus first 8 bytes
  view.setUint32(8, 0x57415645, false); // "WAVE"

  /* fmt chunk */
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Audio format = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  /* data chunk */
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, samplesLength, true);

  return buffer;
}

export function combineWav(header, pcmArrayBuffer) {
  const tmp = new Uint8Array(header.byteLength + pcmArrayBuffer.byteLength);
  tmp.set(new Uint8Array(header), 0);
  tmp.set(new Uint8Array(pcmArrayBuffer), header.byteLength);
  return tmp.buffer;
}
