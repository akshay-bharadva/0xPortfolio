import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import type { BlogPost } from "@/types";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// You can choose any style from react-syntax-highlighter/dist/esm/styles/prism
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { config as appConfig } from "@/lib/config"; // Import app config
import { formatDate } from "@/lib/utils"; // Import utility functions

// Neo-Brutalist Markdown Components
const markdownComponents: any = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="my-4 overflow-hidden rounded-none border-2 border-black font-space shadow-[4px_4px_0_#000]">
        <div className="flex items-center justify-between border-b-2 border-black bg-black px-3 py-1.5 font-mono text-xs text-gray-300">
          <span>{match[1].toUpperCase()}</span>
          <button
            onClick={() => navigator.clipboard.writeText(String(children))}
            className="rounded-none border border-gray-600 bg-gray-700 px-2 py-0.5 text-xs text-gray-300 hover:bg-gray-600"
            aria-label="Copy code to clipboard"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={materialDark} // Or your chosen theme
          language={match[1]}
          PreTag="pre"
          className="!m-0 overflow-x-auto !rounded-none !bg-gray-800 !p-4 font-mono text-sm"
          showLineNumbers // Optional: show line numbers
          wrapLines // Optional: wrap long lines
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className={`${className || ""} rounded-none border border-black bg-yellow-200 px-1 py-0.5 font-mono text-sm text-black`}
        {...props}
      >
        {children}
      </code>
    );
  },
  img: ({ node, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img // Using standard img for external URLs in markdown, Next/Image for local
      {...props}
      loading="lazy"
      className="my-6 h-auto max-h-[70vh] w-full rounded-none border-2 border-black object-contain shadow-[4px_4px_0_#000]" // Added object-contain and max-h
      alt={props.alt || "Blog image"}
    />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="my-6 rounded-none border-l-4 border-black bg-gray-100 px-4 py-3 font-space italic text-black"
      {...props}
    />
  ),
  h1: (
    { node, ...props }: any, // Usually only one H1 per page (the post title)
  ) => (
    <h2
      className="mb-5 mt-10 font-space text-4xl font-black text-black"
      {...props}
    /> // Changed to h2 for markdown content
  ),
  h2: ({ node, ...props }: any) => (
    <h3
      className="mb-4 mt-8 border-b-2 border-black pb-1 font-space text-3xl font-bold text-black"
      {...props}
    /> // Downgraded heading levels
  ),
  h3: ({ node, ...props }: any) => (
    <h4
      className="mb-3 mt-6 font-space text-2xl font-bold text-black"
      {...props}
    /> // Downgraded
  ),
  p: ({ node, ...props }: any) => (
    <p
      className="mb-4 font-space text-base leading-relaxed text-gray-800"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul
      className="mb-4 list-inside list-disc space-y-1 pl-2 font-space text-gray-800"
      {...props}
    />
  ),
  ol: ({ node, ...props }: any) => (
    <ol
      className="mb-4 list-inside list-decimal space-y-1 pl-2 font-space text-gray-800"
      {...props}
    />
  ),
  li: ({ node, ...props }: any) => (
    <li className="mb-1 font-space leading-relaxed" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a
      className="font-space font-bold text-indigo-700 underline transition-colors hover:bg-yellow-200 hover:text-indigo-900"
      target="_blank" // Assume external links, internal should use <Link>
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: ({ node, ...props }: any) => (
    <div className="my-6 overflow-x-auto rounded-none border-2 border-black font-space shadow-[4px_4px_0_#000]">
      <table className="min-w-full border-collapse bg-white" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th
      className="border border-gray-500 bg-black px-3 py-2 text-left font-space font-bold text-white"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td className="border border-gray-400 px-3 py-2 font-space" {...props} />
  ),
  hr: ({ node, ...props }: any) => (
    <hr className="my-8 border-t-2 border-black" {...props} />
  ),
};

const PostHeader = ({ post }: { post: BlogPost }) => (
  <header className="mb-8 font-space">
    {post.cover_image_url && (
      <div className="relative -mx-0 mb-8">
        {" "}
        {/* Adjust mx if container has padding */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="h-64 w-full rounded-none border-2 border-black object-cover shadow-[6px_6px_0_#000] md:h-80"
        />
      </div>
    )}
    <div className="space-y-3">
      <h1 className="text-4xl font-black leading-tight text-black md:text-5xl">
        {post.title}
      </h1>
      <div className="flex flex-col gap-x-6 gap-y-2 text-sm font-semibold text-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {" "}
          {/* Added flex-wrap */}
          <time
            dateTime={post.published_at || post.created_at || ""}
            className="flex items-center gap-1"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(post.published_at || post.created_at || new Date())}
          </time>
          {typeof post.views === "number" && ( // Only show views if available
            <span className="flex items-center gap-1">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.views} views
            </span>
          )}
        </div>
      </div>
      {post.excerpt && (
        <p className="mt-3 max-w-2xl border-l-2 border-black pl-3 text-base italic leading-relaxed text-gray-700">
          {post.excerpt}
        </p>
      )}
    </div>
  </header>
);

const PostContent = ({ content }: { content: string }) => (
  <div className="prose prose-nb max-w-none font-space text-black">
    {" "}
    {/* Added prose-nb for custom prose styles */}
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]} // Use with caution. Ensure content is trusted.
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  </div>
);

const PostTags = ({ tags }: { tags: string[] }) => (
  <footer className="mt-12 border-t-2 border-black pt-6 font-space">
    <h3 className="mb-3 text-xl font-bold text-black">Tags</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`} // Link to a potential tag page
          key={tag}
          className="inline-flex items-center rounded-none border-2 border-black bg-yellow-300 px-3 py-1 text-sm font-bold text-black shadow-[2px_2px_0_#000] transition-all hover:bg-yellow-400 hover:shadow-[2px_2px_0_#4f46e5]"
        >
          #{tag}
        </Link>
      ))}
    </div>
  </footer>
);

const NotFoundDisplay = () => (
  // Renamed from NotFoundPage to avoid conflict
  <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-yellow-100 p-4 font-space">
    <Head>
      <title>Post Not Found | Blog</title>
      <meta name="robots" content="noindex" />{" "}
      {/* Discourage indexing of 404 pages */}
    </Head>
    <div className="rounded-none border-2 border-black bg-white p-8 text-center shadow-[8px_8px_0_#000] sm:p-12">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-none border-2 border-black bg-red-500 text-4xl font-black text-white">
        !
      </div>
      <h1 className="mb-2 text-3xl font-black text-black">
        404 - Post Not Found
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        The page you seek is lost in the digital ether.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center rounded-none border-2 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_#333] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-800 hover:shadow-[2px_2px_0px_#333] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        <svg className="mr-2 size-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
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

  const { site: siteConfig } = appConfig; // Destructure site config

  useEffect(() => {
    if (slug && typeof slug === "string") {
      const fetchPostData = async () => {
        // Renamed fetchPost
        setLoading(true);
        setError(null);
        try {
          const { data, error: fetchError } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single();

          if (fetchError) {
            console.error(`Error fetching post "${slug}":`, fetchError);
            if (fetchError.code === "PGRST116") {
              // No row found
              setPost(null);
            } else {
              setError(fetchError.message);
            }
          } else {
            setPost(data);
          }
        } catch (e: any) {
          console.error("Unexpected error fetching post:", e);
          setError(e.message || "An unexpected error occurred");
        }
        setLoading(false);
      };
      fetchPostData();
    } else if (router.isReady && !slug) {
      // Handle cases where slug is missing but router is ready
      setLoading(false);
      setPost(null);
    }
  }, [slug, router.isReady]);

  useEffect(() => {
    if (post?.id && process.env.NODE_ENV === "production") {
      const incrementViewCount = async () => {
        // Renamed incrementView
        try {
          // Ensure the RPC function name matches what's defined in Supabase
          await supabase.rpc("increment_blog_post_view", {
            post_id_to_increment: post.id,
          });
        } catch (rpcError) {
          console.error(
            "Failed to increment view count for post:",
            post.id,
            rpcError,
          );
        }
      };
      // Debounce or delay view increment to avoid multiple calls on quick reloads/navigation
      const timeoutId = setTimeout(incrementViewCount, 2000); // Delay of 2 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [post?.id]); // Depend on post.id

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 font-space">
          <div className="rounded-none border-2 border-black bg-white p-6 text-lg font-bold">
            Loading Post...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-red-100 p-4 font-space">
          <div className="rounded-none border-2 border-red-500 bg-white p-6 font-semibold text-red-700">
            Error loading post: {error}.{" "}
            <Link href="/blog" className="underline hover:text-black">
              Back to blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <NotFoundDisplay />
      </Layout>
    );
  }

  const generateArticleJsonLd = (article: BlogPost) => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/blog/${article.slug}/`,
      },
      headline: article.title,
      image: article.cover_image_url
        ? [article.cover_image_url]
        : [`${siteConfig.url}/default-og-image.png`], // Fallback OG image
      datePublished: article.published_at
        ? new Date(article.published_at).toISOString()
        : new Date(article.created_at || Date.now()).toISOString(),
      dateModified: article.updated_at
        ? new Date(article.updated_at).toISOString()
        : new Date(article.created_at || Date.now()).toISOString(),
      author: {
        "@type": "Person",
        name: siteConfig.author, // Use author from config
        url: siteConfig.url, // Link to author's main page/site
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.title, // Use site title as publisher name
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/favicon-192x192.png`, // Example: link to a site logo
        },
      },
      description: article.excerpt || article.title.substring(0, 160), // Max length for description
      articleBody: article.content?.substring(0, 2500) || "", // Truncate for performance, ensure plain text or carefully stripped HTML
    };
    return JSON.stringify(jsonLd);
  };

  const postUrl = `${siteConfig.url}/blog/${post.slug}/`;
  const metaDescription = post.excerpt || post.title.substring(0, 160);

  return (
    <Layout>
      <Head>
        <title>{`${post.title} | ${siteConfig.title}`}</title>
        <meta name="description" content={metaDescription} />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        {post.cover_image_url ? (
          <>
            <meta property="og:image" content={post.cover_image_url} />
            {/* Assuming 1200x630 for cover images, adjust if different */}
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:image" content={post.cover_image_url} />
          </>
        ) : (
          <>
            <meta property="og:image" content={siteConfig.defaultOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:image" content={siteConfig.defaultOgImage} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {siteConfig.twitterHandle && (
          <meta name="twitter:site" content={siteConfig.twitterHandle} />
        )}
        {siteConfig.twitterHandle && (
          <meta name="twitter:creator" content={siteConfig.twitterHandle} />
        )}

        <meta
          property="article:published_time"
          content={
            post.published_at
              ? new Date(post.published_at).toISOString()
              : new Date(post.created_at || Date.now()).toISOString()
          }
        />
        {post.updated_at && (
          <meta
            property="article:modified_time"
            content={new Date(post.updated_at).toISOString()}
          />
        )}
        {post.tags && post.tags.length > 0 && (
          <>
            <meta property="article:tag" content={post.tags.join(", ")} />
            <meta name="keywords" content={post.tags.join(", ")} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateArticleJsonLd(post) }}
          key="article-jsonld"
        />
        <link rel="canonical" href={postUrl} />
      </Head>

      <main className="min-h-screen bg-gray-100 py-8 font-space md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-4" // Container for post content
        >
          <article className="rounded-none border-2 border-black bg-white shadow-[10px_10px_0_#000000]">
            <div className="px-6 py-8 md:px-10 md:py-12">
              <PostHeader post={post} />
              {post.content && <PostContent content={post.content} />}
              {post.tags && post.tags.length > 0 && (
                <PostTags tags={post.tags} />
              )}
            </div>
          </article>
          {/* Optional: Add related posts or comments section here */}
        </motion.div>
      </main>
    </Layout>
  );
}
