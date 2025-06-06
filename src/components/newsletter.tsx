"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input" // Assuming Input is updated
import { Button } from "@/components/ui/button" // Assuming Button is updated

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    // Simulate API call for newsletter subscription
    try {
      // Replace with your actual newsletter API call
      // const response = await fetch('/api/subscribe-newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Subscription failed.");
      // }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred. Please try again.");
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-12 p-6 bg-yellow-100 border-2 border-black rounded-none shadow-[6px_6px_0px_#000]" // Neo-Brutalist container
    >
      <h2 className="text-2xl font-black text-black mb-2">JOIN THE LIST</h2> {/* Adjusted title */}
      <p className="text-gray-800 mb-4 font-medium"> {/* Adjusted text color and weight */}
        Project updates, cool links, and maybe some bad jokes. Straight to your inbox. No spam, ever.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-start">
        <Input // Using the styled Input component
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="flex-1 h-11" // Ensure Input styles are Neo-Brutalist
          required
          disabled={status === "loading"}
        />
        <Button // Using the styled Button component
          type="submit"
          disabled={status === "loading"}
          className="h-11" // Ensure Button styles are Neo-Brutalist
          variant="default" // Or your preferred brutalist variant
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-3 text-sm font-bold p-2 border-2 rounded-none
            ${status === "success" ? "bg-green-100 border-green-600 text-green-700" : ""}
            ${status === "error" ? "bg-red-100 border-red-600 text-red-700" : ""}`}
        >
          {message}
        </motion.p>
      )}
    </motion.section>
  )
}