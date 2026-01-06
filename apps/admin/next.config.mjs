import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingRoot: path.join(__dirname, "../.."),
    },
    transpilePackages: ["@oldmc/ui", "@oldmc/public-ui"],
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            resourceQuery: /raw/,
            type: 'asset/source',
        })
        return config;
    }
}

export default nextConfig;