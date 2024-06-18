/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'standalone',
    webpack: (config) => {
        // This is not needed as of next 14
        // The below are required for the cardano serialization library
        // config.experiments.asyncWebAssembly = true;
        // config.experiments.topLevelAwait = true;
        // config.module.exprContextCritical = false;

        // Important: return the modified config
        return config;
    },
    images: {
        remotePatterns: [{ hostname: 'saturnswap.io' }, { hostname: 'saturn-swap.nyc3.cdn.digitaloceanspaces.com' }, { hostname: 'localhost' }],
    },
};

module.exports = nextConfig;
