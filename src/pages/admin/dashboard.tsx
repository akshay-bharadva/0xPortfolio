import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase, Session } from "@/supabase/client"; // Session type from Supabase
import AdminDashboardComponent from "@/components/admin/admin-dashboard";
import { motion } from "framer-motion";
import Layout from "@/components/layout";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // Use Supabase Session type

  useEffect(() => {
    const checkAuthAndAAL = async () => {
      setIsLoading(true); // Start loading indicator
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

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

      const { data: aalData, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) {
        console.error("Error fetching AAL status:", aalError);
        // Critical error fetching AAL, might indicate issues. Redirect to login for safety.
        router.replace("/admin/login");
        return;
      }

      if (aalData?.currentLevel !== "aal2") {
        if (aalData?.currentLevel === "aal1" && aalData?.nextLevel === "aal2") {
          router.replace("/admin/mfa-challenge");
        } else {
          // This could mean MFA is not setup, or some other state.
          // Login page will handle redirection to setup-mfa if needed.
          router.replace("/admin/login");
        }
        return; // Stop execution after redirect
      }
      setIsLoading(false); // Successfully authenticated and AAL2 verified
    };

    checkAuthAndAAL();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession); // Update session state on any auth change
        if (event === "SIGNED_OUT" || !newSession) {
          router.replace("/admin/login");
        } else if (
          event === "USER_UPDATED" ||
          event === "TOKEN_REFRESHED" ||
          event === "MFA_CHALLENGE_VERIFIED"
        ) {
          // Re-check AAL on these events as auth state might have changed significantly
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      setIsLoading(false); // Allow UI to respond if sign out fails
    }
    // onAuthStateChange listener handles redirection to login
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  if (isLoading || !session) {
    // Show loader if loading or session is null (e.g., during initial check)
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

  // If session exists and not loading (implies AAL2 was met)
  return (
    <Layout>
      <motion.div
        key="dashboard-content"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="font-space" // Ensure font is applied to the dashboard content area
      >
        <AdminDashboardComponent onLogout={handleLogout} />
      </motion.div>
    </Layout>
  );
}
