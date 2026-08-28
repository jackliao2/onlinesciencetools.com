import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://onlinesciencetools.com";

/** Legacy hosts Google still crawls. Vercel must receive the request (DNS + domain). */
const HOST_ALIASES = [
  "www.onlinesciencetools.com",
  "m.onlinesciencetools.com",
  "mobile.onlinesciencetools.com",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    const hostAliases = HOST_ALIASES.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
    ]);

    return [
      ...hostAliases,
      // Legacy PHP problem-bank URLs → home (practice examples live on each /tools/* page)
      {
        source: "/problems",
        destination: "/",
        permanent: true,
      },
      {
        source: "/problems/:path*",
        destination: "/",
        permanent: true,
      },
      // Old mobile hostname also existed as a path prefix on the apex domain
      {
        source: "/mobile",
        destination: "/",
        permanent: true,
      },
      {
        source: "/mobile/tools/:path*",
        destination: "/tools/:path*",
        permanent: true,
      },
      {
        source: "/mobile/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/tools/colorpicker/Color_Converter.swf",
        destination: "/tools/colorpicker",
        permanent: true,
      },
      {
        source: "/Color_Converter.swf",
        destination: "/tools/colorpicker",
        permanent: true,
      },
      // Phase-1 placeholder slugs → historical paths
      {
        source: "/tools/chemistry-equation-balancer",
        destination: "/tools/balanceequation",
        permanent: true,
      },
      {
        source: "/tools/graphing-calculator",
        destination: "/tools/graphingcalculator",
        permanent: true,
      },
      {
        source: "/tools/number-system-converter",
        destination: "/tools/binarycalculator",
        permanent: true,
      },
      {
        source: "/tools/hex-color-picker",
        destination: "/tools/colorpicker",
        permanent: true,
      },
      {
        source: "/tools/html-executor",
        destination: "/tools/htmlexecutor",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
