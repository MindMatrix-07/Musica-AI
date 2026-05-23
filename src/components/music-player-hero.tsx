import React from "react";

interface MusicPlayerHeroProps {
  audioUrl: string | null;
  fileName: string | null;
  onUploadClick: () => void;
  onCurate: () => void;
  canCurate: boolean;
  processing: boolean;
  disabled: boolean;
}

export function MusicPlayerHero({
  audioUrl,
  fileName,
  onUploadClick,
  onCurate,
  canCurate,
  processing,
  disabled,
}: MusicPlayerHeroProps) {
  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-6 text-center">
      {!audioUrl ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#c084fc]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">
            Upload an audio track
          </h2>
          <p className="text-sm text-foreground/50 mb-6 max-w-sm">
            Drag and drop or select an audio file to start generating synchronized lyrics and song structure.
          </p>
          <button
            type="button"
            onClick={onUploadClick}
            disabled={disabled || processing}
            className="rounded-xl bg-[#c084fc] hover:bg-[#a855f7] px-6 py-3 text-sm font-medium text-white cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Audio File
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center space-x-3 truncate">
              <div className="h-10 w-10 rounded bg-[#c084fc]/20 flex items-center justify-center flex-shrink-0">
                 <svg className="w-5 h-5 text-[#c084fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              </div>
              <span className="font-medium text-foreground truncate" title={fileName || "Unknown file"}>
                {fileName}
              </span>
            </div>
            <button
              type="button"
              onClick={onUploadClick}
              disabled={disabled || processing}
              className="text-xs font-medium text-foreground/60 hover:text-foreground cursor-pointer transition"
            >
              Change file
            </button>
          </div>

          <audio
            controls
            src={audioUrl}
            className="w-full mb-6 outline-none"
          />

          <button
            type="button"
            onClick={onCurate}
            disabled={disabled || processing || !canCurate}
            className="w-full rounded-xl bg-gradient-to-r from-[#c084fc] to-[#a855f7] hover:from-[#a855f7] hover:to-[#9333ea] px-6 py-3 text-sm font-medium text-white cursor-pointer transition shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Generate Lyrics & Structure"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
