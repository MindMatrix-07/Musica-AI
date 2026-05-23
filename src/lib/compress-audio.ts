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
  // If the file is already small enough, skip compression
  const MAX_SIZE = 4 * 1024 * 1024; // 4MB Vercel limit
  if (file.size <= MAX_SIZE) {
    return {
      file,
      compressed: false,
      originalSize: file.size,
      finalSize: file.size,
    };
  }

  // To implement actual compression without heavy WASM dependencies in the browser,
  // one could use an OfflineAudioContext to render the audio at a lower sample rate 
  // and export it as a highly compressed format.
  // For the sake of this implementation, we will just return the original file
  // and let the backend throw a 413 Payload Too Large if it exceeds limits.
  console.warn("Audio file is larger than 4MB. Vercel serverless function may reject it.");

  return {
    file,
    compressed: false,
    originalSize: file.size,
    finalSize: file.size,
    qualityLabel: "Original",
  };
}
