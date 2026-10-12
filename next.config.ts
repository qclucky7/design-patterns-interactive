import type { NextConfig } from "next";
import path from "node:path";
import {networkInterfaces} from "node:os";

// Allow only this machine's actual private IPv4 addresses, not arbitrary origins.
const lanOrigins = Object.values(networkInterfaces()).flatMap(addresses =>
  (addresses ?? []).filter(address => address.family === "IPv4" && !address.internal &&
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address.address)
  ).map(address => address.address)
);

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: lanOrigins,
  // The standard next-intl plugin also configures this alias. Keep its
  // default behavior without loading @swc/core's native plugin dependency.
  turbopack: {resolveAlias: {"next-intl/config": "./src/i18n/request.ts"}},
  webpack(config) {
    config.resolve.alias["next-intl/config"] = path.resolve(process.cwd(), "src/i18n/request.ts");
    return config;
  },
};

export default nextConfig;
