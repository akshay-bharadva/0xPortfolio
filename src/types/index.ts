// --- Portfolio Content Types ---
export interface PortfolioSection {
  id: string; // UUID
  user_id?: string; // UUID, foreign key to auth.users
  title: string;
  type: "markdown" | "list_items" | "gallery"; // Add more types as needed
  content?: string | null; // For 'markdown' type
  display_order?: number;
  created_at?: string; // ISO 8601 timestamp
  updated_at?: string; // ISO 8601 timestamp
  portfolio_items?: PortfolioItem[]; // Populated for sections of type 'list_items' or 'gallery'
}

export interface PortfolioItem {
  id: string; // UUID
  section_id: string; // UUID, foreign key to portfolio_sections
  user_id?: string; // UUID, foreign key to auth.users
  title: string;
  subtitle?: string | null;
  description?: string | null; // Can be Markdown
  image_url?: string | null; // URL to an image
  link_url?: string | null; // External link
  tags?: string[] | null; // Array of relevant tags
  display_order?: number;
  created_at?: string; // ISO 8601 timestamp
  updated_at?: string; // ISO 8601 timestamp
}

// --- Blog Post Type ---
export interface BlogPost {
  id: string; // UUID
  user_id?: string; // UUID, foreign key to auth.users
  title: string;
  slug: string; // URL-friendly identifier, unique
  excerpt?: string | null; // Short summary
  content?: string | null; // Full content in Markdown
  cover_image_url?: string | null; // URL to a cover image
  published?: boolean; // True if the post is live
  published_at?: string | null; // ISO 8601 timestamp, when the post went live
  tags?: string[] | null; // Array of tags
  views?: number; // View count
  created_at?: string; // ISO 8601 timestamp
  updated_at?: string; // ISO 8601 timestamp
  // Add other relevant fields like 'category', 'author_name' (if not from user_id), etc.
}

// --- GitHub Repository Type (Simplified) ---
// Based on common fields from GitHub API for public repos
export interface GitHubRepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  private: boolean; // Should always be false for public display
  archived: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null; // Primary language
  languages_url?: string; // URL to fetch language breakdown
  topics?: string[]; // Topics/tags assigned on GitHub
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  pushed_at: string; // ISO 8601 timestamp
  homepage?: string | null; // Link to project's homepage
  owner: GitHubRepoOwner;
  // Add other fields as needed
}

// --- Admin User/Session (Example, Supabase handles this) ---
// If you were managing sessions manually (not recommended with Supabase Auth)
// export interface AdminSession {
//   user: {
//     id: string;
//     username: string; // Or email
//   };
//   isMfaVerified: boolean;
//   expiresAt: number; // Timestamp
// }
