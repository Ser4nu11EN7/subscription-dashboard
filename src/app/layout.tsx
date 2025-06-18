// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'; // 直接导入初始化好的字体对象
import { GeistMono } from 'geist/font/mono';  // 直接导入初始化好的字体对象
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "订阅管理仪表盘",
  description: "管理您的所有订阅服务，追踪费用和到期日期",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 直接使用导入的 GeistSans 和 GeistMono 对象的 .variable 属性
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}