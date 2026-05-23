import React from "react";

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function PromptBox({ value, onChange, disabled }: PromptBoxProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="user-prompt" className="block text-sm font-medium text-foreground/80">
        Custom Instructions
      </label>
      <p className="text-xs text-foreground/50">
        Provide extra context or rules for the AI (e.g., "This is a cover song", "Keep the Roman Urdu lyrics exactly as they sound", "Use [Bridge] instead of [Pre-Chorus]").
      </p>
      <textarea
        id="user-prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter any specific instructions for this curation..."
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c084fc]/50 disabled:opacity-50 resize-none transition"
      />
    </div>
  );
}
