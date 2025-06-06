"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import BlogManager from "./blog-manager"
import ContentManager from "./content-manager"
import SecuritySettings from "./security-settings" // This will be the Supabase version if you integrate fully

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"blogs" | "content" | "security">("blogs")

  // This handleLogout is specific to this component if it doesn't use Supabase auth directly
  // If Supabase auth is handled at a higher level (like in pages/admin/dashboard.tsx), this might call that
  const handleLogout = () => {
    // localStorage.removeItem("admin_auth") // Remove if using Supabase auth fully
    onLogout()
  }

  const tabs = [
    { id: "blogs", label: "Blog Posts", icon: "📝" },
    { id: "content", label: "Website Content", icon: "🏠" },
    { id: "security", label: "Security", icon: "🔒" }, // This tab will render your Supabase MFA settings
  ]

  return (
    <div className="min-h-screen bg-gray-100 font-space"> {/* Added font-space */}
      <header className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-black font-semibold py-1 px-2 border-2 border-green-500 bg-green-100">🔒 MFA Enabled</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-none font-bold border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 font-space" // Added font-space
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-1 border-b-2 border-black pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "blogs" | "content" | "security")}
                className={`flex items-center space-x-2 py-2 px-4 font-bold text-sm border-2 border-b-0 rounded-t-none font-space
                  ${activeTab === tab.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-gray-200"
                  } transition-colors`} // Added font-space
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
          className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.1)]"
        >
          {activeTab === "blogs" && <BlogManager />}
          {activeTab === "content" && <ContentManager />}
          {activeTab === "security" && <SecuritySettings />}
        </motion.div>
      </div>
    </div>
  )
}