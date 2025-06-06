import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      {" "}
      {/* Added scroll-smooth */}
      <Head>
        {/* Preconnect to Google Fonts if still used directly or by other libraries */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Space Mono is imported in globals.css, ensure it's efficient or consider self-hosting */}
        {/* Example for self-hosting Space Mono (if not using @import in CSS):
        <link href="/fonts/space-mono-v13-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link href="/fonts/space-mono-v13-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link href="/fonts/space-mono-v13-latin-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        */}
      </Head>
      <body className="bg-gray-100 text-black antialiased">
        {" "}
        {/* Base body styles */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
