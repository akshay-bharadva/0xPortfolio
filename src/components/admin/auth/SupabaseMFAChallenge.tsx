"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/router'; // Changed import
import { motion, AnimatePresence } from "framer-motion";

export default function SupabaseMFAChallenge() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoadingState, setIsLoadingState] = useState(true); // Renamed
  const [remainingTime, setRemainingTime] = useState(30);
  const [factorId, setFactorId] = useState<string | null>(null);
  const router = useRouter(); // Changed

  useEffect(() => {
    const protectPageAndGetFactor = async () => {
        setIsLoadingState(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.replace('/admin/login');
            return;
        }

        const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalError) {
            setError("Could not check MFA status: " + aalError.message);
            setIsLoadingState(false);
            return;
        }

        if (aalData?.currentLevel === 'aal2') {
            router.replace('/admin/dashboard'); // Already authenticated
            return;
        }
        if (aalData?.currentLevel !== 'aal1' || aalData?.nextLevel !== 'aal2') {
            setError("MFA challenge is not applicable. You might need to set up MFA first.");
            setIsLoadingState(false);
            router.replace('/admin/login');
            return;
        }

        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError || !factorsData?.totp?.length) {
            setError("Could not retrieve MFA factor. Please try logging in again.");
            setIsLoadingState(false);
            router.replace('/admin/login');
            return;
        }

        const firstVerifiedFactor = factorsData.totp.find(f => f.status === 'verified');
        if (firstVerifiedFactor) {
            setFactorId(firstVerifiedFactor.id);
        } else {
            setError("No verified MFA factor found. Please set up MFA or try logging in again.");
            router.replace('/admin/setup-mfa');
        }
        setIsLoadingState(false);
    };
    protectPageAndGetFactor();
  }, [router]);


  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(30 - (new Date().getSeconds() % 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) {
        setError("MFA factor ID is missing. Please try logging in again.");
        return;
    }
    setIsLoadingState(true);
    setError('');

    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factorId,
      code: otp,
    });

    setIsLoadingState(false);
    if (verifyError) {
      setError(verifyError.message || 'Invalid OTP. Please try again.');
      return;
    }

    router.replace('/admin/dashboard'); // Changed navigation
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (isLoadingState && !error) { // Only show main loader if no early error
    return (
     <motion.div
       key="mfa-challenge-loading" initial="initial" animate="animate" exit="exit" variants={stepVariants} transition={{ duration: 0.3 }}
       className="min-h-screen flex items-center justify-center bg-indigo-100 font-space" // Added font-space
       >
       <div className="text-center p-8 bg-white border-2 border-black">
         <div className="animate-spin rounded-none h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
         <p className="text-gray-700 font-semibold">Loading MFA Challenge...</p>
       </div>
     </motion.div>
   );
 }

  return (
    <motion.div
      key="mfa-challenge-page" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center px-4 bg-indigo-100 font-space" // Added font-space
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white border-2 border-black shadow-[8px_8px_0px_#000000]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-500 rounded-none flex items-center justify-center mb-4 border-2 border-black">
            <span className="text-white text-xl">🔑</span>
          </div>
          <h2 className="text-3xl font-bold text-black">Two-Factor Authentication</h2>
          <p className="mt-2 text-gray-700">Enter the code from your authenticator app</p>
        </div>

        <div className="bg-white rounded-none p-0 md:p-4">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="totpCode" className="block text-sm font-bold text-black mb-1">
                Verification Code
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="totpCode" name="totpCode" type="text" required maxLength={6} pattern="[0-9]{6}"
                  className="flex-1 px-3 py-2 border-2 border-black rounded-none text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 font-space" // Added font-space (font-mono will likely take precedence for numbers)
                  placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <div className="text-center p-2 border-2 border-black rounded-none">
                  <div className="text-2xl font-bold text-indigo-600">{remainingTime}</div>
                  <div className="text-xs text-gray-600">seconds</div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-100 border-2 border-red-500 rounded-none p-3">
                  <p className="text-red-700 text-sm font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit" disabled={isLoadingState || otp.length !== 6 || !factorId}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space" // Added font-space
            >
              {isLoadingState ? "Verifying..." : "Verify & Sign In"}
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={async () => {
                        setIsLoadingState(true); // Visual feedback
                        await supabase.auth.signOut();
                        router.replace('/admin/login');
                    }}
                    className="text-sm text-gray-600 hover:text-black underline font-semibold font-space" // Added font-space
                >
                    Cancel and sign out
                </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}