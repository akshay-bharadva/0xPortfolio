import type { BlogPost, PortfolioSection } from "@/types"; // Added PortfolioSection
import { supabase } from "@/supabase/client";

// --- BLOG POSTS ---

// Mock data is not used if Supabase is primary source.
// const mockBlogContent = `...`;
// const mockBlogPosts: BlogPost[] = [];

// LocalStorage caching for blog posts - consider if this is still desired with Supabase.
// It can lead to stale data if not managed carefully.
// For a dynamic site with an admin panel, fetching fresh from Supabase is often preferred.
const getSavedPostsFromLocalStorage = (): BlogPost[] | null => {
  if (typeof window !== "undefined") {
    const savedPosts = localStorage.getItem("blog_posts_cache"); // Use a distinct key
    if (savedPosts) {
      try {
        // TODO: Add validation for the parsed data structure and potentially a TTL for cache
        return JSON.parse(savedPosts) as BlogPost[];
      } catch (error) {
        console.error("Error parsing saved posts from localStorage:", error);
        localStorage.removeItem("blog_posts_cache"); // Clear corrupted cache
      }
    }
  }
  return null;
};

const savePostsToLocalStorage = (posts: BlogPost[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("blog_posts_cache", JSON.stringify(posts));
    } catch (error) {
      console.error("Error saving posts to localStorage:", error);
    }
  }
};

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  // const cachedPosts = getSavedPostsFromLocalStorage();
  // if (cachedPosts) return cachedPosts; // Consider cache strategy (e.g., stale-while-revalidate)

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true) // Fetch only published posts for public site
      .order("published_at", { ascending: false }); // Order by published date

    if (error) {
      throw new Error(error.message || "Failed to fetch posts from Supabase");
    }
    // savePostsToLocalStorage(data || []); // Cache fresh data
    return data || [];
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return []; // Return empty array on error to prevent site break
  }
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  // Return null if not found
  // const cachedPosts = getSavedPostsFromLocalStorage();
  // const cachedPost = cachedPosts?.find(post => post.slug === slug && post.published);
  // if (cachedPost) return cachedPost;

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true) // Ensure only published post is fetched by slug publicly
      .single(); // Expect a single result or null

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine
      throw new Error(error.message || "Post not found or error fetching");
    }
    return data || null; // data will be null if no row found (PGRST116)
  } catch (error) {
    console.error(`Error fetching blog post by slug "${slug}":`, error);
    return null; // Return null on error
  }
}

// --- PORTFOLIO CONTENT ---

export async function fetchPortfolioSectionsWithItems(): Promise<
  PortfolioSection[]
> {
  try {
    const { data, error } = await supabase
      .from("portfolio_sections")
      .select(
        `
                *,
                portfolio_items (
                    *
                )
            `,
      )
      .order("display_order", { ascending: true })
      .order("display_order", {
        foreignTable: "portfolio_items",
        ascending: true,
      });

    if (error) {
      throw new Error(
        error.message || "Failed to fetch portfolio sections from Supabase",
      );
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching portfolio sections with items:", error);
    return [];
  }
}

// --- GITHUB PROJECTS --- (Example, if you fetch GitHub repos on server-side for public display)
// This is usually done client-side as shown in projects.tsx, or server-side with getStaticProps/getServerSideProps.

// export async function fetchGitHubProjects(username: string, perPage: number = 6): Promise<any[]> {
//   const GITHUB_REPOS_URL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&type=owner`;
//   try {
//     const response = await fetch(GITHUB_REPOS_URL);
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ message: response.statusText }));
//       throw new Error(`GitHub API request failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
//     }
//     const data = await response.json();
//     const filteredProjects = data
//       .filter((p: any) => !p.private && p.language && !p.fork && !p.archived && p.name !== username)
//       .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0) || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
//     return filteredProjects.slice(0, perPage);
//   } catch (error) {
//     console.error("Failed to fetch GitHub projects:", error);
//     return [];
//   }
// }
