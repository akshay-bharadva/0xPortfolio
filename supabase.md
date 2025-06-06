### ✅ Updated Requirements with Supabase:

You want a **ReactJS serverless sign-in page** where:

1. On the **first login**, the user:

   - Enters email/password
   - Sets up MFA using an authenticator app
   - Is redirected to an admin page

2. On **another device**, the user:

   - Just enters the **MFA OTP** to log in (if already enrolled)

---

### 🧰 Tools Required

- React JS
- Supabase JS client

---

### 🧱 Supabase Setup Steps

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Authentication → Settings → MFA**

   - Enable **TOTP**

4. Copy your **Project URL** and **Anon Key**

---

### 📦 Install Dependencies

```bash
npm install @supabase/supabase-js
```

---

**Overall Supabase Strategy:**

1.  **Database Tables:**

    - `profiles`: To store basic user information if needed (though for a single-admin portfolio, this might be simpler).
    - `portfolio_sections`: To store different sections of your portfolio (e.g., "About Me", "Experience", "Projects", "Skills", "Education"). Each section will have a type and content.
    - `portfolio_items`: For list-based sections like "Experience" or "Projects", this table will hold individual items belonging to a section.
    - `blog_posts`: To store blog articles, including title, slug, content, published status, creation/update dates, and potentially tags.
    - `blog_views`: To track views per blog post (could be a simple counter on `blog_posts` or a separate table for more detailed analytics).

2.  **Admin Panel CRUD:**

    - Update `ContentManager.tsx` to manage `portfolio_sections` and `portfolio_items`.
    - Update `BlogManager.tsx` and `BlogEditor.tsx` to use Supabase for CRUD operations on `blog_posts`.

3.  **Public Portfolio/Blog Pages:**

    - New Next.js pages (e.g., `/`, `/blog`, `/blog/[slug]`) to fetch and display data from Supabase.
    - Implement view counting for blog posts.

4.  **Row Level Security (RLS) - Important!**
    - **Admin Actions:** RLS policies will ensure that only authenticated admin users (based on their user ID or a custom role) can write (create, update, delete) to these tables.
    - **Public Reads:** RLS policies will allow anyone to read published blog posts and portfolio content.

---

**Phase 1: Supabase Table Setup & RLS**

Go to your Supabase project's **Table Editor** and SQL Editor.

**1. `portfolio_sections` Table:**

- `id`: `uuid` (Primary Key, default `uuid_generate_v4()`)
- `user_id`: `uuid` (Foreign Key to `auth.users.id`, default `auth.uid()`) - _if you plan for multiple users to have portfolios, otherwise can be omitted if it's just for one admin user whose ID you know._
- `title`: `text` (e.g., "Work Experience", "Projects")
- `type`: `text` (e.g., "markdown", "list", "gallery") - to determine how to render it.
- `content`: `text` (for "markdown" type sections, stores Markdown content)
- `order`: `int4` (for ordering sections on the page)
- `created_at`: `timestamp with time zone` (default `now()`)
- `updated_at`: `timestamp with time zone` (default `now()`)

**SQL for `portfolio_sections`:**

```sql
CREATE TABLE portfolio_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(), -- Assumes admin user is logged in
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('markdown', 'list_items', 'gallery')), -- Add more types as needed
  content TEXT, -- For markdown type or general description
  display_order INT4 DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do anything
CREATE POLICY "Admin full access on portfolio_sections"
ON portfolio_sections
FOR ALL
USING (auth.uid() = user_id) -- Or a specific admin user_id if not using user_id column broadly
WITH CHECK (auth.uid() = user_id);

-- Policy: Public can read
CREATE POLICY "Public can read portfolio_sections"
ON portfolio_sections
FOR SELECT
USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_sections_updated_at
BEFORE UPDATE ON portfolio_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**2. `portfolio_items` Table (for list-based sections):**

- `id`: `uuid` (Primary Key, default `uuid_generate_v4()`)
- `section_id`: `uuid` (Foreign Key to `portfolio_sections.id`, ON DELETE CASCADE)
- `user_id`: `uuid` (Foreign Key to `auth.users.id`, default `auth.uid()`)
- `title`: `text` (e.g., "Software Engineer at Google")
- `subtitle`: `text` (e.g., "Jan 2020 - Present | Mountain View, CA")
- `description`: `text` (Markdown supported details)
- `image_url`: `text` (optional, for project logos, etc.)
- `link_url`: `text` (optional)
- `tags`: `text[]` (array of text for skills, technologies)
- `order`: `int4`
- `created_at`: `timestamp with time zone` (default `now()`)
- `updated_at`: `timestamp with time zone` (default `now()`)

**SQL for `portfolio_items`:**

```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES portfolio_sections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  tags TEXT[],
  display_order INT4 DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do anything
CREATE POLICY "Admin full access on portfolio_items"
ON portfolio_items
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Public can read
CREATE POLICY "Public can read portfolio_items"
ON portfolio_items
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON portfolio_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); -- Use the same function as above
```

**3. `blog_posts` Table:**

- `id`: `uuid` (Primary Key, default `uuid_generate_v4()`)
- `user_id`: `uuid` (Foreign Key to `auth.users.id`, default `auth.uid()`)
- `title`: `text` (NOT NULL)
- `slug`: `text` (UNIQUE, NOT NULL)
- `excerpt`: `text`
- `content`: `text` (Markdown content)
- `cover_image_url`: `text` (optional)
- `published`: `boolean` (default `false`)
- `published_at`: `timestamp with time zone` (nullable, set when `published` becomes true)
- `tags`: `text[]` (array of text)
- `views`: `int8` (default `0`)
- `created_at`: `timestamp with time zone` (default `now()`)
- `updated_at`: `timestamp with time zone` (default `now()`)

**SQL for `blog_posts`:**

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[],
  views BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do anything
CREATE POLICY "Admin full access on blog_posts"
ON blog_posts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Public can read published posts
CREATE POLICY "Public can read published blog_posts"
ON blog_posts
FOR SELECT
USING (published = true);

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Optional: Function to set published_at when a post is published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_set_published_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
WHEN (OLD.published IS DISTINCT FROM NEW.published) -- Only run if 'published' changes
EXECUTE FUNCTION set_published_at();
```

**4. `blog_views` (Alternative for detailed views - Optional for now, simple counter is easier to start):**
If you want more detailed view tracking (e.g., by IP, timestamp, unique views), you'd create a separate table. For now, we'll use the `views` counter on `blog_posts`.

**5. Supabase Storage (for images):**

1.  Go to **Storage** in your Supabase dashboard.
2.  Create a new bucket, e.g., `portfolio_assets`.
3.  Make it **public** if images are directly linked.
4.  Set up Storage RLS policies:

    - Allow authenticated admin users to `select, insert, update, delete`.
    - Allow public `select` (read).

    ```sql
    -- Example policies for a bucket named 'portfolio_assets'

    -- Allow public read access to all files in the bucket
    CREATE POLICY "Public read access for portfolio_assets"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'portfolio_assets' );

    -- Allow authenticated users (admin) to upload, update, delete their own files
    -- You might want to restrict this further, e.g., to a specific admin role or user ID
    CREATE POLICY "Admin can manage files in portfolio_assets"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'portfolio_assets' AND auth.role() = 'authenticated' ); -- Or check auth.uid() against a known admin ID

    CREATE POLICY "Admin can update files in portfolio_assets"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'portfolio_assets' AND auth.role() = 'authenticated' );

    CREATE POLICY "Admin can delete files in portfolio_assets"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'portfolio_assets' AND auth.role() = 'authenticated' );
    ```

    _Note: `auth.role() = 'authenticated'` is a broad check. For better security, you might want to assign a custom 'admin' role to your user in Supabase or check `auth.uid()` against a hardcoded admin user ID if there's only one admin._

---

// Supabase RPC function for safely incrementing views
// Run this in your Supabase SQL Editor once:
/\*
CREATE OR REPLACE FUNCTION increment_blog_post_view (post_id_to_increment UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
UPDATE blog_posts
SET views = views + 1
WHERE id = post_id_to_increment;
END;

$$
;
*/

**Supabase RPC Function for View Increment:**

In your Supabase SQL Editor, run this to create the function for safely incrementing views:

```sql
CREATE OR REPLACE FUNCTION increment_blog_post_view (post_id_to_increment UUID)
RETURNS void
LANGUAGE plpgsql
AS
$$

BEGIN
UPDATE blog_posts
SET views = views + 1
WHERE id = post_id_to_increment;
END;

$$
;
```
This RPC function is better for concurrent updates than a direct `select` then `update` from the client.
$$
