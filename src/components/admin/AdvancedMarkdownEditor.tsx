import React from "react";
import MarkdownEditor from "@/components/admin/markdown-editor";

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUploadRequest: () => void;
  minHeight?: string;
}

export default function AdvancedMarkdownEditor({
  value,
  onChange,
  onImageUploadRequest,
  minHeight = "300px",
}: AdvancedMarkdownEditorProps) {

  return (
    <div className="border-2 border-black rounded-none font-space"> {/* Added font-space */}
      <div className="p-2 bg-gray-100 border-b-2 border-black flex justify-between items-center">
        <span className="text-xs text-black font-semibold">Markdown Editor</span>
        <button
          type="button"
          onClick={onImageUploadRequest}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-none border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all font-space" // Added font-space
        >
          Upload Image to Content
        </button>
      </div>
      <MarkdownEditor
        value={value}
        onChange={onChange}
        placeholder="Write your amazing blog post here..."
        height={minHeight}
      />
    </div>
  );
}