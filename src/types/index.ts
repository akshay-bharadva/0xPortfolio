export interface PortfolioSection {
  id: string;
  user_id?: string;
  title: string;
  type: "markdown" | "list_items" | "gallery";
  content?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  portfolio_items?: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  section_id: string;
  user_id?: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  tags?: string[] | null;
  internal_notes?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  user_id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  published?: boolean;
  published_at?: string | null;
  tags?: string[] | null;
  views?: number;
  internal_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

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
  private: boolean;
  archived: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  languages_url?: string;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage?: string | null;
  owner: GitHubRepoOwner;
}