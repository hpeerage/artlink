import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Drizzle 및 런타임 API 사용을 위해 정적 내보내기 비활성화 (Vercel 배포 권장)
  images: {
    unoptimized: true, 
  },
  trailingSlash: true, 
};

export default nextConfig;
