"use client"
import type React from "react";
import { useState, useEffect, FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types";
import AdvancedMarkdownEditor from "@/components/admin/AdvancedMarkdownEditor";
import { supabase } from "@/supabase/client";
import imageCompression from 'browser-image-compression';

interface BlogEditorProps {
  post: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
}

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "";

// Helper for input class
const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-space ${hasError ? "border-red-500" : "border-black"}`; // Added font-space

const buttonPrimaryClass = "bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space"; // Added font-space
const buttonSecondaryClass = "bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space"; // Added font-space


export default function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", tags: "", published: false, cover_image_url: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "",
        content: post.content || "", tags: post.tags?.join(", ") || "",
        published: post.published ?? false, cover_image_url: post.cover_image_url || "",
      });
    } else {
      setFormData({
        title: "", slug: "", excerpt: "", content: "", tags: "", published: false, cover_image_url: ""
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title, slug: (!prev.slug || !post?.id) ? generateSlug(title) : prev.slug, }));
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) {
        newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
        newErrors.slug = "Slug must be lowercase, alphanumeric, with single hyphens.";
    }
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
    const postDataToSave: Partial<BlogPost> = {
      title: formData.title, slug: formData.slug, excerpt: formData.excerpt || null,
      content: formData.content, tags: tagsArray.length > 0 ? tagsArray : null,
      published: formData.published, cover_image_url: formData.cover_image_url || null,
    };
    await onSave(postDataToSave);
    setIsSaving(false);
  };

  const handleImageUpload = async (file: File, forCoverImage: boolean = false) => {
    if (!file) return;
    setIsUploading(true);
    setErrors(prev => ({...prev, image_upload: ""}));

    const options = {
      maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true,
      fileType: 'image/webp', initialQuality: 0.8,
    };

    let compressedFile = file;
    try {
      const canvas = document.createElement('canvas');
      if (!(canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0)) {
        options.fileType = file.type;
      }
      compressedFile = await imageCompression(file, options);
    } catch (error) {
      console.error("Image compression error:", error);
      setErrors(prev => ({...prev, image_upload: "Image compression failed. Trying original."}));
    }

    const fileName = `${Date.now()}_${compressedFile.name.replace(/\s+/g, '_')}`;
    const filePath = `blog_images/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressedFile);

    setIsUploading(false);
    if (uploadError) {
      setErrors(prev => ({...prev, image_upload: "Upload failed: " + uploadError.message}));
      return;
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    const imageUrl = urlData.publicUrl;

    if (forCoverImage) {
      setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
    } else {
      const imageMarkdown = `\n![${compressedFile.name}](${imageUrl})\n`;
      setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
    }
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const isForCover = event.target.id === "cover_image_file_input";
        handleImageUpload(file, isForCover);
    }
    if(event.target) event.target.value = "";
  };


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto font-space"> {/* Added font-space */}
      <div className="bg-white border-2 border-black rounded-none overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-black bg-gray-100">
           <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">{post?.id ? "Edit Post" : "Create New Post"}</h2>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                className="appearance-none w-5 h-5 border-2 border-black bg-white checked:bg-indigo-500 checked:border-indigo-500 relative"
              />
               <span className="ml-2 text-sm font-semibold text-black">Published</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-black mb-1">Title *</label>
                <input type="text" id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)}
                  className={inputClass(!!errors.title)} />
                {errors.title && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Content (Markdown) *</label>
                <AdvancedMarkdownEditor
                  value={formData.content}
                  onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                  onImageUploadRequest={() => fileInputRef.current?.click()}
                  minHeight="400px"
                />
                <input type="file" ref={fileInputRef} onChange={onFileSelected} accept="image/*" className="hidden" id="content_image_file_input"/>
                {errors.content && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.content}</p>}
                {errors.image_upload && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.image_upload}</p>}
                {isUploading && <p className="text-sm text-blue-600 font-semibold">Uploading image...</p>}
              </div>
            </div>

            <div className="space-y-6 bg-gray-50 p-4 border-2 border-black rounded-none">
              <div>
                <label htmlFor="slug" className="block text-sm font-bold text-black mb-1">Slug *</label>
                <input type="text" id="slug" value={formData.slug} onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))}
                  className={inputClass(!!errors.slug)} />
                 {errors.slug && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.slug}</p>}
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-sm font-bold text-black mb-1">Excerpt (Short summary)</label>
                <textarea id="excerpt" rows={3} value={formData.excerpt} onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
                  className={inputClass(false) + " resize-none"} />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-bold text-black mb-1">Tags (comma-separated)</label>
                <input type="text" id="tags" value={formData.tags} onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                  className={inputClass(false)} />
              </div>
              <div>
                <label htmlFor="cover_image_url" className="block text-sm font-bold text-black mb-1">Cover Image</label>
                <input type="text" id="cover_image_url" value={formData.cover_image_url}
                       onChange={(e) => setFormData(prev => ({...prev, cover_image_url: e.target.value}))}
                       className={`${inputClass(!!errors.cover_image_url)} mb-2`} placeholder="Paste image URL or upload" />
                <input type="file" id="cover_image_file_input" accept="image/*" onChange={onFileSelected}
                       className="text-sm w-full border-2 border-black rounded-none p-2 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 font-space"/> {/* Added font-space */}
                {formData.cover_image_url && <img src={formData.cover_image_url} alt="Cover preview" className="mt-2 max-h-40 w-full object-contain rounded-none border-2 border-black"/>}
                {errors.cover_image_url && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.cover_image_url}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t-2 border-black">
            <button type="button" onClick={onCancel} className={buttonSecondaryClass} disabled={isSaving || isUploading}>Cancel</button>
            <button type="submit" disabled={isSaving || isUploading} className={buttonPrimaryClass}>
              {isSaving ? "Saving..." : isUploading ? "Processing Image..." : (post?.id ? "Update Post" : "Create Post")}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}