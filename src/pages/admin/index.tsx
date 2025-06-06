import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase/client';
import { motion } from 'framer-motion';
import Layout from '@/components/layout'; // Import Layout

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStateAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/admin/login');
        return;
      }

      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) {
        console.error("Error fetching AAL status on index:", aalError);
        router.replace('/admin/login');
        return;
      }

      if (aalData?.currentLevel === 'aal2') {
        router.replace('/admin/dashboard');
      } else if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
        router.replace('/admin/mfa-challenge');
      } else {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const verifiedFactor = factorsData?.totp?.find(factor => factor.status === 'verified');

        if (session && !verifiedFactor) { // Logged in (AAL1), but no verified TOTP factor
            router.replace('/admin/setup-mfa');
        } else if (session && verifiedFactor && aalData?.currentLevel === 'aal1') { // Logged in, factor exists, but not yet passed challenge
             router.replace('/admin/mfa-challenge');
        }
        else { // Default to login if state is unclear or to re-trigger login flow
            router.replace('/admin/login');
        }
      }
    };

    checkAuthStateAndRedirect();
  }, [router]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <Layout> {/* Added Layout */}
      <motion.div
          key="admin-index-loading" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.2 }}
          className="min-h-screen flex items-center justify-center bg-indigo-100 font-space" // Added font-space
      >
        <div className="text-center p-8 bg-white border-2 border-black">
          <div className="animate-spin rounded-none h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading Admin Area...</p>
        </div>
      </motion.div>
    </Layout>
  );
}