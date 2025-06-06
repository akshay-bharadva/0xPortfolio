// src/pages/sitemap.xml.ts
import { supabase } from '@/supabase/client';
import type { BlogPost, PortfolioSection } from '@/types';
import type { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const generateSitemapXml = (
  posts: Pick<BlogPost, 'slug' | 'updated_at' | 'created_at'>[], // Added created_at as fallback
  portfolioSections: Pick<PortfolioSection, 'id' | 'updated_at' | 'created_at'>[] // Added created_at
): string => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Home page
  xml += `
    <url>
      <loc>${SITE_URL}/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`;
  // About page
  xml += `
    <url>
      <loc>${SITE_URL}/about/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
  // Blog index page
  xml += `
    <url>
      <loc>${SITE_URL}/blog/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`;
  // Main portfolio page (showcase)
  xml += `
    <url>
      <loc>${SITE_URL}/showcase</loc> 
      <lastmod>${
        portfolioSections[0]?.updated_at
          ? new Date(portfolioSections[0].updated_at).toISOString().split('T')[0]
          : portfolioSections[0]?.created_at 
            ? new Date(portfolioSections[0].created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
      }</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>`;
  // Projects page
  xml += `
    <url>
      <loc>${SITE_URL}/projects/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;

  posts.forEach(post => {
    const lastMod = post.updated_at || post.created_at || Date.now();
    xml += `
      <url>
        <loc>${SITE_URL}/blog/${post.slug}/</loc>
        <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>`;
  });

  xml += `</urlset>`;
  return xml;
};

// This component is necessary for Next.js to treat this as a page,
// but it won't render anything itself.
const SitemapPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at') // Include created_at
      .eq('published', true);

    if (postsError) {
      console.error("Sitemap: Error fetching posts:", postsError.message);
      throw postsError;
    }

    const { data: portfolioSectionsData, error: portfolioError } = await supabase
      .from('portfolio_sections')
      .select('id, updated_at, created_at') // Include created_at
      .order('updated_at', { ascending: false, nullsFirst: false }) // Handle nulls
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(1);
    
    if (portfolioError) {
      console.error("Sitemap: Error fetching portfolio sections:", portfolioError.message);
      throw portfolioError;
    }

    const sitemap = generateSitemapXml(postsData || [], portfolioSectionsData || []);

    res.setHeader('Content-Type', 'application/xml');
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error: any) {
    console.error("Error generating sitemap in getServerSideProps:", error.message);
    // Return a minimal valid sitemap to prevent build failure
    res.setHeader('Content-Type', 'application/xml');
    res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    res.end();
    return { props: {} }; // Indicate success to Next.js for build purposes
  }
};

export default SitemapPage;