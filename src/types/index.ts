export interface PortfolioSection {
  id: string;
  user_id?: string; // Assuming auth.uid() is used on insert
  title: string;
  type: 'markdown' | 'list_items' | 'gallery'; // Extend as needed
  content?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  portfolio_items?: PortfolioItem[]; // For sections of type 'list_items'
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
  created_at?: string;
  updated_at?: string;
}