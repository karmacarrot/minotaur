/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
