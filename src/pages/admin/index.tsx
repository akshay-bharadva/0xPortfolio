import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/supabase/client";
import { motion } from "framer-motion";
import Layout from "@/components/layout";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStateAndRedirect = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session on admin index:", sessionError);
        router.replace("/admin/login"); // Fallback to login on session error
        return;
      }

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      // Session exists, check MFA status
      const { data: aalData, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) {
        console.error("Error fetching AAL status on admin index:", aalError);
        router.replace("/admin/login"); // Fallback to login on AAL error
        return;
      }

      if (aalData?.currentLevel === "aal2") {
        router.replace("/admin/dashboard");
      } else if (
        aalData?.currentLevel === "aal1" &&
        aalData?.nextLevel === "aal2"
      ) {
        router.replace("/admin/mfa-challenge");
      } else {
        // User is authenticated (AAL1) but not yet AAL2, and not on the path to AAL2 via challenge.
        // This implies MFA might not be set up or verified yet.
        const { data: factorsData, error: factorsError } =
          await supabase.auth.mfa.listFactors();
        if (factorsError) {
          console.error(
            "Error listing MFA factors on admin index:",
            factorsError,
          );
          router.replace("/admin/login"); // Fallback on error
          return;
        }

        const verifiedFactor = factorsData?.totp?.find(
          (factor) => factor.status === "verified",
        );

        if (!verifiedFactor) {
          // No verified TOTP factor exists
          router.replace("/admin/setup-mfa");
        } else {
          // Verified factor exists, but not yet passed challenge or AAL state is stuck at AAL1
          router.replace("/admin/mfa-challenge"); // Attempt challenge again
        }
      }
    };

    checkAuthStateAndRedirect();
  }, [router]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  };

  // This page primarily handles redirection, so a simple loading state is sufficient.
  return (
    <Layout>
      <motion.div
        key="admin-index-loading"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex min-h-screen items-center justify-center bg-indigo-100 font-space"
      >
        <div className="rounded-none border-2 border-black bg-white p-8 text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-none border-y-4 border-indigo-600"></div>
          <p className="font-semibold text-gray-700">Loading Admin Area...</p>
        </div>
      </motion.div>
    </Layout>
  );
}
