"use client" // Still good practice for component files in App Router, not strictly needed for Pages Router components

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/router'; // Changed import
import { motion, AnimatePresence } from "framer-motion";

export default function SupabaseLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Changed to useRouter

    // Redirect if already fully authenticated
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
                if (aalData?.currentLevel === 'aal2') {
                    router.replace('/admin/dashboard');
                }
            }
        };
        checkAuth();
    }, [router]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
            setIsLoading(false);
            setError(signInError.message || 'Invalid login credentials.');
            return;
        }

        if (data.session) {
            const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (aalError) {
                setIsLoading(false);
                setError(aalError.message || 'Could not verify MFA status.');
                return;
            }

            if (aalData.currentLevel === 'aal2') {
                router.replace('/admin/dashboard'); // Changed navigation
            } else if (aalData.currentLevel === 'aal1' && aalData.nextLevel === 'aal2') {
                router.replace('/admin/mfa-challenge'); // Changed navigation
            } else {
                const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
                if (factorsError) {
                    setIsLoading(false);
                    setError(factorsError.message || "Could not list MFA factors.");
                    return;
                }
                const totpFactor = factorsData?.totp?.find(factor => factor.status === 'verified');
                if (totpFactor) {
                    router.replace('/admin/mfa-challenge'); // Changed navigation
                } else {
                    router.replace('/admin/setup-mfa'); // Changed navigation
                }
            }
        } else {
            setIsLoading(false);
            setError('Login failed. Please try again.');
        }
        // setIsLoading(false); // Navigation will occur
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <motion.div
            key="login-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center px-4 bg-indigo-100 font-space" // Added font-space
        >
            <div className="max-w-md w-full space-y-8 p-8 bg-white border-2 border-black shadow-[8px_8px_0px_#000000]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-500 rounded-none flex items-center justify-center mb-4 border-2 border-black">
                        <span className="text-white text-xl">🔐</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black">Admin Access</h2>
                    <p className="mt-2 text-gray-700">Sign in with your Supabase credentials</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-black mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-space" // Added font-space
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-black mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-space" // Added font-space
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-100 border-2 border-red-500 rounded-none p-3"
                            >
                                <p className="text-red-700 text-sm font-semibold">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all duration-150 font-space" // Added font-space
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}