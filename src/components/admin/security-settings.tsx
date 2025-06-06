"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/supabase/client";
import type { Factor } from "@supabase/supabase-js";
import { useRouter } from "next/router"; // Correct import for Pages Router

const buttonPrimaryClass =
  "bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space";
const buttonDangerClass =
  "bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space";

export default function SecuritySettings() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const loadFactors = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear success message on reload
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setError("Failed to load MFA factors: " + factorsError.message);
      setFactors([]); // Ensure factors is empty on error
    } else {
      setFactors(data?.totp || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFactors();
  }, []);

  const handleUnenroll = async (factorId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this MFA method? You might be logged out or lose access if it's your only method.",
      )
    ) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId,
    });

    if (unenrollError) {
      setError("Failed to unenroll MFA: " + unenrollError.message);
      setIsLoading(false);
    } else {
      setSuccess("MFA method removed successfully.");
      await loadFactors(); // Refresh factor list and loading state
      // Check AAL and redirect if necessary AFTER factors are reloaded and state is updated
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel !== "aal2") {
        // If no longer aal2, or no factors left to achieve aal2, user might need to re-setup or login.
        // Consider specific UX: e.g. if all factors removed, redirect to setup-mfa or login.
        router.push("/admin/login"); // A safe default to re-evaluate auth state.
      } else {
        setIsLoading(false); // Factors reloaded, still aal2
      }
    }
  };

  const mfaEnabled = factors.some((f) => f.status === "verified");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl font-space"
    >
      <div className="rounded-none border-2 border-black bg-white">
        <div className="border-b-2 border-black bg-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-black">Security Settings</h2>
          <p className="mt-1 text-sm text-gray-700">
            Manage your account security and two-factor authentication
          </p>
        </div>

        <div className="space-y-8 p-6">
          {success && (
            <div className="rounded-none border-2 border-green-500 bg-green-100 p-4">
              <p className="text-sm font-semibold text-green-700">{success}</p>
            </div>
          )}
          {error && (
            <div className="rounded-none border-2 border-red-500 bg-red-100 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="rounded-none border-2 border-black bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-black">
                  Two-Factor Authentication (TOTP)
                </h3>
                <p className="text-sm text-gray-700">
                  {mfaEnabled
                    ? "MFA is currently active and verified on your account."
                    : factors.length > 0
                      ? "You have MFA factors registered, but not all may be fully verified for AAL2."
                      : "Add an extra layer of security to your account."}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-none border-2 border-black px-2.5 py-0.5 font-space text-xs font-bold ${
                  mfaEnabled
                    ? "bg-green-300 text-black"
                    : "bg-yellow-300 text-black"
                }`}
              >
                {mfaEnabled
                  ? "AAL2 Active"
                  : factors.length > 0
                    ? "Factors Registered"
                    : "Not Setup"}
              </span>
            </div>

            {isLoading && (
              <p className="text-sm text-gray-700">Loading MFA status...</p>
            )}

            {!isLoading && factors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-black">
                  Registered Authenticators:
                </h4>
                {factors.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-center justify-between rounded-none border border-gray-400 bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {factor.friendly_name ||
                          `Authenticator (ID: ...${factor.id.slice(-6)})`}
                      </p>
                      <p className="text-xs text-gray-600">
                        Status: {factor.status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnenroll(factor.id)}
                      className={`${buttonDangerClass} px-2 py-1 text-xs`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && factors.length === 0 && !error && (
              <p className="text-sm text-gray-700">
                No MFA methods are currently set up.
              </p>
            )}

            {!isLoading && (
              <button
                onClick={() => router.push("/admin/setup-mfa")}
                className={`${buttonPrimaryClass} mt-4`}
                disabled={isLoading} // Disable if already loading factors/unenrolling
              >
                {factors.length > 0
                  ? "Add Another Authenticator"
                  : "Set Up MFA Now"}
              </button>
            )}
          </div>

          <div className="rounded-none border-2 border-black bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-black">Security Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Keep your authenticator app secure and backed up.",
                "Do not share your password or MFA codes.",
                "Use a strong, unique password for admin access.",
                "Log out when you finish managing your site.",
                "Regularly review active sessions if your auth provider supports it.",
              ].map((tip) => (
                <li key={tip} className="flex items-start">
                  <span className="mr-2 font-bold text-indigo-600">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
