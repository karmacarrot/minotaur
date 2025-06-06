/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: /node_modules([\\]+|\/)+(?!@karmacarrot)/,
    };
    return config;
  },
};
export default nextConfig;
