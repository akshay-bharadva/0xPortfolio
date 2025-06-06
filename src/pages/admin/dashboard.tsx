import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase, Session } from '@/supabase/client';
import AdminDashboardComponent from '@/components/admin/admin-dashboard';
import { motion } from 'framer-motion';
import Layout from '@/components/layout'; // Import Layout

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuthAndAAL = async () => {
      setIsLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (!currentSession) {
        router.replace('/admin/login');
        return;
      }

      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) {
        console.error("Error fetching AAL status:", aalError);
        // Allow access if session exists but AAL fails, but log it. AAL2 check is primary.
        // Consider if this should redirect to login. For now, if session is good, proceed.
      }

      if (aalData?.currentLevel !== 'aal2') {
        if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel === 'aal1') {
          router.replace('/admin/mfa-challenge');
        } else {
          // This could mean MFA is not setup, or some other state.
          // Login page will handle redirection to setup-mfa if needed.
          router.replace('/admin/login');
        }
        return;
      }
      setIsLoading(false);
    };

    checkAuthAndAAL();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT' || !session) {
            router.replace('/admin/login');
        } else if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED' || event === "MFA_CHALLENGE_VERIFIED") {
            checkAuthAndAAL(); // Re-check AAL
        }
    });

    return () => { authListener?.subscription?.unsubscribe(); };
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    // onAuthStateChange listener handles redirection
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  if (isLoading || !session) {
    return (
      <Layout> {/* Added Layout */}
        <motion.div
          key="dashboard-loading" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.2 }}
          className="min-h-screen flex items-center justify-center bg-indigo-100 font-space" // Added font-space
        >
          <div className="text-center p-8 bg-white border-2 border-black">
            <div className="animate-spin rounded-none h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Loading Dashboard...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout> {/* Added Layout */}
      <motion.div
          key="dashboard-content" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.2 }}
          className="font-space" // Added font-space to content wrapper
      >
          <AdminDashboardComponent onLogout={handleLogout} />
      </motion.div>
    </Layout>
  );
}