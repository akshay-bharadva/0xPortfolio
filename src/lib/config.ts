// Configuration for the application
export const config = {
  // Admin credentials - these will be set via environment variables
  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "",

  // MFA configuration
  mfa: {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "",
    accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME || "",
    issuer: process.env.NEXT_PUBLIC_APP_NAME || "",
  },

  // Site configuration
  site: {
    title: "Portfolio Website",
    description: "A modern portfolio website with blog functionality",
    url: process.env.NEXT_PUBLIC_SITE_URL || "",
  },

  // Session configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}
