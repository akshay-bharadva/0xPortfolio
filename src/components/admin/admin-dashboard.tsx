"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogManager from "./blog-manager";
import ContentManager from "./content-manager";
import SecuritySettings from "./security-settings";
import { supabase } from "@/supabase/client";
import type { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit3, BarChart2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DashboardData } from "@/pages/admin/dashboard"; // Import the interface

interface AdminDashboardProps {
  onLogout: () => void;
  dashboardData: DashboardData;
}

type ActiveTab = "blogs" | "content" | "security" | "dashboard"; // Added "dashboard" tab
type InitialAction = "createBlogPost" | "createPortfolioSection" | null;

export default function AdminDashboard({ onLogout, dashboardData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard"); // Default to dashboard
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [initialAction, setInitialAction] = useState<InitialAction>(null);

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
    { id: "dashboard", label: "Overview", icon: "📊" },
    { id: "blogs", label: "Blog Posts", icon: "📝" },
    { id: "content", label: "Website Content", icon: "🏠" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  const handleQuickCreateBlogPost = () => {
    setActiveTab("blogs");
    setInitialAction("createBlogPost");
  };

  const handleQuickCreatePortfolioSection = () => {
    setActiveTab("content");
    setInitialAction("createPortfolioSection");
  };

  const handleActionCompleted = () => {
    setInitialAction(null); // Reset after action is handled by child
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon?: JSX.Element, bgColor?: string }> = ({ title, value, icon, bgColor = "bg-white" }) => (
    <div className={`rounded-none border-2 border-black p-4 shadow-[3px_3px_0px_#000] ${bgColor}`}>
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
            {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <p className="text-3xl font-black text-black mt-1">{value}</p>
    </div>
  );


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
                onClick={onLogout}
                className="rounded-none border-2 border-black bg-red-500 px-4 py-2 font-space font-bold text-white shadow-[2px_2px_0px_#000] transition-all duration-150 hover:translate-x-px hover:translate-y-px hover:bg-red-600 hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex flex-wrap gap-1 border-b-2 border-black pb-px sm:space-x-1"> {/* Added flex-wrap and gap */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  setInitialAction(null); // Clear initial action when manually changing tabs
                }}
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
        
        {activeTab === "dashboard" && (
            <motion.section
                key="dashboard-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                {/* Quick Stats Section */}
                <div>
                    <h2 className="mb-4 text-2xl font-black text-black">Site Overview</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted for 3 main stats */}
                        {!dashboardData.stats ? (
                            Array.from({length: 3}).map((_, i) => <div key={i} className="h-28 rounded-none border-2 border-black bg-gray-200 animate-pulse shadow-[3px_3px_0px_#000]"></div>)
                        ) : (
                        <>
                            <StatCard title="Total Blog Posts" value={dashboardData.stats.totalPosts} icon={<Edit3 />} bgColor="bg-yellow-100" />
                            <StatCard title="Portfolio Sections" value={dashboardData.stats.portfolioSections} icon={<BarChart2 />} bgColor="bg-indigo-100"/>
                            <StatCard title="Total Portfolio Items" value={dashboardData.stats.portfolioItems} bgColor="bg-green-100" />
                        </>
                        )}
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div>
                    <h3 className="mb-3 text-xl font-bold text-black">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={handleQuickCreateBlogPost} variant="default" size="default">
                            <PlusCircle className="mr-2 size-4" /> New Blog Post
                        </Button>
                        <Button onClick={handleQuickCreatePortfolioSection} variant="default" size="default">
                            <PlusCircle className="mr-2 size-4" /> New Portfolio Section
                        </Button>
                        <Link href="/ui" passHref legacyBehavior>
                            <Button asChild variant="outline" size="default">
                                <a><BarChart2 className="mr-2 size-4" /> View UI Kit</a>
                            </Button>
                        </Link>
                    </div>
                </div>
                
                {/* Recent Blog Posts Section */}
                {dashboardData.recentPosts.length > 0 && (
                    <div>
                        <h3 className="mb-3 text-xl font-bold text-black">Recently Updated Blog Posts</h3>
                        <div className="space-y-3 rounded-none border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                            {dashboardData.recentPosts.map(post => (
                                <div key={post.id} className="flex items-center justify-between rounded-none border border-gray-300 bg-gray-50 p-3 hover:bg-yellow-50">
                                    <div>
                                        <button
                                            onClick={() => {
                                                setActiveTab('blogs');
                                                // Future: scroll to this post or open editor directly
                                            }}
                                            className="text-left font-semibold text-black hover:text-indigo-700 hover:underline"
                                        >
                                            {post.title}
                                        </button>
                                        <p className="text-xs text-gray-500">
                                            Updated: {new Date(post.updated_at || "").toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                                            <Button asChild variant="ghost" size="sm" className="px-2 py-1 text-xs">
                                                <a target="_blank" rel="noopener noreferrer" aria-label={`View post: ${post.title}`}>
                                                   <ExternalLink className="size-3.5"/> View
                                                </a>
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="px-2 py-1 text-xs"
                                            onClick={() => { setActiveTab('blogs'); /* TODO: select post for editing */ }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.section>
        )}

        {activeTab !== "dashboard" && (
            <motion.div
            key={activeTab} // Ensure key changes for animation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_#000000]"
            >
            {activeTab === "blogs" && (
                <BlogManager 
                    startInCreateMode={initialAction === "createBlogPost"}
                    onActionHandled={handleActionCompleted}
                />
            )}
            {activeTab === "content" && (
                <ContentManager 
                    startInCreateMode={initialAction === "createPortfolioSection"}
                    onActionHandled={handleActionCompleted}
                />
            )}
            {activeTab === "security" && <SecuritySettings />}
            </motion.div>
        )}
      </div>
    </div>
  );
}