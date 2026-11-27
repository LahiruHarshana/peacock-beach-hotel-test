import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { CONTENT_SECURITY_POLICY_REPORT_ONLY } from "./src/lib/security/csp";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["swagger-ui-react"],
  images: {
    remotePatterns: cloudName
      ? [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${cloudName}/**`,
          },
        ]
      : [],
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Content-Security-Policy-Report-Only",
        value: CONTENT_SECURITY_POLICY_REPORT_ONLY,
      },
    ];
    if (process.env.APP_URL?.startsWith("https://")) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      });
    }
    return [{ source: "/(.*)", headers }];
  },
};

export default withNextIntl(nextConfig);
