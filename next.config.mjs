/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            os: false,
            path: false,
            crypto: false,
        };
        return config;
    },
    turbopack: {},
};

export default nextConfig;