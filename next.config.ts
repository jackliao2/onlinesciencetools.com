import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
      {
        source: "/mobile/tools/:path*",
        destination: "/tools/:path*",
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
};

export default nextConfig;
