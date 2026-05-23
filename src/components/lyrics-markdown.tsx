import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LyricsMarkdownProps {
  markdown: string;
}

export function LyricsMarkdown({ markdown }: LyricsMarkdownProps) {
  return (
    <div className="lyrics-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
