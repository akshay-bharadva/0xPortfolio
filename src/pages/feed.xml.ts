// src/pages/feed.xml.ts
import { supabase } from '@/supabase/client';
import type { BlogPost } from '@/types';
import type { GetServerSideProps } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_TITLE = 'My Neo-Brutalist Blog'; // Customize
const SITE_DESCRIPTION = 'Thoughts, articles, and ramblings.'; // Customize
const AUTHOR_EMAIL = 'akshaybharadva19@gmail.com'; // Customize!
const AUTHOR_NAME = 'Akshay Bharadva'; // Customize!

const htmlToText = (html?: string | null): string => {
    if (!html) return '';
    // A more robust regex might be needed for complex HTML, but this is a basic approach
    return html.replace(/<[^>]+>/g, ' ').replace(/\s\s+/g, ' ').trim();
};

const generateRssXml = (posts: BlogPost[]): string => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<rss version="2.0" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  >`;
  xml += `<channel>`;
  xml += `<title><![CDATA[${SITE_TITLE}]]></title>`;
  xml += `<link>${SITE_URL}/blog/</link>`;
  xml += `<description><![CDATA[${SITE_DESCRIPTION}]]></description>`;
  xml += `<language>en-us</language>`; // Adjust if needed
  const lastBuildDate = posts.length > 0 && posts[0]?.published_at 
                        ? new Date(posts[0].published_at).toUTCString() 
                        : new Date().toUTCString();
  xml += `<lastBuildDate>${lastBuildDate}</lastBuildDate>`;
  xml += `<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`;
  xml += `<sy:updatePeriod>hourly</sy:updatePeriod>`; // How often feed might be updated
  xml += `<sy:updateFrequency>1</sy:updateFrequency>`;
  // Optional: xml += `<image><url>${SITE_URL}/your-rss-logo.png</url><title>${SITE_TITLE}</title><link>${SITE_URL}/blog/</link></image>`;

  posts.forEach(post => {
    const postUrl = `${SITE_URL}/blog/${post.slug}/`;
    // Use excerpt for description, fall back to a snippet of content if excerpt is missing
    const description = post.excerpt || htmlToText(post.content?.substring(0, 250)) + (post.content && post.content.length > 250 ? '...' : '');
    const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : (post.created_at ? new Date(post.created_at).toUTCString() : new Date().toUTCString());

    xml += `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${postUrl}</link>
        <guid isPermaLink="true">${postUrl}</guid>
        <pubDate>${pubDate}</pubDate>
        <dc:creator><![CDATA[${AUTHOR_NAME}]]></dc:creator>`;
    if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
            xml += `<category><![CDATA[${tag}]]></category>`;
        });
    }
    xml += `
        <description><![CDATA[${description}]]></description>`;
    if (post.content) { // Ensure content is properly CATA wrapped
       xml += `<content:encoded><![CDATA[${post.content}]]></content:encoded>`;
    }
    xml += `
      </item>`;
  });

  xml += `</channel></rss>`;
  return xml;
};

const FeedPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('*') // Select all fields needed for RSS
      .eq('published', true)
      .order('published_at', { ascending: false }) // Ensure published_at is primary sort
      .order('created_at', { ascending: false }) // Fallback sort
      .limit(20); // Limit number of posts in feed

    if (postsError) {
        console.error("RSS: Error fetching posts:", postsError.message);
        throw postsError;
    }
    
    const rssFeed = generateRssXml(postsData || []);

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.write(rssFeed);
    res.end();

    return { props: {} };
  } catch (error: any) {
    console.error("Error generating RSS feed in getServerSideProps:", error.message);
    // Return a minimal valid feed to prevent build failure
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.write('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error generating feed</title><link>${SITE_URL}</link><description>Could not generate RSS feed.</description></channel></rss>');
    res.end();
    return { props: {} }; // Indicate success to Next.js for build purposes
  }
};

export default FeedPage;