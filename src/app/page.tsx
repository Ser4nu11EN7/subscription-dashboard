"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  ChevronDown,
  Sun,
  Moon,
  GripVertical,
  AlertCircle,
  RefreshCw,
  CheckSquare,
  ExternalLink,
  MoreVertical,
  Edit3,
  Trash2,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AppSidebar } from "@/components/app-sidebar"

// 翻译对象
const translations = {
  zh: {
    dashboard: "仪表盘",
    profile: "数据统计",
    statistics: "数据统计",
    settings: "设置",
    subscriptionManagement: "订阅管理",
    addSubscription: "添加订阅",
    group: "分组",
    sort: "排序",
    allGroups: "所有分组",
    productivity: "生产力工具",
    entertainment: "娱乐",
    customDragSort: "自定义拖拽排序",
    sortByNameAZ: "按名称 (A-Z)",
    sortByNameZA: "按名称 (Z-A)",
    sortByDateNearest: "按下次扣费日期 (最近优先)",
    sortByDateFarthest: "按下次扣费日期 (最远优先)",
    sortByCostHighLow: "按费用 (高到低)",
    sortByCostLowHigh: "按费用 (低到高)",
    sortByAddedNewest: "按添加日期 (最新优先)",
    sortByAddedOldest: "按添加日期 (最旧优先)",
    nextBilling: "下次扣费：",
    perMonth: "/月",
    perYear: "/年",
    autoRenewOn: "已开启自动续费",
    autoRenewOff: "已关闭自动续费",
    paid: "已支付",
    markAsPaid: "标记为已支付",
    visitWebsite: "访问官网",
    edit: "编辑",
    renew: "续费/标记已续订",
    delete: "删除",
    editSubscription: "编辑订阅",
    renewSubscription: "续费订阅",
    deleteSubscription: "删除订阅",
    confirmDelete: "确认删除",
    deleteConfirmMessage: "您确定要删除这个订阅吗？此操作无法撤销。",
    cancel: "取消",
    confirm: "确认",
    save: "保存",
    add: "添加",
    subscriptionName: "订阅名称",
    cost: "费用",
    currency: "货币",
    billingCycle: "账单周期",
    monthly: "每月",
    yearly: "每年",
    nextBillingDate: "下次扣费日期",
    websiteUrl: "官网地址",
    notes: "备注",
    toggleDarkTheme: "切换到深色主题",
    toggleLightTheme: "切换到浅色主题",
    chinese: "中文",
    english: "English",
    login: "登入",
    logout: "登出",
    userMenu: "用户菜单",
    accountSettings: "账户设置",
    daysRemaining: "剩余 {days} 天 ({percentage}%)",
    username: "用户名",
    clickAddSubscription: '点击"{addSubscription}"来添加更多订阅服务',
    navigation: "导航",
    selectGroup: "选择分组",
    optional: "可选",
    quarterly: "每季度",
    semiannually: "每半年",
    perQuarter: "/季度",
    perSemiannual: "/半年",
    help: "帮助",
  },
  en: {
    dashboard: "Dashboard",
    profile: "Statistics",
    statistics: "Statistics",
    settings: "Settings",
    subscriptionManagement: "Subscription Management",
    addSubscription: "Add Subscription",
    group: "Group",
    sort: "Sort",
    allGroups: "All Groups",
    productivity: "Productivity Tools",
    entertainment: "Entertainment",
    customDragSort: "Custom Drag Sort",
    sortByNameAZ: "Sort by Name (A-Z)",
    sortByNameZA: "Sort by Name (Z-A)",
    sortByDateNearest: "Sort by Next Billing (Nearest)",
    sortByDateFarthest: "Sort by Next Billing (Farthest)",
    sortByCostHighLow: "Sort by Cost (High to Low)",
    sortByCostLowHigh: "Sort by Cost (Low to High)",
    sortByAddedNewest: "Sort by Added Date (Newest)",
    sortByAddedOldest: "Sort by Added Date (Oldest)",
    nextBilling: "Next billing: ",
    perMonth: "/month",
    perYear: "/year",
    autoRenewOn: "Auto-renewal enabled",
    autoRenewOff: "Auto-renewal disabled",
    paid: "Paid",
    markAsPaid: "Mark as paid",
    visitWebsite: "Visit website",
    edit: "Edit",
    renew: "Renew/Mark as renewed",
    delete: "Delete",
    editSubscription: "Edit Subscription",
    renewSubscription: "Renew Subscription",
    deleteSubscription: "Delete Subscription",
    confirmDelete: "Confirm Delete",
    deleteConfirmMessage: "Are you sure you want to delete this subscription? This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    add: "Add",
    subscriptionName: "Subscription Name",
    cost: "Cost",
    currency: "Currency",
    billingCycle: "Billing Cycle",
    monthly: "Monthly",
    yearly: "Yearly",
    nextBillingDate: "Next Billing Date",
    websiteUrl: "Website URL",
    notes: "Notes",
    toggleDarkTheme: "Switch to dark theme",
    toggleLightTheme: "Switch to light theme",
    chinese: "中文",
    english: "English",
    login: "Login",
    logout: "Logout",
    userMenu: "User Menu",
    accountSettings: "Account Settings",
    daysRemaining: "{days} days remaining ({percentage}%)",
    username: "Username",
    clickAddSubscription: 'Click "{addSubscription}" to add more subscription services',
    navigation: "Navigation",
    selectGroup: "Select Group",
    optional: "Optional",
    quarterly: "Quarterly",
    semiannually: "Semi-annually",
    perQuarter: "/quarter",
    perSemiannual: "/6 months",
    help: "Help",
  },
}

// 模拟订阅数据
const initialSubscriptions = [
  {
    id: 1,
    name: "Cursor",
    hasNotes: true,
    notes: "AI代码编辑器，提高开发效率",
    nextBilling: "2024-02-15",
    billingCycle: "monthly",
    cost: 20,
    currency: "USD",
    autoRenew: true,
    paidStatus: true,
    websiteUrl: "https://cursor.sh",
    progress: 75,
    daysRemaining: 8,
    addedDate: "2024-01-01",
    group: "生产力工具",
  },
  {
    id: 2,
    name: "Netflix",
    hasNotes: false,
    notes: "",
    nextBilling: "2024-01-28",
    billingCycle: "monthly",
    cost: 15.99,
    currency: "USD",
    autoRenew: true,
    paidStatus: false,
    websiteUrl: "https://netflix.com",
    progress: 90,
    daysRemaining: 3,
    addedDate: "2024-01-15",
    group: "娱乐",
  },
  {
    id: 3,
    name: "Spotify",
    hasNotes: true,
    notes: "音乐流媒体服务",
    nextBilling: "2024-03-01",
    billingCycle: "monthly",
    cost: 9.99,
    currency: "USD",
    autoRenew: false,
    paidStatus: true,
    websiteUrl: "https://spotify.com",
    progress: 45,
    daysRemaining: 15,
    addedDate: "2024-01-10",
    group: "娱乐",
  },
  {
    id: 4,
    name: "GitHub Pro",
    hasNotes: false,
    notes: "",
    nextBilling: "2024-02-20",
    billingCycle: "monthly",
    cost: 4,
    currency: "USD",
    autoRenew: true,
    paidStatus: true,
    websiteUrl: "https://github.com",
    progress: 60,
    daysRemaining: 12,
    addedDate: "2024-01-05",
    group: "生产力工具",
  },
]

// 货币符号映射
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
}

function SubscriptionCard({
  subscription,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  onEdit,
  onRenew,
  onDelete,
  isDarkMode,
  language,
  t,
}: {
  subscription: (typeof initialSubscriptions)[0]
  onDragStart: (e: React.DragEvent, id: number) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, id: number) => void
  isDragging: boolean
  onEdit: (subscription: (typeof initialSubscriptions)[0]) => void
  onRenew: (subscription: (typeof initialSubscriptions)[0]) => void
  onDelete: (subscription: (typeof initialSubscriptions)[0]) => void
  isDarkMode: boolean
  language: string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const [autoRenew, setAutoRenew] = useState(subscription.autoRenew)
  const [paidStatus, setPaidStatus] = useState(subscription.paidStatus)

  const getProgressColor = (progress: number, daysRemaining: number) => {
    if (daysRemaining <= 3) return "bg-red-500"
    if (daysRemaining <= 7) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getProgressBgColor = (progress: number, daysRemaining: number) => {
    if (daysRemaining <= 3) return isDarkMode ? "bg-red-900/30" : "bg-red-100"
    if (daysRemaining <= 7) return isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"
    return isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
  }

  return (
    <Card
      className={`p-4 hover:shadow-md transition-all ${isDragging ? "opacity-50 scale-95" : ""} ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, subscription.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, subscription.id)}
    >
      <div className="flex items-center gap-4">
        {/* 拖拽锚点 */}
        <div className="cursor-grab hover:cursor-grabbing">
          <GripVertical className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
        </div>

        {/* 订阅名称和备注 */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className={`font-medium truncate ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {subscription.name}
          </h3>
          {subscription.hasNotes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{subscription.notes}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* 订阅时间和进度条 - 调整宽度为200px，向左移动40px */}
        <div className="flex flex-col items-start w-[200px] -ml-10">
          <div className={`text-sm mb-1 w-full ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {t("nextBilling")}
            {subscription.nextBilling}
          </div>
          <div className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`w-full h-2 rounded-full ${getProgressBgColor(subscription.progress, subscription.daysRemaining)}`}
                  >
                    <div
                      className={`h-full rounded-full ${getProgressColor(subscription.progress, subscription.daysRemaining)}`}
                      style={{ width: `${subscription.progress}%` }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t("daysRemaining", {
                      days: subscription.daysRemaining.toString(),
                      percentage: subscription.progress.toString(),
                    })}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 费用 */}
        <div
          className={`text-lg font-semibold min-w-[100px] text-center ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
        >
          {currencySymbols[subscription.currency as keyof typeof currencySymbols] || subscription.currency}
          {subscription.cost}
          <span className={`text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {subscription.billingCycle === "monthly"
              ? t("perMonth")
              : subscription.billingCycle === "yearly"
                ? t("perYear")
                : subscription.billingCycle === "quarterly"
                  ? t("perQuarter")
                  : subscription.billingCycle === "semiannually"
                    ? t("perSemiannual")
                    : t("perMonth")}
          </span>
        </div>

        {/* 自动续费开关 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRenew(!autoRenew)}
                className={autoRenew ? "text-orange-500 hover:text-orange-600" : "text-gray-400"}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{autoRenew ? t("autoRenewOn") : t("autoRenewOff")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 已支付状态 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaidStatus(!paidStatus)}
                className={paidStatus ? "text-green-600" : "text-gray-400"}
              >
                <CheckSquare className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{paidStatus ? t("paid") : t("markAsPaid")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 官网跳转 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(subscription.websiteUrl, "_blank")}
                disabled={!subscription.websiteUrl}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("visitWebsite")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 更多操作菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(subscription)}>
              <Edit3 className="w-4 h-4 mr-2" />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRenew(subscription)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("renew")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(subscription)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [selectedGroup, setSelectedGroup] = useState("所有分组")
  const [selectedSort, setSelectedSort] = useState("自定义拖拽排序")
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  // 模态框状态
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState<(typeof initialSubscriptions)[0] | null>(null)

  // 表单状态
  const [form, setForm] = useState({
    name: "",
    cost: "",
    currency: "USD",
    billingCycle: "monthly",
    nextBilling: "",
    websiteUrl: "",
    notes: "",
    group: "生产力工具",
  })

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key as keyof typeof translations.zh] || key
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value.toString())
      })
    }
    return text
  }

  // 主题切换
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // 语言切换
  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
    // 更新分组和排序的显示文本
    if (language === "zh") {
      if (selectedGroup === "所有分组") setSelectedGroup("All Groups")
      if (selectedGroup === "生产力工具") setSelectedGroup("Productivity Tools")
      if (selectedGroup === "娱乐") setSelectedGroup("Entertainment")
    } else {
      if (selectedGroup === "All Groups") setSelectedGroup("所有分组")
      if (selectedGroup === "Productivity Tools") setSelectedGroup("生产力工具")
      if (selectedGroup === "Entertainment") setSelectedGroup("娱乐")
    }
  }

  // 拖拽处理函数
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault()

    if (draggedItem === null || draggedItem === targetId) return

    const draggedIndex = subscriptions.findIndex((sub) => sub.id === draggedItem)
    const targetIndex = subscriptions.findIndex((sub) => sub.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newSubscriptions = [...subscriptions]
    const [draggedSubscription] = newSubscriptions.splice(draggedIndex, 1)
    newSubscriptions.splice(targetIndex, 0, draggedSubscription)

    setSubscriptions(newSubscriptions)
    setDraggedItem(null)
  }

  // 排序处理函数
  const handleSort = (sortType: string) => {
    setSelectedSort(sortType)

    const sortedSubscriptions = [...subscriptions]

    switch (sortType) {
      case "按名称 (A-Z)":
      case "Sort by Name (A-Z)":
        sortedSubscriptions.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "按名称 (Z-A)":
      case "Sort by Name (Z-A)":
        sortedSubscriptions.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "按下次扣费日期 (最近优先)":
      case "Sort by Next Billing (Nearest)":
        sortedSubscriptions.sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime())
        break
      case "按下次扣费日期 (最远优先)":
      case "Sort by Next Billing (Farthest)":
        sortedSubscriptions.sort((a, b) => new Date(b.nextBilling).getTime() - new Date(a.nextBilling).getTime())
        break
      case "按费用 (高到低)":
      case "Sort by Cost (High to Low)":
        sortedSubscriptions.sort((a, b) => b.cost - a.cost)
        break
      case "按费用 (低到高)":
      case "Sort by Cost (Low to High)":
        sortedSubscriptions.sort((a, b) => a.cost - b.cost)
        break
      case "按添加日期 (最新优先)":
      case "Sort by Added Date (Newest)":
        sortedSubscriptions.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        break
      case "按添加日期 (最旧优先)":
      case "Sort by Added Date (Oldest)":
        sortedSubscriptions.sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())
        break
      default:
        // 自定义拖拽排序 - 保持当前顺序
        break
    }

    setSubscriptions(sortedSubscriptions)
  }

  // 重置表单
  const resetForm = () => {
    setForm({
      name: "",
      cost: "",
      currency: "USD",
      billingCycle: "monthly",
      nextBilling: "",
      websiteUrl: "",
      notes: "",
      group: "生产力工具",
    })
  }

  // 添加订阅功能
  const handleAdd = () => {
    resetForm()
    setAddDialogOpen(true)
  }

  const handleSaveAdd = () => {
    const newSubscription = {
      id: Math.max(...subscriptions.map((s) => s.id)) + 1,
      name: form.name,
      hasNotes: form.notes.length > 0,
      notes: form.notes,
      nextBilling: form.nextBilling,
      billingCycle: form.billingCycle,
      cost: Number.parseFloat(form.cost),
      currency: form.currency,
      autoRenew: false,
      paidStatus: false,
      websiteUrl: form.websiteUrl,
      progress: 0,
      daysRemaining:
        form.billingCycle === "monthly"
          ? 30
          : form.billingCycle === "quarterly"
            ? 90
            : form.billingCycle === "semiannually"
              ? 180
              : 365,
      addedDate: new Date().toISOString().split("T")[0],
      group: form.group,
    }

    setSubscriptions([...subscriptions, newSubscription])
    setAddDialogOpen(false)
    resetForm()
  }

  // 编辑功能
  const handleEdit = (subscription: (typeof initialSubscriptions)[0]) => {
    setCurrentSubscription(subscription)
    setForm({
      name: subscription.name,
      cost: subscription.cost.toString(),
      currency: subscription.currency,
      billingCycle: subscription.billingCycle,
      nextBilling: subscription.nextBilling,
      websiteUrl: subscription.websiteUrl,
      notes: subscription.notes,
      group: subscription.group,
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (currentSubscription) {
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === currentSubscription.id
            ? {
                ...sub,
                name: form.name,
                cost: Number.parseFloat(form.cost),
                currency: form.currency,
                billingCycle: form.billingCycle,
                nextBilling: form.nextBilling,
                websiteUrl: form.websiteUrl,
                notes: form.notes,
                hasNotes: form.notes.length > 0,
                group: form.group,
              }
            : sub,
        ),
      )
    }
    setEditDialogOpen(false)
    setCurrentSubscription(null)
    resetForm()
  }

  // 续费功能
  const handleRenew = (subscription: (typeof initialSubscriptions)[0]) => {
    setCurrentSubscription(subscription)
    setRenewDialogOpen(true)
  }

  const handleConfirmRenew = () => {
    if (currentSubscription) {
      const currentDate = new Date(currentSubscription.nextBilling)
      const newDate = new Date(currentDate)

      if (currentSubscription.billingCycle === "monthly") {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (currentSubscription.billingCycle === "quarterly") {
        newDate.setMonth(newDate.getMonth() + 3)
      } else if (currentSubscription.billingCycle === "semiannually") {
        newDate.setMonth(newDate.getMonth() + 6)
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1)
      }

      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === currentSubscription.id
            ? {
                ...sub,
                nextBilling: newDate.toISOString().split("T")[0],
                paidStatus: true,
                progress: 0,
                daysRemaining: currentSubscription.billingCycle === "monthly" ? 30 : 365,
              }
            : sub,
        ),
      )
    }
    setRenewDialogOpen(false)
    setCurrentSubscription(null)
  }

  // 删除功能
  const handleDelete = (subscription: (typeof initialSubscriptions)[0]) => {
    setCurrentSubscription(subscription)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (currentSubscription) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== currentSubscription.id))
    }
    setDeleteDialogOpen(false)
    setCurrentSubscription(null)
  }

  // 分组筛选
  const filteredSubscriptions =
    selectedGroup === "所有分组" || selectedGroup === "All Groups"
      ? subscriptions
      : subscriptions.filter((sub) => sub.group === selectedGroup)

  // 获取所有分组
  const allGroups =
    language === "zh"
      ? ["所有分组", ...Array.from(new Set(subscriptions.map((sub) => sub.group)))]
      : ["All Groups", "Productivity Tools", "Entertainment"]

  // 货币选项
  const currencyOptions = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
    { value: "CNY", label: "CNY (¥)" },
  ]

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

                  {/* 添加订阅按钮 */}
                  <Button
                    className={
                      isDarkMode ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-blue-600 hover:bg-blue-700"
                    }
                    onClick={handleAdd}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("addSubscription")}
                  </Button>

                  {/* 分组筛选 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {t("group")}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {allGroups.map((group) => (
                        <DropdownMenuItem key={group} onClick={() => setSelectedGroup(group)}>
                          {group}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* 排序 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {t("sort")}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleSort(t("customDragSort"))}>
                        {t("customDragSort")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByNameAZ"))}>
                        {t("sortByNameAZ")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByNameZA"))}>
                        {t("sortByNameZA")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByDateNearest"))}>
                        {t("sortByDateNearest")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByDateFarthest"))}>
                        {t("sortByDateFarthest")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByCostHighLow"))}>
                        {t("sortByCostHighLow")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByCostLowHigh"))}>
                        {t("sortByCostLowHigh")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByAddedNewest"))}>
                        {t("sortByAddedNewest")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort(t("sortByAddedOldest"))}>
                        {t("sortByAddedOldest")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* 当前筛选状态显示 */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="secondary">{selectedGroup}</Badge>
                    <Badge variant="outline">{selectedSort}</Badge>
                  </div>
                </div>

                {/* 主题切换按钮 */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isDarkMode ? t("toggleLightTheme") : t("toggleDarkTheme")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </header>

            {/* 订阅列表 */}
            <main className="p-6">
              <div className="space-y-4">
                {filteredSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={draggedItem === subscription.id}
                    onEdit={handleEdit}
                    onRenew={handleRenew}
                    onDelete={handleDelete}
                    isDarkMode={isDarkMode}
                    language={language}
                    t={t}
                  />
                ))}

                {/* 空白占位区域 - 可点击添加订阅 */}
                <div className="grid grid-cols-1 gap-4 mt-8">
                  <Card
                    className={`p-8 border-2 border-dashed cursor-pointer hover:border-blue-400 transition-colors ${
                      isDarkMode ? "border-gray-600 bg-gray-800 hover:bg-gray-750" : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={handleAdd}
                  >
                    <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>{t("clickAddSubscription").replace("{addSubscription}", t("addSubscription"))}</p>
                    </div>
                  </Card>
                </div>
              </div>
            </main>
          </div>

          {/* 添加订阅对话框 */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? "text-gray-100" : ""}>{t("addSubscription")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="add-name" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("subscriptionName")}
                  </Label>
                  <Input
                    id="add-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                    placeholder="Netflix, Spotify, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-cost" className={isDarkMode ? "text-gray-200" : ""}>
                      {t("cost")}
                    </Label>
                    <Input
                      id="add-cost"
                      type="number"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: e.target.value })}
                      className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                      placeholder="9.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-currency" className={isDarkMode ? "text-gray-200" : ""}>
                      {t("currency")}
                    </Label>
                    <Select value={form.currency} onValueChange={(value) => setForm({ ...form, currency: value })}>
                      <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-billingCycle" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("billingCycle")}
                  </Label>
                  <Select
                    value={form.billingCycle}
                    onValueChange={(value) => setForm({ ...form, billingCycle: value })}
                  >
                    <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                      <SelectItem value="semiannually">{t("semiannually")}</SelectItem>
                      <SelectItem value="yearly">{t("yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-nextBilling" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("nextBillingDate")}
                  </Label>
                  <Input
                    id="add-nextBilling"
                    type="date"
                    value={form.nextBilling}
                    onChange={(e) => setForm({ ...form, nextBilling: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="add-group" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("selectGroup")}
                  </Label>
                  <Select value={form.group} onValueChange={(value) => setForm({ ...form, group: value })}>
                    <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="生产力工具">
                        {language === "zh" ? "生产力工具" : "Productivity Tools"}
                      </SelectItem>
                      <SelectItem value="娱乐">{language === "zh" ? "娱乐" : "Entertainment"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-websiteUrl" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("websiteUrl")} ({t("optional")})
                  </Label>
                  <Input
                    id="add-websiteUrl"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="add-notes" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("notes")} ({t("optional")})
                  </Label>
                  <Textarea
                    id="add-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                    placeholder="备注信息..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleSaveAdd} disabled={!form.name || !form.cost || !form.nextBilling}>
                  {t("add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 编辑订阅对话框 */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? "text-gray-100" : ""}>{t("editSubscription")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("subscriptionName")}
                  </Label>
                  <Input
                    id="edit-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-cost" className={isDarkMode ? "text-gray-200" : ""}>
                      {t("cost")}
                    </Label>
                    <Input
                      id="edit-cost"
                      type="number"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: e.target.value })}
                      className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-currency" className={isDarkMode ? "text-gray-200" : ""}>
                      {t("currency")}
                    </Label>
                    <Select value={form.currency} onValueChange={(value) => setForm({ ...form, currency: value })}>
                      <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-billingCycle" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("billingCycle")}
                  </Label>
                  <Select
                    value={form.billingCycle}
                    onValueChange={(value) => setForm({ ...form, billingCycle: value })}
                  >
                    <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                      <SelectItem value="semiannually">{t("semiannually")}</SelectItem>
                      <SelectItem value="yearly">{t("yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-nextBilling" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("nextBillingDate")}
                  </Label>
                  <Input
                    id="edit-nextBilling"
                    type="date"
                    value={form.nextBilling}
                    onChange={(e) => setForm({ ...form, nextBilling: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-group" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("selectGroup")}
                  </Label>
                  <Select value={form.group} onValueChange={(value) => setForm({ ...form, group: value })}>
                    <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="生产力工具">
                        {language === "zh" ? "生产力工具" : "Productivity Tools"}
                      </SelectItem>
                      <SelectItem value="娱乐">{language === "zh" ? "娱乐" : "Entertainment"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-websiteUrl" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("websiteUrl")}
                  </Label>
                  <Input
                    id="edit-websiteUrl"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-notes" className={isDarkMode ? "text-gray-200" : ""}>
                    {t("notes")}
                  </Label>
                  <Textarea
                    id="edit-notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleSaveEdit}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 续费确认对话框 */}
          <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
            <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? "text-gray-100" : ""}>{t("renewSubscription")}</DialogTitle>
              </DialogHeader>
              <div className={`py-4 ${isDarkMode ? "text-gray-200" : ""}`}>
                <p>确认续费订阅 "{currentSubscription?.name}"？</p>
                <p className="text-sm text-gray-500 mt-2">下次扣费日期将更新为下个周期。</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRenewDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleConfirmRenew}>{t("confirm")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 删除确认对话框 */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <AlertDialogHeader>
                <AlertDialogTitle className={isDarkMode ? "text-gray-100" : ""}>{t("confirmDelete")}</AlertDialogTitle>
                <AlertDialogDescription className={isDarkMode ? "text-gray-300" : ""}>
                  {t("deleteConfirmMessage")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                  {t("confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
