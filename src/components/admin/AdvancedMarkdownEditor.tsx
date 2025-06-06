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
    <div className="rounded-none border-2 border-black font-space">
      <div className="flex items-center justify-between border-b-2 border-black bg-gray-100 p-2">
        <span className="text-xs font-semibold text-black">
          Markdown Editor
        </span>
        <button
          type="button"
          onClick={onImageUploadRequest}
          className="rounded-none border-2 border-black bg-blue-500 px-3 py-1 font-space text-xs text-white shadow-[2px_2px_0px_#000] transition-all hover:bg-blue-600 active:translate-x-px active:translate-y-px active:shadow-none"
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
