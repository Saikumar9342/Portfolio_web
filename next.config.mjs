/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack: (config, { dev }) => {
        // Avoid intermittent ENOENT issues on local webpack pack cache files.
        // Keep production unchanged.
        if (dev) {
            config.cache = { type: "memory" };
        }
        return config;
    },
};

export default nextConfig;
