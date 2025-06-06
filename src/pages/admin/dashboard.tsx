import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase, Session } from "@/supabase/client";
import AdminDashboardComponent from "@/components/admin/admin-dashboard";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import type { BlogPost } from "@/types";

export interface DashboardData {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    portfolioSections: number;
    portfolioItems: number;
  } | null;
  recentPosts: Pick<BlogPost, "id" | "title" | "updated_at" | "slug">[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({ stats: null, recentPosts: [] });

  useEffect(() => {
    const checkAuthAndAAL = async () => {
      setIsLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        router.replace("/admin/login");
        return;
      }

      setSession(currentSession);

      if (!currentSession) {
        router.replace("/admin/login");
        return;
      }

      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) {
        console.error("Error fetching AAL status:", aalError);
        router.replace("/admin/login");
        return;
      }

      if (aalData?.currentLevel !== "aal2") {
        if (aalData?.currentLevel === "aal1" && aalData?.nextLevel === "aal2") {
          router.replace("/admin/mfa-challenge");
        } else {
          router.replace("/admin/login");
        }
        return;
      }
      setIsLoading(false);

      if (currentSession && aalData?.currentLevel === "aal2") {
        try {
          const [
            { count: totalPosts, error: tpError },
            { count: publishedPosts, error: ppError },
            { count: draftPosts, error: dpError },
            { count: portfolioSections, error: psError },
            { count: portfolioItems, error: piError },
            { data: recentPostsData, error: rpError },
          ] = await Promise.all([
            supabase.from("blog_posts").select("*", { count: "exact", head: true }),
            supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
            supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", false),
            supabase.from("portfolio_sections").select("*", { count: "exact", head: true }),
            supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
            supabase.from("blog_posts").select("id, title, updated_at, slug").order("updated_at", { ascending: false }).limit(3),
          ]);

          if (tpError || ppError || dpError || psError || piError || rpError) throw new Error("Failed to fetch some dashboard data.");

          setDashboardData({
            stats: {
              totalPosts: totalPosts || 0, publishedPosts: publishedPosts || 0, draftPosts: draftPosts || 0,
              portfolioSections: portfolioSections || 0, portfolioItems: portfolioItems || 0,
            },
            recentPosts: recentPostsData || [],
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };

    checkAuthAndAAL();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === "SIGNED_OUT" || !newSession) {
          router.replace("/admin/login");
        } else if ( event === "USER_UPDATED" || event === "TOKEN_REFRESHED" || event === "MFA_CHALLENGE_VERIFIED" ) {
          checkAuthAndAAL();
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  if (isLoading || !session) {
    return (
      <Layout>
        <motion.div
          key="dashboard-loading"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="flex min-h-screen items-center justify-center bg-indigo-100 font-space"
        >
          <div className="rounded-none border-2 border-black bg-white p-8 text-center">
            <div className="mx-auto mb-4 size-12 animate-spin rounded-none border-y-4 border-indigo-600"></div>
            <p className="font-semibold text-gray-700">Loading Dashboard...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        key="dashboard-content"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="font-space"
      >
        <AdminDashboardComponent onLogout={handleLogout} dashboardData={dashboardData} />
      </motion.div>
    </Layout>
  );
}