/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // upload sampai 10 foto sekaligus
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
