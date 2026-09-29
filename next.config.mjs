/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thumbnails come from arbitrary external platforms (x/instagram/tiktok/
    // youtube/reddit), so we can't pin a fixed set of hostnames up front.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
