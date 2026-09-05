import type { NextConfig } from "next";
import os from "node:os";

const lanOrigins = Object.values(os.networkInterfaces())
  .flatMap((interfaces) => interfaces ?? [])
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", ...lanOrigins],
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
