/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // GitHub Pages adds a base path that matches the repository name
  // You'll need to update this with your actual repository name when deploying
  basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
  trailingSlash: true, // Recommended for GitHub Pages
};

export default nextConfig;

