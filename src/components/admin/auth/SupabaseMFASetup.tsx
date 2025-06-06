"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/router'; // Changed import
import { motion, AnimatePresence } from "framer-motion";

export default function SupabaseMFASetup() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [manualEntryKey, setManualEntryKey] = useState('');
    const [factorId, setFactorId] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoadingState, setIsLoadingState] = useState(true); // Renamed to avoid conflict
    const [showSecret, setShowSecret] = useState(false);
    const [remainingTime, setRemainingTime] = useState(30);
    const router = useRouter(); // Changed to useRouter

    useEffect(() => {
        const protectPageAndEnroll = async () => {
            setIsLoadingState(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/admin/login');
                return;
            }

            const { data, error: enrollError } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
                issuer: 'MyPortfolioAdmin', // Consider making this configurable
            });

            if (enrollError) {
                setError(enrollError.message || 'Failed to start MFA enrollment.');
                setIsLoadingState(false);
                if (enrollError.message.includes("Enrolled factors exceed")) {
                    setError("MFA is already set up or max factors reached. Try MFA Challenge or manage factors in Security.");
                    // setTimeout(() => router.replace('/admin/mfa-challenge'), 3000); // Removed auto-redirect to let user see message
                }
                return;
            }

            if (data) {
                setQrCodeUrl(data.totp.qr_code);
                setManualEntryKey(data.totp.secret);
                setFactorId(data.id);
            }
            setIsLoadingState(false);
        };

        protectPageAndEnroll();
    }, [router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(30 - (new Date().getSeconds() % 30));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingState(true);
        setError('');

        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });

        if (challengeError) {
            setIsLoadingState(false);
            setError(challengeError.message || 'Failed to create MFA challenge.');
            return;
        }

        const challengeId = challengeData.id;
        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId,
            challengeId,
            code: otp,
        });

        setIsLoadingState(false);
        if (verifyError) {
            setError(verifyError.message || 'Invalid OTP. Please try again.');
            return;
        }

        // No need for alert, success should be handled by redirection or a message on dashboard
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel(); // Update AAL
        router.replace('/admin/dashboard');
    };

    const copySecret = async () => {
        try {
            await navigator.clipboard.writeText(manualEntryKey);
            // Simple visual feedback - could be a small temporary message
            const copyButton = document.getElementById('copySecretButton');
            if (copyButton) {
                const originalText = copyButton.innerText;
                copyButton.innerText = "Copied!";
                setTimeout(() => { copyButton.innerText = originalText; }, 2000);
            }
        } catch (err) {
            console.error("Failed to copy secret:", err);
            setError("Failed to copy. Please copy manually.");
        }
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    if (isLoadingState && !qrCodeUrl && !error) { // Only show main loader if no early error and no QR code yet
        return (
            <motion.div
                key="mfa-setup-loading" initial="initial" animate="animate" exit="exit" variants={stepVariants} transition={{ duration: 0.3 }}
                className="min-h-screen flex items-center justify-center bg-indigo-100 font-space" // Added font-space
                >
                <div className="text-center p-8 bg-white border-2 border-black">
                    <div className="animate-spin rounded-none h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-semibold">Loading MFA Setup...</p>
                </div>
            </motion.div>
        );
    }


    return (
        <motion.div
            key="mfa-setup-page" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center px-4 py-8 bg-indigo-100 font-space" // Added font-space
        >
            <div className="max-w-2xl w-full space-y-8 p-8 bg-white border-2 border-black shadow-[8px_8px_0px_#000000]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-500 rounded-none flex items-center justify-center mb-4 border-2 border-black">
                        <span className="text-white text-xl">📱</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black">Set Up Two-Factor Authentication</h2>
                    <p className="mt-2 text-gray-700">Secure your admin account with an authenticator app</p>
                </div>

                <AnimatePresence>
                    {error && !factorId && ( // Show general error if enrollment failed (no factorId)
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="bg-red-100 border-2 border-red-500 rounded-none p-3 my-4">
                            <p className="text-red-700 text-sm font-semibold">{error}</p>
                             {error.includes("MFA is already set up") && (
                                <button
                                    onClick={() => router.push('/admin/mfa-challenge')}
                                    className="mt-2 text-sm text-indigo-700 hover:text-indigo-900 underline font-semibold font-space" // Added font-space
                                >
                                    Go to MFA Challenge
                                </button>
                             )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Only show setup steps if factorId exists (enrollment was successful) */}
                {factorId && (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-black mb-2">Step 1: Scan QR Code</h3>
                        <p className="text-gray-700 mb-4">Open your authenticator app (e.g., Google Authenticator) and scan this QR code.</p>
                        {qrCodeUrl ? (
                            <div className="flex justify-center">
                                <div className="p-2 bg-white border-2 border-black rounded-none">
                                    <img src={qrCodeUrl} alt="QR Code for MFA setup" className="w-48 h-48" />
                                </div>
                            </div>
                        ) : <p className="text-gray-600">Generating QR Code...</p>}
                    </div>

                    {manualEntryKey && <div className="border-t-2 border-black pt-6">
                        <h3 className="text-lg font-bold text-black mb-2">Step 2: Manual Entry (Optional)</h3>
                        <p className="text-gray-700 mb-3">Can&apos;t scan? Enter this secret manually:</p>
                        <div className="flex items-center space-x-2 p-3 bg-gray-100 border-2 border-black rounded-none">
                            <code className="flex-1 font-mono text-sm break-all text-gray-800 font-space"> {/* Added font-space (font-mono takes precedence) */}
                                {showSecret ? manualEntryKey : "••••••••••••••••••••••••••••••••"}
                            </code>
                            <button type="button" onClick={() => setShowSecret(!showSecret)} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline font-space"> {/* Added font-space */}
                                {showSecret ? "Hide" : "Show"}
                            </button>
                            <button type="button" id="copySecretButton" onClick={copySecret} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline font-space"> {/* Added font-space */}
                                Copy
                            </button>
                        </div>
                    </div>}

                    {factorId && <div className="border-t-2 border-black pt-6">
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-black mb-2">Step 3: Verify Setup</h3>
                                <label htmlFor="totpCode" className="block text-sm font-bold text-black mb-1">
                                    Enter the 6-digit code from your authenticator app:
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        id="totpCode" name="totpCode" type="text" required maxLength={6} pattern="[0-9]{6}"
                                        className="flex-1 px-3 py-2 border-2 border-black rounded-none text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 font-space" // Added font-space (font-mono takes precedence)
                                        placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    />
                                    <div className="text-center p-2 border-2 border-black rounded-none">
                                        <div className="text-2xl font-bold text-indigo-600">{remainingTime}</div>
                                        <div className="text-xs text-gray-600">seconds</div>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && factorId && ( // Show OTP specific error only if factorId is present
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-100 border-2 border-red-500 rounded-none p-3">
                                        <p className="text-red-700 text-sm font-semibold">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                <button
                                    type="submit" disabled={isLoadingState || otp.length !== 6 || !factorId}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space" // Added font-space
                                >
                                    {isLoadingState ? "Verifying..." : "Verify & Complete Setup"}
                                </button>
                                <button
                                    type="button" onClick={() => router.push("/admin/login")} // Or signOut and redirect
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-3 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 font-space" // Added font-space
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>}
                </div>)}
            </div>
        </motion.div>
    );
}