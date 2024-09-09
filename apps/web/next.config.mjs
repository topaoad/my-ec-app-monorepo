/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.microcms-assets.io", "lh3.googleusercontent.com"],
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_API_KEY: process.env.STRIPE_SECRET_API_KEY,
  },
};

export default nextConfig;
