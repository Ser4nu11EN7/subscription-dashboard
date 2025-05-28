"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// 翻译对象
const translations = {
  zh: {
    dashboard: "仪表盘",
    profile: "数据统计",
    statistics: "数据统计",
    settings: "设置",
    subscriptionManagement: "订阅管理",
    navigation: "导航",
    chinese: "中文",
    english: "English",
    username: "登录",
    login: "登入",
    logout: "登出",
    userMenu: "用户菜单",
    accountSettings: "账户设置",
    personalProfile: "数据统计",
    basicInfo: "基本信息",
    firstName: "名",
    lastName: "姓",
    email: "邮箱地址",
    phone: "电话号码",
    location: "所在地",
    bio: "个人简介",
    joinDate: "加入日期",
    accountStats: "订阅数据统计",
    totalSubscriptions: "总订阅数",
    monthlySpending: "月度支出",
    activeSubscriptions: "活跃订阅",
    expiringSoon: "即将到期",
    uploadAvatar: "上传头像",
    saveChanges: "保存更改",
    changesSaved: "更改已保存",
    profileDescription: "查看您的订阅数据统计和分析",
    bioPlaceholder: "介绍一下您自己...",
    locationPlaceholder: "例如：北京，中国",
    annualSpending: "年度支出",
    averageMonthlyCost: "平均每月费用",
  },
  en: {
    dashboard: "Dashboard",
    profile: "Statistics",
    statistics: "Statistics",
    settings: "Settings",
    subscriptionManagement: "Subscription Management",
    navigation: "Navigation",
    chinese: "中文",
    english: "English",
    username: "Login",
    login: "Login",
    logout: "Logout",
    userMenu: "User Menu",
    accountSettings: "Account Settings",
    personalProfile: "Statistics",
    basicInfo: "Basic Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    location: "Location",
    bio: "Bio",
    joinDate: "Join Date",
    accountStats: "Subscription Statistics",
    totalSubscriptions: "Total Subscriptions",
    monthlySpending: "Monthly Spending",
    activeSubscriptions: "Active Subscriptions",
    expiringSoon: "Expiring Soon",
    uploadAvatar: "Upload Avatar",
    saveChanges: "Save Changes",
    changesSaved: "Changes Saved",
    profileDescription: "View your subscription data statistics and analysis",
    bioPlaceholder: "Tell us about yourself...",
    locationPlaceholder: "e.g., Beijing, China",
    annualSpending: "Annual Spending",
    averageMonthlyCost: "Average Monthly Cost",
  },
}

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<"zh" | "en">("zh")

  // 账户统计数据
  const stats = {
    totalSubscriptions: 12,
    monthlySpending: 156.99,
    activeSubscriptions: 8,
    expiringSoon: 2,
    annualSpending: 1883.88,
    averageMonthlyCost: 156.99,
  }

  // 翻译函数
  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.zh] || key
  }

  // 语言切换
  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider>
        <AppSidebar language={language} onLanguageChange={toggleLanguage} t={t} />
        <SidebarInset>
          <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* 顶部操作栏 */}
            <header
              className={`border-b p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                      {t("personalProfile")}
                    </h1>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {t("profileDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* 主要内容 */}
            <main className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* 右侧：统计信息 */}
                <div className="space-y-6">
                  <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-gray-100" : ""}>{t("accountStats")}</CardTitle>
                      <CardDescription className={isDarkMode ? "text-gray-400" : ""}>您的订阅管理概览</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                            {stats.totalSubscriptions}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("totalSubscriptions")}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                            ${stats.monthlySpending}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("monthlySpending")}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-purple-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                            {stats.activeSubscriptions}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("activeSubscriptions")}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-orange-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                            {stats.expiringSoon}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("expiringSoon")}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-teal-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
                            ${stats.annualSpending}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("annualSpending")}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-lime-50"}`}>
                          <div className={`text-2xl font-bold ${isDarkMode ? "text-lime-400" : "text-lime-600"}`}>
                            ${stats.averageMonthlyCost}
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {t("averageMonthlyCost")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
