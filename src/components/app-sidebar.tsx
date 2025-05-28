"use client"

import { useState } from "react"
import {
  BarChart3,
  User,
  Settings,
  Globe,
  LogOut,
  Home,
  LogIn,
  HelpCircle,
  Sparkles,
  Zap,
  Shield,
  Palette,
  X,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  language: string
  onLanguageChange: () => void
  t: (key: string) => string
}

const navigationItems = [
  {
    title: "dashboard",
    url: "/",
    icon: BarChart3,
    isLink: true,
  },
  {
    title: "statistics",
    url: "/profile",
    icon: User,
    isLink: true,
  },
  {
    title: "help",
    url: "#",
    icon: HelpCircle,
    isLink: false,
  },
  {
    title: "settings",
    url: "/settings",
    icon: Settings,
    isLink: true,
  },
]

export function AppSidebar({ language, onLanguageChange, t }: AppSidebarProps) {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  // 模拟登录状态检查 - 实际项目中应该从全局状态或localStorage获取
  const isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") === "true" : false

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // 登出逻辑
      localStorage.setItem("isLoggedIn", "false")
      window.location.reload()
    } else {
      // 跳转到登录页面
      window.location.href = "/username"
    }
  }

  const handleMenuItemClick = (item: (typeof navigationItems)[0]) => {
    if (item.title === "help") {
      setHelpDialogOpen(true)
    }
  }

  const helpContent = {
    zh: {
      title: "使用帮助",
      subtitle: "快速上手订阅管理系统",
      sections: [
        {
          title: "基本操作",
          icon: Sparkles,
          color: "bg-blue-500",
          textColor: "text-blue-600 dark:text-blue-400",
          items: [
            "点击「添加订阅」按钮来添加新的订阅服务",
            "使用分组和排序功能来管理您的订阅",
            "点击订阅卡片上的图标来执行快速操作",
          ],
        },
        {
          title: "订阅管理",
          icon: Zap,
          color: "bg-purple-500",
          textColor: "text-purple-600 dark:text-purple-400",
          items: [
            "🔄 自动续费：点击刷新图标开启/关闭自动续费",
            "✅ 支付状态：点击勾选图标标记为已支付",
            "🔗 访问官网：点击链接图标跳转到服务官网",
            "⋯ 更多操作：点击三点图标进行编辑、续费或删除",
          ],
        },
        {
          title: "进度条说明",
          icon: Shield,
          color: "bg-green-500",
          textColor: "text-green-600 dark:text-green-400",
          items: ["蓝色：距离下次扣费还有较长时间", "黄色：距离下次扣费7天内", "红色：距离下次扣费3天内，需要注意"],
        },
        {
          title: "快捷功能",
          icon: Palette,
          color: "bg-orange-500",
          textColor: "text-orange-600 dark:text-orange-400",
          items: ["拖拽订阅卡片可以自定义排序", "使用分组筛选查看特定类别的订阅", "切换深色/浅色主题适应不同使用环境"],
        },
      ],
    },
    en: {
      title: "Help Guide",
      subtitle: "Quick start with subscription management",
      sections: [
        {
          title: "Basic Operations",
          icon: Sparkles,
          color: "bg-blue-500",
          textColor: "text-blue-600 dark:text-blue-400",
          items: [
            "Click 'Add Subscription' button to add new subscription services",
            "Use group and sort functions to manage your subscriptions",
            "Click icons on subscription cards for quick actions",
          ],
        },
        {
          title: "Subscription Management",
          icon: Zap,
          color: "bg-purple-500",
          textColor: "text-purple-600 dark:text-purple-400",
          items: [
            "🔄 Auto-renewal: Click refresh icon to enable/disable auto-renewal",
            "✅ Payment status: Click check icon to mark as paid",
            "🔗 Visit website: Click link icon to go to service website",
            "⋯ More actions: Click three-dot icon to edit, renew or delete",
          ],
        },
        {
          title: "Progress Bar Guide",
          icon: Shield,
          color: "bg-green-500",
          textColor: "text-green-600 dark:text-green-400",
          items: [
            "Blue: Long time until next billing",
            "Yellow: Within 7 days of next billing",
            "Red: Within 3 days of next billing, attention needed",
          ],
        },
        {
          title: "Quick Features",
          icon: Palette,
          color: "bg-orange-500",
          textColor: "text-orange-600 dark:text-orange-400",
          items: [
            "Drag subscription cards to customize order",
            "Use group filter to view specific categories",
            "Toggle dark/light theme for different environments",
          ],
        },
      ],
    },
  }

  const currentHelpContent = helpContent[language as keyof typeof helpContent]

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">{t("subscriptionManagement")}</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.isLink ? (
                      <SidebarMenuButton asChild isActive={false}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{t(item.title)}</span>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton onClick={() => handleMenuItemClick(item)}>
                        <item.icon />
                        <span>{t(item.title)}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* 语言切换 */}
              <SidebarMenuButton onClick={onLanguageChange}>
                <Globe />
                <span>{language === "zh" ? t("chinese") : t("english")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              {/* 登录/登出按钮 */}
              <SidebarMenuButton onClick={handleAuthAction}>
                {isLoggedIn ? <LogOut /> : <LogIn />}
                <span>{isLoggedIn ? t("logout") : t("login")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* 只有登录后才显示用户菜单 */}
            {isLoggedIn && (
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User />
                      <span>{t("userMenu")}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem>
                      <a href="/profile" className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        <span>{t("statistics")}</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="/settings" className="flex items-center w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        <span>{t("accountSettings")}</span>
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent
          className="max-w-4xl max-h-[85vh] overflow-hidden p-0 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/60 border border-white/40 dark:border-gray-700/40 shadow-2xl"
          hideCloseButton={true}
        >
          {/* 装饰性背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl" />

          {/* 自定义关闭按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHelpDialogOpen(false)}
            className="absolute top-4 right-4 z-20 h-8 w-8 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>

          <div className="relative z-10">
            {/* 紧凑的头部区域 */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <div className="p-3 rounded-full bg-blue-600 shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center px-6 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentHelpContent.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{currentHelpContent.subtitle}</p>
            </div>

            {/* 内容区域 - 两列布局 */}
            <div className="px-6 pb-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentHelpContent.sections.map((section, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/60 dark:border-gray-700/60 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                  >
                    {/* 章节标题 */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${section.color} shadow-sm`}>
                        <section.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-base font-semibold ${section.textColor}`}>{section.title}</h3>
                    </div>

                    {/* 内容列表 */}
                    <ul className="space-y-2 pl-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${section.color} mt-1.5 flex-shrink-0`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
