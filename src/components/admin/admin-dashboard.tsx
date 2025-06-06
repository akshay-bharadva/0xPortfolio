"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogManager from "./blog-manager";
import ContentManager from "./content-manager";
import SecuritySettings from "./security-settings";
import { supabase } from "@/supabase/client"; // Import Supabase for AAL check

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveTab = "blogs" | "content" | "security";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("blogs");
  const [isMfaEnabled, setIsMfaEnabled] = useState(false); // Dynamic MFA status

  useEffect(() => {
    const checkMfaStatus = async () => {
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === "aal2") {
        setIsMfaEnabled(true);
      } else {
        setIsMfaEnabled(false);
      }
    };
    checkMfaStatus();
  }, []);

  const tabs = [
    { id: "blogs", label: "Blog Posts", icon: "📝" },
    { id: "content", label: "Website Content", icon: "🏠" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-space">
      <header className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              {isMfaEnabled && (
                <span className="rounded-none border-2 border-green-500 bg-green-100 px-2 py-1 text-sm font-semibold text-black shadow-[1px_1px_0px_#000]">
                  🔒 MFA Enabled
                </span>
              )}
              <button
                onClick={onLogout} // onLogout is already correctly passed to handle Supabase signOut
                className="rounded-none border-2 border-black bg-red-500 px-4 py-2 font-space font-bold text-white shadow-[2px_2px_0px_#000] transition-all duration-150 hover:translate-x-px hover:translate-y-px hover:bg-red-600 hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex space-x-1 border-b-2 border-black pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 rounded-t-none border-2 border-b-0 px-4 py-2 font-space text-sm font-bold
                  ${
                    activeTab === tab.id
                      ? "border-black bg-black text-white"
                      : "border-black bg-white text-black hover:bg-gray-200"
                  } transition-colors`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]"
        >
          {activeTab === "blogs" && <BlogManager />}
          {activeTab === "content" && <ContentManager />}
          {activeTab === "security" && <SecuritySettings />}
        </motion.div>
      </div>
    </div>
  );
}
