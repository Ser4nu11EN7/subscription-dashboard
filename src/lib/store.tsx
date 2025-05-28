"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserSubscriptions, Subscription, calculateSubscriptionStats } from './firebase-service';

// 全局状态类型定义
interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  stats: {
    totalSubscriptions: number;
    monthlySpending: number;
    activeSubscriptions: number;
    expiringSoon: number;
    annualSpending: number;
    averageMonthlyCost: number;
  };
  isDarkMode: boolean;
  language: "zh" | "en";
  selectedGroup: string;
  sortType: string;
}

// 全局操作类型定义
interface AppActions {
  setSubscriptions: (subscriptions: Subscription[]) => void;
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setLanguage: (language: "zh" | "en") => void;
  setSelectedGroup: (group: string) => void;
  setSortType: (sortType: string) => void;
  refreshData: () => Promise<void>;
  calculateStats: () => void;
}

// 创建全局状态上下文
const AppStateContext = createContext<AppState | undefined>(undefined);

// 创建全局操作上下文
const AppActionsContext = createContext<AppActions | undefined>(undefined);

// 初始状态
const initialState: AppState = {
  isLoggedIn: false,
  user: null,
  subscriptions: [],
  loading: true,
  error: null,
  stats: {
    totalSubscriptions: 0,
    monthlySpending: 0,
    activeSubscriptions: 0,
    expiringSoon: 0,
    annualSpending: 0,
    averageMonthlyCost: 0
  },
  isDarkMode: false,
  language: "zh",
  selectedGroup: "all",
  sortType: "custom"
};

// 提供者组件
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // 监听认证状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isLoggedIn = user !== null;
      setState(prev => ({
        ...prev,
        isLoggedIn,
        user,
        loading: false
      }));

      // 如果用户已登录，获取其订阅数据
      if (user) {
        try {
          const subscriptions = await getUserSubscriptions(user.uid);
          setState(prev => {
            const newState = {
              ...prev,
              subscriptions
            };
            return newState;
          });
          calculateStats(); // 计算统计数据
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: '加载订阅数据失败'
          }));
        }
      }
    });

    // 初始化语言和主题
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
      const savedLanguage = localStorage.getItem('language') as "zh" | "en" || "zh";
      setState(prev => ({
        ...prev,
        isDarkMode: savedDarkMode,
        language: savedLanguage
      }));
    }

    return () => unsubscribe();
  }, []);

  // 计算统计数据
  const calculateStats = () => {
    // 如果没有订阅数据，使用默认值
    if (state.subscriptions.length === 0) {
      return;
    }

    // 计算总订阅数
    const totalSubscriptions = state.subscriptions.length;
    
    // 计算月度支出
    let monthlySpending = 0;
    let activeSubscriptions = 0;
    let expiringSoon = 0;
    
    const today = new Date();
    
    state.subscriptions.forEach(sub => {
      // 活跃订阅计数
      if (sub.autoRenew) {
        activeSubscriptions++;
      }
      
      // 计算距离下次账单的天数
      const nextBillingDate = new Date(sub.nextBilling);
      const daysUntilBilling = Math.ceil(
        (nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // 7天内到期的订阅
      if (daysUntilBilling <= 7 && daysUntilBilling > 0) {
        expiringSoon++;
      }
      
      // 计算月度支出
      if (sub.billingCycle === 'monthly') {
        monthlySpending += sub.cost;
      } else if (sub.billingCycle === 'yearly') {
        monthlySpending += sub.cost / 12;
      } else if (sub.billingCycle === 'quarterly') {
        monthlySpending += sub.cost / 3;
      } else if (sub.billingCycle === 'semiannually') {
        monthlySpending += sub.cost / 6;
      }
    });
    
    // 计算年度支出
    const annualSpending = monthlySpending * 12;
    
    // 四舍五入到两位小数
    monthlySpending = parseFloat(monthlySpending.toFixed(2));
    const averageMonthlyCost = parseFloat((monthlySpending / totalSubscriptions).toFixed(2));
    
    setState(prev => ({
      ...prev,
      stats: {
        totalSubscriptions,
        monthlySpending,
        activeSubscriptions,
        expiringSoon,
        annualSpending: parseFloat(annualSpending.toFixed(2)),
        averageMonthlyCost: isNaN(averageMonthlyCost) ? 0 : averageMonthlyCost
      }
    }));
  };

  // 刷新数据
  const refreshData = async () => {
    if (!state.user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const subscriptions = await getUserSubscriptions(state.user.uid);
      setState(prev => ({ 
        ...prev, 
        subscriptions, 
        loading: false 
      }));
      calculateStats();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '刷新数据失败',
        loading: false
      }));
    }
  };

  // 定义操作
  const actions: AppActions = {
    setSubscriptions: (subscriptions) => {
      setState(prev => ({ ...prev, subscriptions }));
      calculateStats();
    },
    
    addSubscription: (subscription) => {
      setState(prev => ({
        ...prev,
        subscriptions: [...prev.subscriptions, subscription]
      }));
      calculateStats();
    },
    
    updateSubscription: (id, updatedSubscription) => {
      setState(prev => ({
        ...prev,
        subscriptions: prev.subscriptions.map(sub => 
          sub.id === id ? { ...sub, ...updatedSubscription } : sub
        )
      }));
      calculateStats();
    },
    
    deleteSubscription: (id) => {
      setState(prev => ({
        ...prev,
        subscriptions: prev.subscriptions.filter(sub => sub.id !== id)
      }));
      calculateStats();
    },
    
    setIsDarkMode: (isDarkMode) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isDarkMode', String(isDarkMode));
      }
      setState(prev => ({ ...prev, isDarkMode }));
    },
    
    setLanguage: (language) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
      }
      setState(prev => ({ ...prev, language }));
    },
    
    setSelectedGroup: (selectedGroup) => {
      setState(prev => ({ ...prev, selectedGroup }));
    },
    
    setSortType: (sortType) => {
      setState(prev => ({ ...prev, sortType }));
    },
    
    refreshData,
    calculateStats
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

// 自定义钩子便于使用状态
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

// 自定义钩子便于使用操作
export function useAppActions() {
  const context = useContext(AppActionsContext);
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
}

// 组合钩子
export function useAppContext() {
  return {
    ...useAppState(),
    ...useAppActions()
  };
} 