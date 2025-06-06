"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/types"; // Use BlogPost
import BlogEditor from "./blog-editor";
import { supabase } from "@/supabase/client";

const inputClass = "w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-space"; // Added font-space
const selectClass = "px-3 py-2 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-space"; // Added font-space
const buttonPrimaryClass = (fullWidth = false) =>
    `bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space ${fullWidth ? 'w-full' : ''}`; // Added font-space
const buttonActionClass = (color: string, bgColorHover: string, textColor: string = 'text-black') =>
    `px-3 py-1 rounded-none text-sm font-semibold border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50 transition-all duration-100 font-space ${color} hover:${bgColorHover} ${textColor}`; // Added font-space


export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

    if (filterStatus === "published") query = query.eq('published', true);
    else if (filterStatus === "draft") query = query.eq('published', false);
    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError("Failed to load posts: " + fetchError.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [filterStatus, searchTerm]);

  const handleCreatePost = () => {
    setIsCreating(true);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setIsLoading(true);
      // First, delete cover image if it exists and is from our bucket
      const postToDelete = posts.find(p => p.id === postId);
      if (postToDelete?.cover_image_url && postToDelete.cover_image_url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '')) {
        const path = postToDelete.cover_image_url.substring(postToDelete.cover_image_url.lastIndexOf('/') + 1);
        if (path.startsWith('blog_images/')) { // Check if it's in our designated folder
          await supabase.storage.from(process.env.NEXT_PUBLIC_BUCKET_NAME || '').remove([path]);
        }
      }
      // Then delete content images (more complex, would need to parse markdown) - skipping for now for simplicity
      const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', postId);
      if (deleteError) {
        setError("Failed to delete post: " + deleteError.message);
      } else {
        await loadPosts();
      }
      setIsLoading(false);
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    setIsLoading(true);
    setError(null);
    const { id, user_id, ...dataToSave } = postData;

    let response;
    if (isCreating || !editingPost?.id) {
      response = await supabase.from('blog_posts').insert(dataToSave).select();
    } else {
      response = await supabase.from('blog_posts').update(dataToSave).eq('id', editingPost.id).select();
    }

    if (response.error) {
      setError("Failed to save post: " + response.error.message);
      setIsLoading(false);
      return;
    }

    setIsCreating(false);
    setEditingPost(null);
    await loadPosts();
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPost(null);
    setError(null);
  };

  const togglePostStatus = async (postId: string, currentStatus: boolean) => {
    setIsLoading(true);
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ published: !currentStatus, published_at: !currentStatus ? new Date().toISOString() : null })
      .eq('id', postId);

    if (updateError) {
      setError("Failed to update status: " + updateError.message);
    } else {
      await loadPosts();
    }
    setIsLoading(false);
  };

  if (isLoading && posts.length === 0 && !isCreating && !editingPost && !error) {
    return <div className="p-4 font-semibold text-black font-space">Loading blog posts...</div>; // Added font-space
  }
  if (error) {
    return <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700 font-semibold rounded-none font-space">{error}</div>; // Added font-space
  }

  if (isCreating || editingPost) {
    return <BlogEditor post={editingPost} onSave={handleSavePost} onCancel={handleCancel} />;
  }

  const filteredPosts = posts;

  return (
    <div className="space-y-6 font-space"> {/* Added font-space */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Blog Posts</h2>
          <p className="text-gray-700">Manage your blog content</p>
        </div>
        <button
          onClick={handleCreatePost}
          className={`${buttonPrimaryClass()} flex items-center space-x-2`}
        >
          <span className="text-xl leading-none">+</span>
          <span>Create New Post</span>
        </button>
      </div>

      <div className="bg-white rounded-none border-2 border-black p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClass}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft")}
            className={selectClass}
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {isLoading && <p className="font-semibold text-black">Fetching posts...</p>}
      {!isLoading && filteredPosts.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-none border-2 border-black">
          <div className="text-gray-500 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-black mb-2">
                No posts found
            </h3>
            <p className="text-gray-600">Try adjusting your filters or create a new post.</p>
         </div>
      ) : (
        <div className="bg-white border-2 border-black rounded-none overflow-hidden">
          <div className="divide-y-2 divide-black">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{duration: 0.2}}
                  className="p-4 md:p-6 hover:bg-yellow-50"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="flex-1 min-w-0 mb-4 md:mb-0 md:mr-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-black truncate">{post.title}</h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-none text-xs font-bold border-2 border-black font-space ${ // Added font-space
                            post.published ? "bg-green-300 text-black" : "bg-yellow-300 text-black"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{post.excerpt || "No excerpt."}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        {post.created_at && <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>}
                        {post.updated_at && post.updated_at !== post.created_at && (
                          <span>Updated: {new Date(post.updated_at).toLocaleDateString()}</span>
                        )}
                        <span>Slug: /{post.slug}</span>
                        <span>Views: {post.views || 0}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-none text-xs bg-gray-200 text-black border border-black font-space" // Added font-space
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => togglePostStatus(post.id, post.published || false)}
                        disabled={isLoading}
                        className={buttonActionClass(
                            post.published ? "bg-yellow-400" : "bg-green-400",
                            post.published ? "bg-yellow-500" : "bg-green-500",
                        )}
                      >
                        {isLoading ? "..." : (post.published ? "Unpublish" : "Publish")}
                      </button>
                      <button
                        onClick={() => handleEditPost(post)}
                        disabled={isLoading}
                        className={buttonActionClass("bg-blue-400", "bg-blue-500")}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isLoading}
                        className={buttonActionClass("bg-red-400", "bg-red-500", "text-white")}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}