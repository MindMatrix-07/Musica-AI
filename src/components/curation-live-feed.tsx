import React, { useEffect, useRef } from "react";
import type { CurateStreamEvent, StreamPass } from "@/lib/api";

interface CurationLiveFeedProps {
  active: boolean;
  events: CurateStreamEvent[];
  liveText: string;
  currentPass: StreamPass | null;
}

export function CurationLiveFeed({
  active,
  events,
  liveText,
  currentPass,
}: CurationLiveFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, liveText]);

  if (!active && events.length === 0) return null;

  return (
    <div className="glass-panel p-5 overflow-hidden flex flex-col max-h-64">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <span className="relative flex h-2 w-2 mr-2">
            {active && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c084fc] opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-[#c084fc]' : 'bg-white/30'}`}></span>
          </span>
          Live Feed
        </h3>
        {currentPass && (
          <span className="tag-badge text-[10px]">
            {currentPass === "single-pass" ? "Processing" : currentPass}
          </span>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 text-xs font-mono pr-2 custom-scrollbar"
      >
        {events.map((ev, i) => {
          if (ev.type === "status") {
            return (
              <div key={i} className="text-blue-300/80 italic">
                › {ev.message}
              </div>
            );
          }
          if (ev.type === "pass_start") {
            return (
              <div key={i} className="text-[#c084fc] font-semibold mt-2">
                [{ev.pass.toUpperCase()}] {ev.message} (Model: {ev.model})
              </div>
            );
          }
          if (ev.type === "pass_end") {
            return (
              <div key={i} className="text-emerald-400/80 italic mb-2">
                › Completed {ev.pass} pass
              </div>
            );
          }
          if (ev.type === "error") {
            return (
              <div key={i} className="text-red-400 font-semibold">
                [ERROR] {ev.message}
              </div>
            );
          }
          if (ev.type === "done") {
            return (
              <div key={i} className="text-green-400 font-bold mt-2">
                › Curation finished successfully.
              </div>
            );
          }
          return null; // Ignore chunks in the event list, we handle liveText separately
        })}
        
        {liveText && (
          <div className="text-foreground/70 whitespace-pre-wrap mt-2 pl-2 border-l-2 border-[#c084fc]/50">
            {liveText}
            {active && <span className="animate-pulse inline-block w-1.5 h-3 ml-1 bg-[#c084fc]"></span>}
          </div>
        )}
      </div>
    </div>
  );
}
