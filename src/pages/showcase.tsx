import { supabase } from '@/supabase/client';
import type { PortfolioSection } from '@/types';
import Head from 'next/head';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/layout'; // Import Layout


// Neo-Brutalist Markdown Components for portfolio item descriptions
const portfolioItemMarkdownComponents = {
  p: ({ node, ...props }: any) => <p className="text-sm text-gray-700 leading-relaxed mb-2 font-space" {...props} />, // Added font-space
  strong: ({ node, ...props }: any) => <strong className="font-bold text-black font-space" {...props} />, // Added font-space
  em: ({ node, ...props }: any) => <em className="italic text-gray-600 font-space" {...props} />, // Added font-space
  a: ({ node, ...props }: any) => <a className="text-indigo-700 hover:text-indigo-900 font-bold underline hover:bg-yellow-200 font-space" target="_blank" rel="noopener noreferrer" {...props} />, // Added font-space
  ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-1 my-2 text-sm font-space" {...props} />, // Added font-space
  ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside space-y-1 my-2 text-sm font-space" {...props} />, // Added font-space
  li: ({ node, ...props }: any) => <li className="text-gray-700 font-space" {...props} />, // Added font-space
  // Add other elements as needed, keep them simple and functional
};


export default function HomePage() {
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const AUTHOR_NAME = "Your Name"; // Customize
  const PAGE_TITLE = "My Work Showcase"; // Customize
  const PAGE_DESCRIPTION = "Projects, Experiments, Digital Things.";

  const generatePortfolioJsonLd = (portfolioSections: PortfolioSection[]) => {
    const itemListElements = portfolioSections.flatMap(section =>
      section.portfolio_items?.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1, // This position is relative to the section, could be made global
        "item": {
          "@type": "CreativeWork", // or more specific like "SoftwareApplication", "WebSite"
          "name": item.title,
          "description": item.subtitle || item.description?.substring(0, 100) || item.title,
          ...(item.image_url && { "image": item.image_url }),
          ...(item.link_url && { "url": item.link_url }),
          "author": {
            "@type": "Person",
            "name": AUTHOR_NAME
          }
        }
      })) || []
    ).filter(Boolean);


    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage", // Or ItemList if that's more fitting
      "name": PAGE_TITLE,
      "description": PAGE_DESCRIPTION,
      "url": `${SITE_URL}/showcase/`,
      "author": {
        "@type": "Person",
        "name": AUTHOR_NAME
      },
      ...(itemListElements.length > 0 && {
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": itemListElements
        }
      }),
    };
    return JSON.stringify(jsonLd);
  };

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true); setError(null);
      const { data, error: fetchError } = await supabase
        .from('portfolio_sections')
        .select(`*, portfolio_items (*)`)
        .order('display_order', { ascending: true })
        .order('display_order', { foreignTable: 'portfolio_items', ascending: true });

      if (fetchError) {
        console.error("Error fetching portfolio sections:", fetchError);
        setError(fetchError.message); setSections([]);
      } else {
        setSections(data || []);
      }
      setLoading(false);
    };
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-space"> {/* Added font-space */}
          <div className="p-6 bg-white border-2 border-black font-bold text-lg">Loading Portfolio...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout> {/* Added Layout */}
        <div className="min-h-screen flex items-center justify-center bg-red-100 p-4 font-space"> {/* Added font-space */}
          <div className="p-6 bg-white border-2 border-red-500 text-red-700 font-semibold rounded-none">
            Error loading portfolio: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout> {/* Added Layout */}
      <div className="bg-gray-100 min-h-screen font-space"> {/* Added font-space */}
        <Head>
          <title>My Portfolio | Neo-Brutal</title>
          <meta name="description" content={PAGE_DESCRIPTION} />
          {/* OG and Twitter Tags for Portfolio Page */}
          <meta property="og:title" content={PAGE_TITLE} />
          <meta property="og:description" content={PAGE_DESCRIPTION} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${SITE_URL}/showcase/`} />
          {/* Consider a default OG image for the portfolio page itself */}
          {/* <meta property="og:image" content={`${SITE_URL}/default-portfolio-og-image.png`} /> */}
          <meta name="twitter:card" content="summary_large_image" />
          {/* JSON-LD Script */}
          {!loading && sections.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: generatePortfolioJsonLd(sections) }}
            />
          )}
          <link rel="canonical" href={`${SITE_URL}/showcase/`} />
        </Head>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center border-b-4 border-black pb-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-black mb-3">MY WORK</h1>
            <p className="text-xl text-gray-700 font-semibold">Projects. Experiments. Digital Things.</p>
          </motion.header>

          {sections.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-center py-16 bg-yellow-100 border-2 border-black shadow-[6px_6px_0_#000] p-8"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-black text-yellow-300 text-5xl font-black flex items-center justify-center border-2 border-black">
                  !
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">CONTENT TBD.</h3>
                <p className="text-gray-700 font-medium">The portfolio is currently under construction. Check back later!</p>
              </div>
            </motion.div>
          )}

          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * index, duration: 0.4 }}
              className="mb-12 p-6 bg-white border-2 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,0.8)]"
            >
              <h2 className="text-3xl font-black mb-6 text-black border-b-2 border-black pb-3">{section.title.toUpperCase()}</h2>
              {section.type === 'markdown' && section.content && (
                <div className="text-gray-800 text-base leading-relaxed font-space"> {/* Added font-space */}
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={portfolioItemMarkdownComponents}>{section.content}</ReactMarkdown>
                </div>
              )}
              {section.type === 'list_items' && section.portfolio_items && section.portfolio_items.length > 0 && (
                <ul className="space-y-8">
                  {section.portfolio_items.map(item => (
                    <li key={item.id} className="p-4 sm:p-6 border-2 border-black rounded-none bg-gray-50 shadow-[5px_5px_0_#000] hover:shadow-[6px_6px_0_#4f46e5] transition-shadow duration-150">
                      <h3 className="text-xl sm:text-2xl font-bold text-black mb-1">{item.title}</h3>
                      {item.subtitle && <p className="text-md text-indigo-700 font-semibold mb-3">{item.subtitle}</p>}
                      {item.image_url && <img src={item.image_url} alt={item.title} className="my-4 max-h-72 w-full object-contain rounded-none border-2 border-black" loading="lazy" />}
                      {item.description && (
                        <div className="my-3 font-space"> {/* Added font-space */}
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={portfolioItemMarkdownComponents}>{item.description}</ReactMarkdown>
                        </div>
                      )}
                      {item.link_url &&
                        <a href={item.link_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-bold text-white bg-black border-2 border-black px-4 py-2 rounded-none shadow-[3px_3px_0_#4A5568] hover:bg-indigo-700 hover:shadow-[3px_3px_0_#2C3E50] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#2C3E50] transition-all group mt-3 font-space" // Added font-space
                        >
                          View Project
                          <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map(tag => <span key={tag} className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-none border border-black font-semibold font-space">{tag}</span>)} {/* Added font-space */}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </main>
      </div>
    </Layout>
  );
}