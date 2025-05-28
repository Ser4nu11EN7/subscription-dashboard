import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 启用环境变量
  env: {
    // Firebase配置环境变量在这里将被Vercel注入
  },
  // 确保构建输出清晰可见
  output: 'standalone',
  // 禁用默认的X-Powered-By头以提高安全性
  poweredByHeader: false,
};

export default nextConfig;
