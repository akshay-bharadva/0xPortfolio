import {
  createClient,
  Session,
  User,
  SupabaseClientOptions,
} from "@supabase/supabase-js"; // Import SupabaseClientOptions
import { config } from "@/lib/config"; // Use centralized config

const { supabase: supabaseConfig } = config; // Destructure supabase config

if (!supabaseConfig.url) {
  console.error(
    "Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.",
  );
  // Consider throwing an error or handling this more gracefully depending on application needs
}
if (!supabaseConfig.anonKey) {
  console.error(
    "Supabase Anon Key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.",
  );
}

// Define Supabase client options, e.g., for schema, autoRefreshToken, etc.
const options: SupabaseClientOptions<"public"> = {
  // Specify schema type if not public
  // schema: 'public', // Default
  auth: {
    // autoRefreshToken: true, // Default
    // persistSession: true, // Default
    // detectSessionInUrl: true, // Default for OAuth
  },
  // global: {
  //   headers: { 'x-my-custom-header': 'my-app-name' },
  // },
};

export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  options,
);

export type { Session, User }; // Re-export types for convenience
