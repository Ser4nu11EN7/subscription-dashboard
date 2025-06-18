/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 这是一个常见的默认设置，可以保留
  output: 'standalone', // <--- 这是你需要添加的关键配置
  // 如果你未来有其他配置，也可以加在这里
};

export default nextConfig;