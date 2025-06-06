import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { BlogPost } from '@/types';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Be cautious with rehypeRaw if content is not fully trusted
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout'; // Import Layout

// Neo-Brutalist Markdown Components
const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="my-4 border-2 border-black rounded-none shadow-[4px_4px_0_#000] font-space"> {/* Ensure code block container uses font-space if desired, though font-mono usually overrides for code content */}
        <div className="bg-black text-gray-300 px-3 py-1 text-xs font-mono border-b-2 border-black"> {/* font-mono for language indicator */}
          {match[1]}
        </div>
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="pre"
          className="!p-4 !m-0 !bg-gray-800 !rounded-none overflow-x-auto font-mono" // font-mono for code content
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={`${className} bg-yellow-200 text-black px-1 py-0.5 border border-black font-mono text-sm`} {...props}> {/* font-mono for inline code */}
        {children}
      </code>
    );
  },
  img: ({ node, ...props }: any) => (
    <img
      {...props}
      loading="lazy"
      className="my-6 rounded-none border-2 border-black shadow-[4px_4px_0_#000] w-full h-auto"
      alt={props.alt || 'Blog image'}
    />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-black bg-gray-100 pl-4 pr-4 py-3 my-6 italic text-black rounded-none font-space" // Added font-space
      {...props}
    />
  ),
  h1: ({ node, ...props }: any) => (
    <h1 className="text-4xl font-black mt-10 mb-5 text-black font-space" {...props} /> // Added font-space
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-3xl font-bold mt-8 mb-4 text-black border-b-2 border-black pb-1 font-space" {...props} /> // Added font-space
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-2xl font-bold mt-6 mb-3 text-black font-space" {...props} /> // Added font-space
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-4 leading-relaxed text-gray-800 text-base font-space" {...props} /> // Added font-space
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside pl-2 mb-4 space-y-1 text-gray-800 font-space" {...props} /> // Added font-space
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside pl-2 mb-4 space-y-1 text-gray-800 font-space" {...props} /> // Added font-space
  ),
  li: ({ node, ...props }: any) => (
    <li className="mb-1 font-space" {...props} /> // Added font-space
  ),
  a: ({ node, ...props }: any) => (
    <a
      className="text-indigo-700 hover:text-indigo-900 font-bold underline hover:bg-yellow-200 transition-colors font-space" // Added font-space
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-6 border-2 border-black rounded-none shadow-[4px_4px_0_#000] font-space"> {/* Added font-space */}
      <table className="min-w-full border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th className="bg-black text-white border border-gray-500 px-3 py-2 text-left font-bold font-space" {...props} /> // Added font-space
  ),
  td: ({ node, ...props }: any) => (
    <td className="border border-gray-400 px-3 py-2 bg-white font-space" {...props} /> // Added font-space
  ),
  hr: ({ node, ...props }: any) => (
    <hr className="my-8 border-t-2 border-black" {...props} />
  )
};

const PostHeader = ({ post }: { post: BlogPost }) => (
  <header className="mb-8 font-space"> {/* Added font-space */}
    {post.cover_image_url && (
      <div className="relative mb-8 -mx-0">
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-64 md:h-80 object-cover rounded-none border-2 border-black shadow-[6px_6px_0_#000]"
        />
      </div>
    )}
    <div className="space-y-3">
      <h1 className="text-4xl md:text-5xl font-black text-black leading-tight">
        {post.title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-2 text-sm text-gray-700 font-semibold">
        <div className="flex items-center gap-4">
          <time dateTime={post.published_at || ""} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
          </time>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {post.views || 0} views
          </span>
        </div>
        {post.excerpt && (
          <p className="text-gray-700 italic text-base leading-relaxed max-w-md">
            {post.excerpt}
          </p>
        )}
      </div>
    </div>
  </header>
);


const PostContent = ({ content }: { content: string }) => (
  <div className="text-black font-space"> {/* Added font-space, ReactMarkdown components will also apply it */}
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  </div>
);

const PostTags = ({ tags }: { tags: string[] }) => (
  <footer className="mt-12 pt-6 border-t-2 border-black font-space"> {/* Added font-space */}
    <h3 className="text-xl font-bold mb-3 text-black">Tags</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-3 py-1 rounded-none text-sm font-bold bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0_#000] font-space" // Added font-space
        >
          #{tag}
        </span>
      ))}
    </div>
  </footer>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4 font-space"> {/* Added font-space */}
    <Head>
      <title>Post Not Found | Blog</title>
    </Head>
    <div className="text-center p-8 sm:p-12 bg-white border-2 border-black shadow-[8px_8px_0_#000]">
      <div className="w-20 h-20 mx-auto mb-6 bg-red-500 border-2 border-black flex items-center justify-center text-white text-4xl font-black">
        !
      </div>
      <h1 className="text-3xl font-black text-black mb-2">404 - Post Not Found</h1>
      <p className="text-gray-700 mb-8 text-lg">The page you seek is lost in the digital ether.</p>
      <Link
        href="/blog"
        className="inline-flex items-center px-6 py-3 bg-black text-white rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#333] hover:bg-gray-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-space" // Added font-space
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
        Back to Blog
      </Link>
    </div>
  </div>
);


export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const AUTHOR_NAME = "Your Name"; // Customize
  const PUBLISHER_NAME = "Your Site Name"; // Customize
  const PUBLISHER_LOGO_URL = `${SITE_URL}/path/to/your/logo.png`; // Customize, e.g., favicon or a proper logo

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const fetchPost = async () => {
        setLoading(true); setError(null);
        try {
          const { data, error: fetchError } = await supabase
            .from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();

          if (fetchError) {
            console.error(`Error fetching post ${slug}:`, fetchError);
            if (fetchError.code === 'PGRST116') setPost(null);
            else setError(fetchError.message);
          } else if (!data) setPost(null);
          else setPost(data);
        } catch (e: any) {
          console.error("Unexpected error fetching post:", e);
          setError(e.message || "An unexpected error occurred");
        }
        setLoading(false);
      };
      fetchPost();
    } else if (router.isReady && !slug) {
      setLoading(false); setPost(null);
    }
  }, [slug, router.isReady]);

  useEffect(() => {
    if (post?.id && process.env.NODE_ENV === 'production') {
      const incrementView = async () => {
        try {
          await supabase.rpc('increment_blog_post_view', { post_id_to_increment: post.id });
        } catch (rpcError) { console.error('Failed to increment view count:', rpcError); }
      };
      const timeoutId = setTimeout(incrementView, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [post?.id]);

  if (loading) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-space"> {/* Added font-space */}
          <div className="p-6 bg-white border-2 border-black font-bold text-lg">Loading Post...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-red-100 p-4 font-space"> {/* Added font-space */}
          <div className="p-6 bg-white border-2 border-red-500 text-red-700 font-semibold rounded-none">
            Error loading post: {error}. <Link href="/blog" className="underline hover:text-black">Back to blog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout> {/* Added Layout */}
        <NotFoundPage />
      </Layout>
    );
  }

  const generateArticleJsonLd = (article: BlogPost) => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${article.slug}/`
      },
      "headline": article.title,
      "image": article.cover_image_url ? [article.cover_image_url] : [],
      "datePublished": article.published_at ? new Date(article.published_at).toISOString() : new Date(article.created_at || Date.now()).toISOString(),
      "dateModified": article.updated_at ? new Date(article.updated_at).toISOString() : new Date(article.created_at || Date.now()).toISOString(),
      "author": {
        "@type": "Person", // Or "Organization" if applicable
        "name": AUTHOR_NAME
      },
      "publisher": {
        "@type": "Organization",
        "name": PUBLISHER_NAME,
        "logo": {
          "@type": "ImageObject",
          "url": PUBLISHER_LOGO_URL
        }
      },
      "description": article.excerpt || article.title,
      // Potentially add "articleBody": article.content (if plain text or stripped HTML)
    };
    return JSON.stringify(jsonLd);
  };

  return (
    <Layout>
      <Head>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        {/* OG and Twitter Tags - Review and Enhance */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title.substring(0, 150)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/${post.slug}/`} />
        {post.cover_image_url && (
          <>
            <meta property="og:image" content={post.cover_image_url} />
            <meta property="og:image:width" content="1200" /> {/* Adjust if known */}
            <meta property="og:image:height" content="630" /> {/* Adjust if known */}
            <meta name="twitter:image" content={post.cover_image_url} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@yourTwitterHandle" /> */} {/* Add if you have one */}
        {/* <meta name="twitter:creator" content="@yourTwitterHandle" /> */} {/* Add if you have one */}

        <meta property="article:published_time" content={post.published_at || new Date(post.created_at || Date.now()).toISOString()} />
        {post.updated_at && (
          <meta property="article:modified_time" content={new Date(post.updated_at).toISOString()} />
        )}
        {post.tags && post.tags.length > 0 && (
          <meta property="article:tag" content={post.tags.join(', ')} />
        )}
        {post.tags && (<meta name="keywords" content={post.tags.join(', ')} />)}
        {/* JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateArticleJsonLd(post) }}
        />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.slug}/`} />
      </Head>

      <main className="min-h-screen bg-gray-100 py-8 md:py-12 font-space">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-4"
        >
          <article className="bg-white rounded-none border-2 border-black shadow-[10px_10px_0_#000000]">
            <div className="px-6 py-8 md:px-10 md:py-12">
              <PostHeader post={post} />
              {post.content && <PostContent content={post.content} />}
              {post.tags && post.tags.length > 0 && (
                <PostTags tags={post.tags} />
              )}
            </div>
          </article>
        </motion.div>
      </main>
    </Layout>
  );
}