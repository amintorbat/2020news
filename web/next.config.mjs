const isLocalEnvironment = !process.env.VERCEL;
if (process.env.npm_lifecycle_event === "build" && isLocalEnvironment) {
  process.env.ACS_SKIP = process.env.ACS_SKIP ?? "1";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: isLocalEnvironment,
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
        hostname: "2020news.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "trustseal.e-rasaneh.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
