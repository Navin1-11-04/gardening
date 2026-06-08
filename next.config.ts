/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS for 1 year (only in production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Limit referrer info sent to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features we don't need
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // DNS prefetch control
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Content Security Policy
          // NOTE: Adjust script-src if you add more third-party scripts
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Razorpay checkout + inline Next.js hydration
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com",
              // Styles: self + inline (Tailwind uses inline)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com data:",
              // Images: self + Cloudinary + Unsplash + Pinterest + data URIs
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://images.unsplash.com https://i.pinimg.com https://lh3.googleusercontent.com",
              // API calls: self + Razorpay + Cloudinary upload + Meta Graph
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://api.cloudinary.com https://graph.facebook.com",
              // Frames: Razorpay payment modal
              "frame-src https://api.razorpay.com https://checkout.razorpay.com",
              // Media
              "media-src 'self'",
              // Form actions: only self
              "form-action 'self'",
              // Base URI
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // API routes: allow cross-origin for the public ones
        source: "/api/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;