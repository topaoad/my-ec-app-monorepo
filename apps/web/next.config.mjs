/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      process.env.MICROCMS_IMAGEDOMAINS,
      process.env.GOOGLE_IMAGEDOMAINS,
      process.env.S3_IMAGEDOMAINS,
    ],
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_API_KEY: process.env.STRIPE_SECRET_API_KEY,
  },
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
};

export default nextConfig;
