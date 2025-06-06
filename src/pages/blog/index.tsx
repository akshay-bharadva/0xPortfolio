import Link from 'next/link';
import { supabase } from '@/supabase/client';
import type { BlogPost } from '@/types';
import Head from 'next/head';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react'
import Layout from '@/components/layout'; // Import Layout

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); setError(null);
      const { data, error: fetchError } = await supabase
        .from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching blog posts:", fetchError);
        setError(fetchError.message); setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-space"> {/* Added font-space */}
            <div className="p-6 bg-white border-2 border-black font-bold text-lg">Loading Blog...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-red-100 p-4 font-space">  {/* Added font-space */}
            <div className="p-6 bg-white border-2 border-red-500 text-red-700 font-semibold rounded-none">
                Error loading posts: {error}
            </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout> {/* Added Layout */}
      <div className="bg-gray-100 min-h-screen font-space"> {/* Added font-space */}
        <Head>
          <title>My Blog | Neo-Brutalist Edition</title>
          <meta name="description" content="Thoughts, articles, and ramblings." />
        </Head>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center border-b-4 border-black pb-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-black mb-3">
              THE BLOG
            </h1>
            <p className="text-xl text-gray-700 font-semibold">
              Raw thoughts. Sharp takes. No frills.
            </p>
          </motion.header>

          {posts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-center py-16 bg-yellow-100 border-2 border-black shadow-[6px_6px_0_#000] p-8"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-black text-yellow-300 text-5xl font-black flex items-center justify-center border-2 border-black">
                  ?
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">NO POSTS HERE. YET.</h3>
                <p className="text-gray-700 font-medium">The digital ink is still drying. Or maybe I'm just lazy.</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.section
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="block bg-white border-2 border-black rounded-none shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#4f46e5] active:shadow-[2px_2px_0px_#4f46e5] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all duration-150 overflow-hidden">
                    {post.cover_image_url && (
                      <div className="relative h-48 w-full overflow-hidden border-b-2 border-black">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2 text-black group-hover:text-indigo-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed font-medium">
                        {post.excerpt || "Click to read more..."}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-600 font-semibold">
                        <time dateTime={post.published_at || ""}>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'Draft'}
                        </time>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          {post.views || 0} views
                        </span>
                      </div>
                       {post.tags && post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                              {post.tags.slice(0,3).map(tag => ( // Show a few tags
                                  <span key={tag} className="text-xs bg-yellow-200 text-black px-2 py-0.5 border border-black rounded-none font-semibold font-space">{tag}</span> // Added font-space
                              ))}
                          </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.section>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}