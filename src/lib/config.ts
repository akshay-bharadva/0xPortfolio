// Configuration for the application

// Ensure environment variables are consistently named and accessed.
// It's good practice to group related configurations.

interface AppConfig {
  admin: {
    password?: string; // Password should not be used for client-side auth. Supabase handles auth.
  };
  mfa: {
    appName: string;
    accountName: string; // Usually user's email or username
    issuer: string; // Typically the appName or domain
  };
  site: {
    title: string;
    description: string;
    url: string;
    defaultOgImage: string;
    author: string; // Added author name
    twitterHandle?: string; // Optional Twitter handle
  };
  supabase: {
    url: string;
    anonKey: string;
    bucketName: string;
  };
  session: {
    // This seems related to a custom session, Supabase handles its own.
    maxAge: number; // in milliseconds
  };
}

export const config: AppConfig = {
  admin: {
    // Admin password from env is generally insecure for client-side apps.
    // Supabase auth with email/password and MFA is the correct approach being used.
    // This password variable isn't used by Supabase auth components.
    // password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  },
  mfa: {
    // These are for the TOTP.ts generator if used, Supabase MFA uses its own issuer setting.
    appName: process.env.NEXT_PUBLIC_APP_NAME || "MyPortfolioAdmin",
    accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME || "admin@example.com", // This should be dynamic per user
    issuer: process.env.NEXT_PUBLIC_MFA_ISSUER || "MyPortfolio", // Issuer for TOTP URIs
  },
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "Akshay Bharadva - Portfolio",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "A modern portfolio website with blog functionality, built by Akshay Bharadva.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL || "https://akshay-bharadva.github.io",
    defaultOgImage: `${process.env.NEXT_PUBLIC_SITE_URL || "https://akshay-bharadva.github.io"}/default-og-image.png`,
    author: "Akshay Bharadva",
    // twitterHandle: "@yourTwitterHandle", // Example
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME || "blog-assets",
  },
  session: {
    // If this refers to Supabase session, its lifetime is managed by Supabase.
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (example, not directly used by Supabase client sessions like this)
  },
};

// Validate essential Supabase config (can also be done in supabase/client.ts)
if (!config.supabase.url) {
  console.warn(
    "Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL.",
  );
}
if (!config.supabase.anonKey) {
  console.warn(
    "Supabase Anon Key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}
