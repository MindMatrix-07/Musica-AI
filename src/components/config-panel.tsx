import React from "react";
import type { CurateModel } from "@/lib/api";

interface ConfigPanelProps {
  model: CurateModel;
  onModelChange: (model: CurateModel) => void;
  temperature: number;
  splitStructure: boolean;
  onSplitStructureChange: (split: boolean) => void;
  disabled: boolean;
}

export function ConfigPanel({
  model,
  onModelChange,
  temperature,
  splitStructure,
  onSplitStructureChange,
  disabled,
}: ConfigPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            AI Model
          </label>
          <p className="text-xs text-foreground/50 h-8">
            Select the model for transcription. Flash is faster, Pro is more accurate.
          </p>
          <div className="flex gap-2">
            {(["gemini-3.5-flash", "gemini-3.5-pro"] as const).map((m) => (
              <button
                key={m}
                type="button"
                disabled={disabled}
                onClick={() => onModelChange(m)}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${
                  model === m
                    ? "border-[#c084fc] bg-[#c084fc]/20 text-foreground"
                    : "border-white/10 text-foreground/60 hover:border-white/20"
                }`}
              >
                {m === "gemini-3.5-flash" ? "3.5 Flash" : "3.5 Pro"}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Options */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            Pipeline Mode
          </label>
          <p className="text-xs text-foreground/50 h-8">
            Split structure separates transcription and structural analysis for better accuracy.
          </p>
          <div className="flex items-center mt-2 h-9">
            <label className={`flex items-center space-x-3 text-sm ${disabled ? "opacity-50" : "cursor-pointer"}`}>
              <input
                type="checkbox"
                checked={splitStructure}
                onChange={(e) => onSplitStructureChange(e.target.checked)}
                disabled={disabled}
                className="form-checkbox h-5 w-5 rounded text-[#c084fc] bg-black/20 border-white/10 focus:ring-[#c084fc] focus:ring-offset-black transition duration-150 ease-in-out"
              />
              <span className="text-foreground/80">Enable Split Structure</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
        <span className="text-xs text-foreground/50">Model Temperature</span>
        <span className="text-xs font-mono text-foreground/80 bg-white/5 px-2 py-1 rounded">
          {temperature.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
