"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowRight, Shield, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { translations } from "@/lib/translations"
import { loginUser, registerUser, resetPassword } from "@/lib/auth-helpers"
import { syncLocalToFirebase, getSubscriptionsFromLocal } from "@/lib/sync-service"

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)

  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  // 重置密码表单状态
  const [resetForm, setResetForm] = useState({
    email: ""
  })

  // 检查主题设置
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("isDarkMode") === "true"
      setIsDarkMode(savedTheme)
      
      const savedLanguage = localStorage.getItem("language") as "zh" | "en"
      if (savedLanguage) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  // 翻译函数
  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.zh] || key
  }

  // 语言切换
  const toggleLanguage = () => {
    const newLanguage = language === "zh" ? "en" : "zh"
    setLanguage(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)
    }
  }

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setErrorMessage(t("invalidCredentials"))
      return
    }

    setIsLoading(true)
    setLoginStatus("idle")
    setErrorMessage("")

    try {
      const result = await loginUser(loginForm.email, loginForm.password)
      
      if (result.success) {
        setLoginStatus("success")
        
        // 保存登录状态
        if (loginForm.rememberMe && typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userEmail", loginForm.email)
        }
        
        // 同步本地数据到Firebase
        const localSubscriptions = getSubscriptionsFromLocal()
        if (localSubscriptions.length > 0) {
          await syncLocalToFirebase()
        }
        
        // 登录成功后跳转到主页
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        setLoginStatus("error")
        setErrorMessage(result.message)
      }
    } catch (error) {
      setLoginStatus("error")
      setErrorMessage(t("networkError"))
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理注册
  const handleRegister = async () => {
    // 验证表单
    if (!registerForm.email || !registerForm.password) {
      setErrorMessage(t("invalidCredentials"))
      return
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage(t("passwordsDoNotMatch") || "Passwords do not match")
      return
    }
    
    if (registerForm.password.length < 6) {
      setErrorMessage(t("passwordTooShort") || "Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const result = await registerUser(registerForm.email, registerForm.password)
      
      if (result.success) {
        // 注册成功，显示验证邮件提示并切换到登录模式
        setErrorMessage(result.message)
        setTimeout(() => {
          setIsRegisterMode(false)
          setLoginForm({
            ...loginForm,
            email: registerForm.email,
            password: ""
          })
        }, 2000)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage(t("registrationFailed"))
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理密码重置
  const handleResetPassword = async () => {
    if (!resetForm.email) {
      setErrorMessage(t("emailRequired") || "Email is required")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const result = await resetPassword(resetForm.email)
      
      if (result.success) {
        setErrorMessage(result.message)
        setTimeout(() => {
          setForgotPasswordMode(false)
        }, 2000)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage(t("passwordResetFailed") || "Failed to send password reset email")
      console.error("Password reset error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 跳过登录
  const handleSkipLogin = () => {
    window.location.href = "/"
  }

  // 以游客身份继续
  const handleGuestMode = () => {
    window.location.href = "/"
  }

  // 切换注册/登录模式
  const toggleRegisterMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setErrorMessage("")
    setLoginStatus("idle")
  }

  // 切换忘记密码模式
  const toggleForgotPasswordMode = () => {
    setForgotPasswordMode(!forgotPasswordMode)
    setErrorMessage("")
  }
  
  // 渲染登录表单
  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <button 
            type="button" 
            onClick={toggleForgotPasswordMode}
            className={`text-xs ${isDarkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}
          >
            {t("forgotPassword")}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={loginForm.rememberMe} 
          onCheckedChange={(checked) => 
            setLoginForm({ ...loginForm, rememberMe: checked === true })
          } 
        />
        <label
          htmlFor="remember"
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {t("rememberMe")}
        </label>
      </div>

      {errorMessage && (
        <div className={`text-sm ${loginStatus === "success" ? "text-green-500" : "text-red-500"}`}>
          {errorMessage}
        </div>
      )}

      <Button
        className={`w-full ${loginStatus === "success" ? "bg-green-600 hover:bg-green-700" : ""}`}
        onClick={handleLogin}
        disabled={isLoading || loginStatus === "success"}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="animate-spin">◌</span> {t("loggingIn") || "Logging in..."}
          </span>
        ) : loginStatus === "success" ? (
          <span className="flex items-center gap-1">
            <span>✓</span> {t("loginSuccess")}
          </span>
        ) : (
          t("loginButton")
        )}
      </Button>

      <div className="text-center">
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {t("noAccount")}{" "}
          <button
            onClick={toggleRegisterMode}
            className={`font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}
          >
            {t("createAccount")}
          </button>
        </p>
      </div>

      <div className="relative my-6">
        <div className={`absolute inset-0 flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <span className={`w-full ${isDarkMode ? "border-t border-gray-700" : "border-t border-gray-200"}`}></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={`px-2 ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
            {t("or")}
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleGuestMode}
      >
        {t("continueAsGuest")}
      </Button>
    </div>
  )
  
  // 渲染注册表单
  const renderRegisterForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email">{t("email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="register-email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">{t("password")}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder={t("confirmPassword")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>

      {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

      <Button
        className="w-full"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="animate-spin">◌</span> {t("registering") || "Registering..."}
          </span>
        ) : (
          t("createAccount")
        )}
      </Button>

      <div className="text-center">
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {t("alreadyHaveAccount") || "Already have an account?"}{" "}
          <button
            onClick={toggleRegisterMode}
            className={`font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}
          >
            {t("login")}
          </button>
        </p>
      </div>
    </div>
  )
  
  // 渲染忘记密码表单
  const renderForgotPasswordForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">{t("email")}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="reset-email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`pl-10 ${isDarkMode ? "bg-gray-700 text-gray-100" : ""}`}
            value={resetForm.email}
            onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
            required
          />
        </div>
      </div>

      {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

      <Button
        className="w-full"
        onClick={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <span className="animate-spin">◌</span> {t("sending") || "Sending..."}
          </span>
        ) : (
          t("resetPassword") || "Reset Password"
        )}
      </Button>

      <div className="text-center">
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          <button
            onClick={toggleForgotPasswordMode}
            className={`font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}
          >
            {t("backToLogin") || "Back to Login"}
          </button>
        </p>
      </div>
    </div>
  )

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider>
        <AppSidebar language={language} onLanguageChange={toggleLanguage} t={t} />
        <SidebarInset>
          <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
          >
            {/* 顶部操作栏 */}
            <header
              className={`border-b p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                      {isRegisterMode ? t("createAccount") : forgotPasswordMode ? t("resetPassword") || "Reset Password" : t("loginTitle")}
                    </h1>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {isRegisterMode 
                        ? t("registerDescription") || "Create an account to sync your subscription data across devices" 
                        : forgotPasswordMode 
                          ? t("resetPasswordDescription") || "Enter your email to receive password reset instructions"
                          : t("loginDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* 主要内容 */}
            <main className="p-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* 左侧：登录表单 */}
                  <div className="space-y-6">
                    <Card
                      className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm shadow-xl"} border-0`}
                    >
                      <CardHeader className="space-y-1 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-full ${isDarkMode ? "bg-blue-600" : "bg-blue-100"}`}>
                            {isRegisterMode ? (
                              <UserPlus className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-blue-600"}`} />
                            ) : forgotPasswordMode ? (
                              <Shield className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-blue-600"}`} />
                            ) : (
                              <LogIn className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-blue-600"}`} />
                            )}
                          </div>
                          <div>
                            <CardTitle className={`text-xl ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                              {isRegisterMode 
                                ? t("createAccount")
                                : forgotPasswordMode 
                                  ? t("resetPassword") || "Reset Password"
                                  : t("secureLogin")}
                            </CardTitle>
                            <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                              {isRegisterMode 
                                ? t("registerSubtitle") || "Join to sync your subscriptions across devices"
                                : forgotPasswordMode
                                  ? t("resetPasswordSubtitle") || "We'll send you instructions to reset your password"
                                  : t("dataSync")}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isRegisterMode 
                          ? renderRegisterForm() 
                          : forgotPasswordMode
                            ? renderForgotPasswordForm()
                            : renderLoginForm()}
                      </CardContent>
                    </Card>
                  </div>

                  {/* 右侧：特性介绍 */}
                  <div className="lg:block hidden space-y-6">
                    <Card
                      className={`${isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/60 backdrop-blur-sm"} border-0`}
                    >
                      <CardHeader>
                        <CardTitle className={isDarkMode ? "text-gray-100" : ""}>{t("benefits")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {Array.isArray(t("benefitsList")) &&
                            t("benefitsList").map((benefit, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div
                                  className={`mt-1 p-1 rounded-full ${
                                    isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  <CheckSquare className="w-4 h-4" />
                                </div>
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{benefit}</span>
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card
                      className={`${isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/60 backdrop-blur-sm"} border-0`}
                    >
                      <CardHeader>
                        <CardTitle className={isDarkMode ? "text-gray-100" : ""}>{t("guestMode")}</CardTitle>
                        <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                          {t("guestDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full" onClick={handleSkipLogin}>
                          {t("skipLogin")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
