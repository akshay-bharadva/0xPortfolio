"use client"

import { useState, useEffect } from "react"
import DOMPurify from 'dompurify';

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

// Updated markdownToHtml to be more robust for Neo-Brutalism (less default styling from prose)
const markdownToHtml = (markdown: string): string => {
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
      markdown = DOMPurify.sanitize(markdown); // Basic XSS protection if used client-side for preview
  }
  let html = markdown
    .replace(/^# (.*$)/gim, "<h1 class='text-3xl font-bold my-4 font-space'>$1</h1>") // Added font-space
    .replace(/^## (.*$)/gim, "<h2 class='text-2xl font-bold my-3 font-space'>$1</h2>") // Added font-space
    .replace(/^### (.*$)/gim, "<h3 class='text-xl font-bold my-2 font-space'>$1</h3>") // Added font-space
    .replace(/\*\*(.*?)\*\*/gim, "<strong class='font-space'>$1</strong>") // Added font-space
    .replace(/__(.*?)__/gim, "<strong class='font-space'>$1</strong>") // Added font-space
    .replace(/\*(.*?)\*/gim, "<em class='font-space'>$1</em>") // Added font-space
    .replace(/_(.*?)_/gim, "<em class='font-space'>$1</em>") // Added font-space
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-3 border-2 border-black" />') // Added border
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline font-semibold font-space">$1</a>') // Added font-space
    .replace(/```([\s\S]*?)```/gim, (match, p1) => `<pre class='bg-gray-800 text-white p-3 my-3 border-2 border-black overflow-x-auto font-mono text-sm'><code class='font-mono'>${p1.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`) // Styled pre/code - font-mono takes precedence
    .replace(/`(.*?)`/gim, "<code class='bg-gray-200 text-red-600 px-1 py-0.5 font-mono text-sm border border-black'>$1</code>") // Styled inline code - font-mono takes precedence
    .replace(/^\> (.*$)/gim, "<blockquote class='border-l-4 border-black pl-4 py-2 my-3 bg-gray-100 italic font-space'>$1</blockquote>") // Styled blockquote, added font-space
    .replace(/^\s*[-*+] (.*$)/gim, "<li class='font-space'>$1</li>") // Added font-space
    .replace(/^\s*\d+\. (.*$)/gim, "<li class='font-space'>$1</li>") // Added font-space
    .replace(/(\<li\>.*?\<\/li\>)/gim, "<ul>$1</ul>") // Naive wrap for lists, may need refinement
    .replace(/<\/ul>\s*<ul>/gim, "") // Consolidate adjacent lists
    .replace(/\n\n/gim, "</p><p class='my-2 font-space'>") // Paragraphs, added font-space
    .replace(/\n/gim, "<br />") // Line breaks

  html = "<div class='markdown-preview-content font-space'><p class='my-2 font-space'>" + html + "</p></div>" // Wrap all, added font-space
  // Cleanup empty paragraphs and excessive line breaks that might result from the above
  html = html.replace(/<p class='my-2 font-space'>\s*<\/p>/g, "").replace(/(<br\s*\/?>\s*){3,}/g, "<br /><br />");
  return html;
}


export default function MarkdownEditor({ value, onChange, placeholder, height = "400px" }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [renderedHtml, setRenderedHtml] = useState("")

  useEffect(() => {
    if (activeTab === "preview") {
      setRenderedHtml(markdownToHtml(value))
    }
  }, [value, activeTab])

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const toolbarButtons = [
    { label: "H1", action: () => insertMarkdown("# "), icon: "H1" },
    { label: "H2", action: () => insertMarkdown("## "), icon: "H2" },
    { label: "H3", action: () => insertMarkdown("### "), icon: "H3" },
    { label: "Bold", action: () => insertMarkdown("**", "**"), icon: "B" },
    { label: "Italic", action: () => insertMarkdown("*", "*"), icon: "I" },
    { label: "Code", action: () => insertMarkdown("`", "`"), icon: "</>" },
    { label: "Block", action: () => insertMarkdown("```\n", "\n```"), icon: "{ }" },
    { label: "Link", action: () => insertMarkdown("[", "](url)"), icon: "🔗" },
    { label: "Image", action: () => insertMarkdown("![alt](", ")"), icon: "🖼️" },
    { label: "List", action: () => insertMarkdown("- "), icon: "•" },
    { label: "Quote", action: () => insertMarkdown("> "), icon: "❝" },
  ]

  return (
    <div className="border-2 border-black rounded-none overflow-hidden bg-white font-space"> {/* Added font-space */}
      <div className="bg-gray-100 border-b-2 border-black p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {toolbarButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className="px-2 py-1 text-xs font-bold bg-white border border-black rounded-none hover:bg-gray-200 transition-colors shadow-[1px_1px_0_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none font-space" // Added font-space
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
          </div>

          <div className="flex bg-white border-2 border-black rounded-none">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1 text-sm font-bold transition-colors font-space ${ // Added font-space
                activeTab === "write" ? "bg-black text-white" : "text-black hover:bg-gray-200"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 text-sm font-bold transition-colors border-l-2 border-black font-space ${ // Added font-space
                activeTab === "preview" ? "bg-black text-white" : "text-black hover:bg-gray-200"
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
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 border-none rounded-none resize-none focus:outline-none font-mono text-sm bg-white text-black" // font-mono for writing area
          />
        ) : (
          <div className="h-full p-4 overflow-auto bg-white text-black font-space" // Added font-space to preview, markdownToHtml also adds it
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            style={{ lineHeight: "1.6" }}
          />
        )}
      </div>

      <div className="bg-gray-100 border-t-2 border-black px-4 py-2 text-xs text-gray-700">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Markdown supported</span>
          <span className="font-semibold">{value.length} characters</span>
        </div>
      </div>
    </div>
  )
}