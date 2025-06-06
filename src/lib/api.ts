import type { BlogPost } from "@/types";
import { supabase } from "@/supabase/client"

const mockBlogContent = `
<h2>Introduction</h2>
<p>This is a sample blog post content. In a real application, this would be fetched from Supabase.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
<h2>Main Content</h2>
<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.</p>
<ul>
  <li>Point one about the topic</li>
  <li>Another important consideration</li>
  <li>Final thoughts on this section</li>
</ul>
<h2>Conclusion</h2>
<p>In conclusion, this is just placeholder text. In a real blog, you would have actual content here that provides value to your readers.</p>
`;

const mockBlogPosts: BlogPost[] = [];

const getSavedPosts = (): BlogPost[] | null => {
  if (typeof window !== "undefined") {
    const savedPosts = localStorage.getItem("blog_posts");
    if (savedPosts) {
      try {
        return JSON.parse(savedPosts) as BlogPost[];
      } catch (error) {
        console.error("Error parsing saved posts:", error);
      }
    }
  }
  return null;
};

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const savedPosts = getSavedPosts();
  if (savedPosts) {
    return savedPosts;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*");

    if (error || !data) {
      throw new Error(error?.message || "Failed to fetch posts from Supabase");
    }

    return data as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return mockBlogPosts; // Fallback
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const savedPosts = getSavedPosts();
  let posts = mockBlogPosts;

  if (savedPosts) {
    posts = savedPosts;
  }

  // Try to find it from saved or mock
  let post = posts.find((post) => post.slug === slug);

  if (post) {
    return post;
  }

  // Fallback to Supabase fetch
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Post not found");
    }

    return data as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    throw new Error("Post not found");
  }
}