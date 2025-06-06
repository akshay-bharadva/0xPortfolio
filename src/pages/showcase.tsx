import Layout from "@/components/layout";
import Head from "next/head";
import { config as appConfig } from "@/lib/config";
import { fetchPortfolioSectionsWithItems } from "@/lib/api";
import type { PortfolioSection, PortfolioItem } from "@/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import ExperienceComponent from "@/components/experience"; // Re-use Experience component

// Markdown components for portfolio item descriptions (similar to blog's, but simpler)
const portfolioMarkdownComponents: any = {
  p: ({ node, ...props }: any) => (
    <p className="mb-2 text-sm leading-relaxed text-gray-700" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <Link
      className="text-indigo-600 underline hover:bg-yellow-200 hover:text-indigo-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul
      className="list-inside list-disc space-y-0.5 pl-1 text-sm text-gray-700"
      {...props}
    />
  ),
  ol: ({ node, ...props }: any) => (
    <ol
      className="list-inside list-decimal space-y-0.5 pl-1 text-sm text-gray-700"
      {...props}
    />
  ),
  li: ({ node, ...props }: any) => <li className="mb-0.5" {...props} />,
};

export default function ShowcasePage() {
  const { site: siteConfig } = appConfig;
  const pageTitle = `Showcase | ${siteConfig.title}`;
  const pageDescription = `A showcase of Akshay Bharadva's work, including projects, skills, and professional experience.`;
  const pageUrl = `${siteConfig.url}/showcase/`;

  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sectionsData = await fetchPortfolioSectionsWithItems();
        setSections(sectionsData);
      } catch (e: any) {
        setError(e.message || "Failed to load showcase content.");
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 font-space">
          <div className="rounded-none border-2 border-black bg-white p-6 text-lg font-bold">
            Loading Showcase...
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
            Error loading showcase: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
      </Head>

      <main className="py-8 font-space md:py-12">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 border-b-4 border-black pb-6 text-center"
        >
          <h1 className="mb-3 text-5xl font-black text-black md:text-6xl">
            MY SHOWCASE
          </h1>
          <p className="text-xl font-semibold text-gray-700">
            A curated collection of my work, skills, and journey.
          </p>
        </motion.header>

        {sections.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-none border-2 border-black bg-yellow-100 p-8 py-16 text-center shadow-[6px_6px_0_#000]"
          >
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-none border-2 border-black bg-black text-5xl font-black text-yellow-300">
                🚧
              </div>
              <h3 className="mb-2 text-2xl font-bold text-black">
                CONTENT UNDER CONSTRUCTION
              </h3>
              <p className="font-medium text-gray-700">
                This showcase is currently being polished. Check back soon!
              </p>
            </div>
          </motion.div>
        )}

        {sections.map((section, sectionIndex) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex, duration: 0.4 }}
            className="mb-12"
          >
            <h2 className="mb-6 border-b-2 border-black pb-2 text-3xl font-black text-black">
              {section.title}
            </h2>
            {section.type === "markdown" && section.content && (
              <div className="rounded-none border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={portfolioMarkdownComponents}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            )}
            {section.type === "list_items" &&
              section.portfolio_items &&
              section.portfolio_items.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {section.portfolio_items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_#000] transition-all duration-150 hover:shadow-[6px_6px_0px_#4f46e5]"
                    >
                      {item.image_url && (
                        <div className="relative h-48 w-full overflow-hidden border-b-2 border-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex grow flex-col p-5">
                        <h3 className="mb-1 text-xl font-bold text-black transition-colors group-hover:text-indigo-700">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="mb-2 text-sm font-semibold text-indigo-700">
                            {item.subtitle}
                          </p>
                        )}
                        {item.description && (
                          <div className="prose prose-sm mb-3 line-clamp-4 max-w-none text-sm leading-relaxed text-gray-700 prose-p:my-1 prose-ul:my-1">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                              components={portfolioMarkdownComponents}
                            >
                              {item.description}
                            </ReactMarkdown>
                          </div>
                        )}
                        <div className="mt-auto">
                          {" "}
                          {/* Push link and tags to bottom */}
                          {item.link_url && (
                            <Link
                              href={item.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="-ml-2 inline-flex items-center rounded-none border-2 border-transparent px-2 py-1 text-sm font-bold text-indigo-700 transition-all hover:border-black hover:bg-yellow-200 hover:text-indigo-900"
                            >
                              View Project <BsArrowUpRight className="ml-1.5" />
                            </Link>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-none border border-black bg-gray-200 px-2 py-0.5 text-xs font-semibold text-black"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </motion.section>
        ))}

        {/* Integrate Experience Section */}
        <ExperienceComponent />
      </main>
    </Layout>
  );
}
