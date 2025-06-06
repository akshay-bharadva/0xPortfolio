"use client"
// This component now uses Supabase MFA features. The old localStorage based MFA is removed.
// It will mainly focus on providing options to manage MFA factors if Supabase UI Kit isn't used.
// For a full implementation, you'd likely use more Supabase.auth.mfa methods like unenroll.

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/supabase/client"
import type { Factor } from "@supabase/supabase-js"
import { useRouter } from "next/router"


const buttonPrimaryClass = "bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space"; // Added font-space
const buttonDangerClass = "bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space"; // Added font-space

export default function SecuritySettings() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const loadFactors = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setError("Failed to load MFA factors: " + factorsError.message);
    } else {
      setFactors(data?.totp || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFactors();
  }, []);

  const handleUnenroll = async (factorId: string) => {
    if (!confirm("Are you sure you want to remove this MFA method? You might be logged out or lose access if it's your only method.")) {
      return;
    }
    setIsLoading(true);
    setError(null); setSuccess(null);
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
    if (unenrollError) {
      setError("Failed to unenroll MFA: " + unenrollError.message);
    } else {
      setSuccess("MFA method removed successfully. You may need to re-authenticate.");
      await loadFactors(); // Refresh factor list
      // Potentially check AAL and redirect if necessary
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel !== 'aal2' && aalData?.nextLevel !== 'aal2') {
        // If no longer aal2, redirect to login to re-evaluate auth state
        // Or to setup-mfa if they want to add a new one immediately
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  };

  const mfaEnabled = factors.some(f => f.status === 'verified');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto font-space"> {/* Added font-space */}
      <div className="bg-white border-2 border-black rounded-none">
        <div className="px-6 py-4 border-b-2 border-black bg-gray-100">
          <h2 className="text-xl font-bold text-black">Security Settings</h2>
          <p className="text-sm text-gray-700 mt-1">Manage your account security and two-factor authentication</p>
        </div>

        <div className="p-6 space-y-8">
          {success && (
            <div className="bg-green-100 border-2 border-green-500 rounded-none p-4">
              <p className="text-sm font-semibold text-green-700">{success}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-2 border-red-500 rounded-none p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="border-2 border-black rounded-none p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-black">Two-Factor Authentication (TOTP)</h3>
                <p className="text-sm text-gray-700">
                  {mfaEnabled
                    ? "MFA is currently active on your account."
                    : "Add an extra layer of security to your account."}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-bold border-2 border-black font-space ${ // Added font-space
                  mfaEnabled ? "bg-green-300 text-black" : "bg-yellow-300 text-black"
                }`}
              >
                {mfaEnabled ? "Enabled" : "Not Fully Setup"}
              </span>
            </div>

            {isLoading && <p className="text-sm text-gray-700">Loading MFA status...</p>}

            {!isLoading && factors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-black">Registered Authenticators:</h4>
                {factors.map(factor => (
                  <div key={factor.id} className="flex justify-between items-center p-3 border border-gray-400 bg-white rounded-none">
                    <div>
                      <p className="font-semibold text-sm">{factor.friendly_name || `Authenticator (ID: ...${factor.id.slice(-6)})`}</p>
                      <p className="text-xs text-gray-600">Status: {factor.status}</p>
                    </div>
                    <button
                      onClick={() => handleUnenroll(factor.id)}
                      className={buttonDangerClass + " text-xs py-1 px-2"}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && (
                 <button
                    onClick={() => router.push('/admin/setup-mfa')}
                    className={`${buttonPrimaryClass} mt-4`}
                    disabled={isLoading}
                >
                    {factors.length > 0 ? "Add Another Authenticator" : "Set Up MFA Now"}
                </button>
            )}
          </div>

          <div className="border-2 border-black rounded-none p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-black mb-4">Security Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Keep your authenticator app secure and backed up.",
                "Do not share your password or MFA codes.",
                "Use a strong, unique password for admin access.",
                "Log out when you finish managing your site.",
                "Regularly review active sessions if your auth provider supports it."
              ].map(tip => (
                <li key={tip} className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">•</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}