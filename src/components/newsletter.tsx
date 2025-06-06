"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return; // Added trim() for email validation

    setStatus("loading");
    setMessage("");

    // Simulate API call
    try {
      // TODO: Replace with your actual newsletter API call
      // Example:
      // const response = await fetch('/api/subscribe-newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Subscription failed. Please try again.");
      // }
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      setStatus("success");
      setMessage("Thanks for subscribing! Please check your inbox to confirm."); // Clearer success message
      setEmail(""); // Clear email field on success
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-12 rounded-none border-2 border-black bg-yellow-100 p-6 font-space shadow-[6px_6px_0px_#000]"
    >
      <h2 className="mb-2 text-2xl font-black text-black">JOIN THE LIST</h2>
      <p className="mb-4 font-medium text-gray-800">
        Project updates, cool links, and maybe some bad jokes. Straight to your
        inbox. No spam, ever.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-start"
      >
        {" "}
        {/* items-stretch for equal height */}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="h-11 flex-1 text-base" // Ensure consistent height and text size
          required
          disabled={status === "loading"}
          aria-label="Email for newsletter"
        />
        <Button
          type="submit"
          disabled={status === "loading" || !email.trim()} // Disable if no email
          className="h-11 px-6 text-base" // Ensure consistent height, text size, and padding
          variant="default"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }} // mt-3
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-none border-2 p-2 text-sm font-bold
              ${status === "success" ? "border-green-600 bg-green-100 text-green-700" : ""}
              ${status === "error" ? "border-red-600 bg-red-100 text-red-700" : ""}`}
            role={status === "error" ? "alert" : "status"} // Add ARIA role
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
