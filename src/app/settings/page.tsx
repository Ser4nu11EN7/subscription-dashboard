"use client"

import { useState } from "react"
import {
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Lock,
  Key,
  AlertTriangle,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
    navigation: "导航",
    chinese: "中文",
    english: "English",
    username: "登录",
    login: "登入",
    logout: "登出",
    userMenu: "用户菜单",
    accountSettings: "账户设置",
    systemSettings: "系统设置",
    settingsDescription: "管理您的账户偏好和安全设置",
    notifications: "通知设置",
    notificationsDesc: "控制您接收通知的方式和时间",
    emailNotifications: "邮件通知",
    pushNotifications: "推送通知",
    smsNotifications: "短信通知",
    weeklyReports: "周报",
    monthlyReports: "月报",
    expirationAlerts: "到期提醒",
    privacy: "隐私设置",
    privacyDesc: "管理您的数据隐私和可见性",
    usageStats: "使用统计",
    security: "安全设置",
    securityDesc: "保护您的账户安全",
    changePassword: "修改密码",
    twoFactorAuth: "双重认证",
    loginSessions: "登录会话",
    currentPassword: "当前密码",
    newPassword: "新密码",
    confirmPassword: "确认密码",
    dataManagement: "数据管理",
    dataDesc: "导出、导入或删除您的数据",
    exportData: "导出数据",
    importData: "导入数据",
    deleteAccount: "删除账户",
    language: "语言设置",
    theme: "主题设置",
    timezone: "时区设置",
    currency: "货币设置",
    dangerZone: "危险操作",
    dangerDesc: "这些操作无法撤销，请谨慎操作",
    saveChanges: "保存更改",
    changesSaved: "设置已保存",
    enabled: "已启用",
    disabled: "已禁用",
    public: "公开",
    private: "私有",
    friends: "仅好友",
    confirmDelete: "确认删除",
    deleteAccountWarning: "此操作将永久删除您的账户和所有数据，无法恢复。",
    cancel: "取消",
    delete: "删除",
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
    systemSettings: "System Settings",
    settingsDescription: "Manage your account preferences and security settings",
    notifications: "Notification Settings",
    notificationsDesc: "Control how and when you receive notifications",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    weeklyReports: "Weekly Reports",
    monthlyReports: "Monthly Reports",
    expirationAlerts: "Expiration Alerts",
    privacy: "Privacy Settings",
    privacyDesc: "Manage your data privacy and visibility",
    usageStats: "Usage Stats",
    security: "Security Settings",
    securityDesc: "Protect your account security",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    loginSessions: "Login Sessions",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    dataManagement: "Data Management",
    dataDesc: "Export, import, or delete your data",
    exportData: "Export Data",
    importData: "Import Data",
    deleteAccount: "Delete Account",
    language: "Language Settings",
    theme: "Theme Settings",
    timezone: "Timezone Settings",
    currency: "Currency Settings",
    dangerZone: "Danger Zone",
    dangerDesc: "These actions cannot be undone, please proceed with caution",
    saveChanges: "Save Changes",
    settingsSaved: "Settings Saved",
    enabled: "Enabled",
    disabled: "Disabled",
    public: "Public",
    private: "Private",
    friends: "Friends Only",
    confirmDelete: "Confirm Delete",
    deleteAccountWarning: "This action will permanently delete your account and all data, and cannot be recovered.",
    cancel: "Cancel",
    delete: "Delete",
  },
}

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [isSaved, setIsSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 设置状态
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReports: true,
      monthlyReports: true,
      expirationAlerts: true,
    },
    privacy: {
      analyticsTracking: true,
    },
    security: {
      twoFactorAuth: false,
    },
    preferences: {
      language: "zh",
      theme: "light",
      timezone: "Asia/Shanghai",
      currency: "CNY",
    },
  })

  // 密码表单
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // 翻译函数
  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.zh] || key
  }

  // 语言切换
  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  // 保存设置
  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // 更新通知设置
  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  // 更新隐私设置
  const updatePrivacySetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  // 导出数据
  const handleExportData = () => {
    console.log("Exporting data...")
  }

  // 导入数据
  const handleImportData = () => {
    console.log("Importing data...")
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
                      {t("systemSettings")}
                    </h1>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {t("settingsDescription")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isSaved && (
                    <Badge variant="default" className="bg-green-600">
                      {t("changesSaved")}
                    </Badge>
                  )}
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    {t("saveChanges")}
                  </Button>
                </div>
              </div>
            </header>

            {/* 主要内容 */}
            <main className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 通知设置 */}
                <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <Bell className="w-5 h-5" />
                      {t("notifications")}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                      {t("notificationsDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <Label className={isDarkMode ? "text-gray-200" : ""}>{t("emailNotifications")}</Label>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateNotificationSetting("email", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <Label className={isDarkMode ? "text-gray-200" : ""}>{t("pushNotifications")}</Label>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateNotificationSetting("push", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className={isDarkMode ? "text-gray-200" : ""}>{t("weeklyReports")}</Label>
                      <Switch
                        checked={settings.notifications.weeklyReports}
                        onCheckedChange={(checked) => updateNotificationSetting("weeklyReports", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className={isDarkMode ? "text-gray-200" : ""}>{t("expirationAlerts")}</Label>
                      <Switch
                        checked={settings.notifications.expirationAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting("expirationAlerts", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 隐私设置 */}
                <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <Shield className="w-5 h-5" />
                      {t("privacy")}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : ""}>{t("privacyDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className={isDarkMode ? "text-gray-200" : ""}>{t("usageStats")}</Label>
                      <Switch
                        checked={settings.privacy.analyticsTracking}
                        onCheckedChange={(checked) => updatePrivacySetting("analyticsTracking", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 安全设置 */}
                <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <Lock className="w-5 h-5" />
                      {t("security")}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : ""}>{t("securityDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className={isDarkMode ? "text-gray-200" : ""}>{t("changePassword")}</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("currentPassword")}
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        <Input
                          type="password"
                          placeholder={t("newPassword")}
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                        />
                        <Input
                          type="password"
                          placeholder={t("confirmPassword")}
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <Label className={isDarkMode ? "text-gray-200" : ""}>{t("twoFactorAuth")}</Label>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, twoFactorAuth: checked },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 数据管理 */}
                <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <Globe className="w-5 h-5" />
                      {t("dataManagement")}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : ""}>{t("dataDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      {t("exportData")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleImportData}>
                      <Upload className="w-4 h-4 mr-2" />
                      {t("importData")}
                    </Button>
                    <Separator />
                    <div
                      className={`p-4 rounded-lg border-2 border-dashed ${isDarkMode ? "border-red-800 bg-red-900/20" : "border-red-200 bg-red-50"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h4 className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                          {t("dangerZone")}
                        </h4>
                      </div>
                      <p className={`text-sm mb-3 ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                        {t("dangerDesc")}
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("deleteAccount")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                          <AlertDialogHeader>
                            <AlertDialogTitle className={isDarkMode ? "text-gray-100" : ""}>
                              {t("confirmDelete")}
                            </AlertDialogTitle>
                            <AlertDialogDescription className={isDarkMode ? "text-gray-300" : ""}>
                              {t("deleteAccountWarning")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">{t("delete")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
