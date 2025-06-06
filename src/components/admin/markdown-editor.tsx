"use client";

import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const markdownToHtml = (markdown: string): string => {
  // Ensure DOMPurify is available (it might not be during SSR if this function is called then)
  const sanitizedMarkdown =
    typeof window !== "undefined" && DOMPurify.sanitize
      ? DOMPurify.sanitize(markdown)
      : markdown; // Basic fallback if DOMPurify not available

  let html = sanitizedMarkdown
    .replace(
      /^# (.*$)/gim,
      "<h1 class='text-3xl font-bold my-4 font-space'>$1</h1>",
    )
    .replace(
      /^## (.*$)/gim,
      "<h2 class='text-2xl font-bold my-3 font-space'>$1</h2>",
    )
    .replace(
      /^### (.*$)/gim,
      "<h3 class='text-xl font-bold my-2 font-space'>$1</h3>",
    )
    .replace(
      /\*\*(.*?)\*\*|__(.*?)__/gim,
      "<strong class='font-space'>$1$2</strong>",
    )
    .replace(/\*(.*?)\*|_(.*?)_/gim, "<em class='font-space'>$1$2</em>")
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<img src="$2" alt="$1" loading="lazy" class="max-w-full h-auto my-3 border-2 border-black rounded-none" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline font-semibold font-space">$1</a>',
    )
    .replace(
      /```([\s\S]*?)```/gim,
      (match, p1) =>
        `<pre class='bg-gray-800 text-white p-3 my-3 border-2 border-black rounded-none overflow-x-auto font-mono text-sm'><code class='font-mono'>${p1.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`,
    )
    .replace(
      /`(.*?)`/gim,
      "<code class='bg-gray-200 text-red-600 px-1 py-0.5 font-mono text-sm border border-black rounded-none'>$1</code>",
    )
    .replace(
      /^\> (.*$)/gim,
      "<blockquote class='border-l-4 border-black pl-4 py-2 my-3 bg-gray-100 italic font-space rounded-none'>$1</blockquote>",
    )
    // Improved list handling: Process multiline list items correctly before wrapping
    .replace(
      /^\s*([-*+]) (.*(?:\n(?!\n).*)*)/gm,
      (match, char, content) =>
        `<li class='font-space'>${content.replace(/\n/gm, "<br />")}</li>`,
    )
    .replace(
      /^\s*(\d+\.) (.*(?:\n(?!\n).*)*)/gm,
      (match, char, content) =>
        `<li class='font-space'>${content.replace(/\n/gm, "<br />")}</li>`,
    )
    // Wrap li items in ul/ol. This is still naive and works best for simple lists.
    // Complex nested lists might require a more sophisticated parser.
    .replace(
      /(\<li class='font-space'\>.*?\<\/li\>)(?=\s*<li class='font-space'>|$)/gim,
      (match, item) => {
        // Check if it's part of an existing list structure already
        if (match.startsWith("<ul>") || match.startsWith("<ol>")) return match;
        // Determine list type based on original markdown (heuristic)
        // This part is tricky without full parsing; for now, default to ul
        return `<ul>${item}</ul>`;
      },
    )
    .replace(/<\/ul>\s*<ul>/gim, "") // Consolidate adjacent lists of same type
    .replace(/<\/ol>\s*<ol>/gim, "")
    .replace(/\n\n/gim, "</p><p class='my-2 font-space'>")
    .replace(/\n/gim, "<br />"); // Convert remaining single newlines to <br>

  // Wrap everything in a div and a starting p tag if not already structured
  if (!html.trim().startsWith("<")) {
    html = "<p class='my-2 font-space'>" + html;
  }
  if (!html.trim().endsWith("</p>")) {
    html = html + "</p>";
  }
  html = "<div class='markdown-preview-content font-space'>" + html + "</div>";

  html = html
    .replace(/<p class='my-2 font-space'>\s*(<br\s*\/?>\s*)*\s*<\/p>/g, "") // Remove empty paragraphs
    .replace(/(<br\s*\/?>\s*){3,}/g, "<br /><br />"); // Reduce multiple line breaks

  return html;
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  height = "400px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [renderedHtml, setRenderedHtml] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeTab === "preview") {
      setRenderedHtml(markdownToHtml(value));
    }
  }, [value, activeTab]);

  const insertMarkdown = (before: string, after = "", placeholderText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholderText;
    const newText =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + textToInsert.length,
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      label: "H1",
      action: () => insertMarkdown("# ", "", "Heading 1"),
      icon: "H1",
    },
    {
      label: "H2",
      action: () => insertMarkdown("## ", "", "Heading 2"),
      icon: "H2",
    },
    {
      label: "H3",
      action: () => insertMarkdown("### ", "", "Heading 3"),
      icon: "H3",
    },
    {
      label: "Bold",
      action: () => insertMarkdown("**", "**", "bold text"),
      icon: "B",
    },
    {
      label: "Italic",
      action: () => insertMarkdown("*", "*", "italic text"),
      icon: "I",
    },
    {
      label: "Code",
      action: () => insertMarkdown("`", "`", "code"),
      icon: "</>",
    },
    {
      label: "Block",
      action: () => insertMarkdown("```\n", "\n```", "code block"),
      icon: "{ }",
    },
    {
      label: "Link",
      action: () => insertMarkdown("[", "](url)", "link text"),
      icon: "🔗",
    },
    {
      label: "Image",
      action: () => insertMarkdown("![alt text](", ")", "image url"),
      icon: "🖼️",
    },
    {
      label: "List",
      action: () => insertMarkdown("- ", "", "list item"),
      icon: "•",
    },
    {
      label: "Quote",
      action: () => insertMarkdown("> ", "", "quote"),
      icon: "❝",
    },
  ];

  return (
    <div className="overflow-hidden rounded-none border-2 border-black bg-white font-space">
      <div className="border-b-2 border-black bg-gray-100 p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 space-x-1">
            {toolbarButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className="rounded-none border border-black bg-white px-2 py-1 font-space text-xs font-bold shadow-[1px_1px_0_#000] transition-colors hover:bg-gray-200 active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
          </div>

          <div className="flex rounded-none border-2 border-black bg-white">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1 font-space text-sm font-bold transition-colors ${
                activeTab === "write"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`border-l-2 border-black px-3 py-1 font-space text-sm font-bold transition-colors ${
                activeTab === "preview"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div style={{ height }}>
        {activeTab === "write" ? (
          <textarea
            id="markdown-textarea" // Keep ID for potential external interactions if any
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="size-full resize-none rounded-none border-none bg-white p-4 font-mono text-sm text-black focus:outline-none"
            spellCheck="false"
          />
        ) : (
          <div
            className="h-full overflow-auto bg-white p-4 font-space text-black"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            style={{ lineHeight: "1.6" }}
          />
        )}
      </div>

      <div className="border-t-2 border-black bg-gray-100 px-4 py-2 text-xs text-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Markdown supported</span>
          <span className="font-semibold">{value.length} characters</span>
        </div>
      </div>
    </div>
  );
}
