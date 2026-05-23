import * as lamejs from "@breezystack/lamejs";

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function compressAudioIfNeeded(
  file: File
): Promise<{
  file: File;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
  qualityLabel?: string;
}> {
  const MAX_SIZE = 4 * 1024 * 1024; // 4MB Vercel Limit
  
  if (file.size <= MAX_SIZE) {
    return {
      file,
      compressed: false,
      originalSize: file.size,
      finalSize: file.size,
    };
  }

  try {
    // 1. Decode original file via Web Audio API
    const arrayBuffer = await file.arrayBuffer();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // 2. Downsample to 16kHz mono using OfflineAudioContext
    const TARGET_SAMPLE_RATE = 16000;
    const offlineCtx = new OfflineAudioContext(
      1, // mono
      (audioBuffer.length * TARGET_SAMPLE_RATE) / audioBuffer.sampleRate,
      TARGET_SAMPLE_RATE
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();

    const renderedBuffer = await offlineCtx.startRendering();
    const channelData = renderedBuffer.getChannelData(0);

    // 3. Convert Float32 (-1.0 to 1.0) into Int16 (-32768 to 32767) for lamejs
    const left = new Int16Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      let s = Math.max(-1, Math.min(1, channelData[i]));
      left[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // 4. Encode to 32kbps MP3
    const mp3Encoder = new lamejs.Mp3Encoder(1, TARGET_SAMPLE_RATE, 32);
    const sampleBlockSize = 1152;
    const mp3Data: Int8Array[] = [];

    for (let i = 0; i < left.length; i += sampleBlockSize) {
      const chunk = left.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3Encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    const mp3buf = mp3Encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    // 5. Construct new File and return
    const blob = new Blob(mp3Data, { type: "audio/mp3" });
    const newName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.mp3";
    const compressedFile = new File([blob], newName, { type: "audio/mp3" });

    // If for some reason the "compressed" file is larger, fallback to original
    // (though highly unlikely for 32kbps MP3)
    if (compressedFile.size > file.size) {
       return {
         file,
         compressed: false,
         originalSize: file.size,
         finalSize: file.size,
       };
    }

    return {
      file: compressedFile,
      compressed: true,
      originalSize: file.size,
      finalSize: compressedFile.size,
      qualityLabel: "16kHz 32kbps",
    };
  } catch (error) {
    console.error("Audio compression failed:", error);
    // If compression fails, try to return the original and hope Vercel accepts it
    return {
      file,
      compressed: false,
      originalSize: file.size,
      finalSize: file.size,
    };
  }
}
