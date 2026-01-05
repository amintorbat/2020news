const isLocalEnvironment = !process.env.VERCEL;
if (process.env.npm_lifecycle_event === "build" && isLocalEnvironment) {
  process.env.ACS_SKIP = process.env.ACS_SKIP ?? "1";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: isLocalEnvironment,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "2020news.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "trustseal.e-rasaneh.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
