import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

// 订阅集合名称
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

// 订阅类型定义
export interface Subscription {
  id?: string;
  name: string;
  hasNotes?: boolean;
  notes?: string;
  nextBilling: string;
  billingCycle: string;
  cost: number;
  currency: string;
  autoRenew: boolean;
  paidStatus: boolean;
  websiteUrl?: string;
  progress?: number;
  group?: string;
  daysUntilBilling?: number;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  userId?: string;
}

// 获取用户的所有订阅
export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  try {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Subscription));
  } catch (error) {
    console.error('获取订阅失败:', error);
    return [];
  }
};

// 添加新订阅
export const addSubscription = async (userId: string, subscription: Subscription): Promise<string | null> => {
  if (!userId) {
    console.error('用户未登录，无法添加订阅');
    return null;
  }

  try {
    const subscriptionWithMetadata = {
      ...subscription,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(
      collection(db, SUBSCRIPTIONS_COLLECTION), 
      subscriptionWithMetadata
    );
    return docRef.id;
  } catch (error) {
    console.error('添加订阅失败:', error);
    return null;
  }
};

// 更新订阅
export const updateSubscription = async (subscriptionId: string, subscription: Partial<Subscription>): Promise<boolean> => {
  try {
    const subscriptionRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await updateDoc(subscriptionRef, {
      ...subscription,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('更新订阅失败:', error);
    return false;
  }
};

// 删除订阅
export const deleteSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    const subscriptionRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await deleteDoc(subscriptionRef);
    return true;
  } catch (error) {
    console.error('删除订阅失败:', error);
    return false;
  }
};

// 获取单个订阅详情
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const subscriptionRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (subscriptionSnap.exists()) {
      return {
        id: subscriptionSnap.id,
        ...subscriptionSnap.data()
      } as Subscription;
    } else {
      return null;
    }
  } catch (error) {
    console.error('获取订阅详情失败:', error);
    return null;
  }
};

// 标记订阅为已支付
export const markSubscriptionAsPaid = async (subscriptionId: string): Promise<boolean> => {
  try {
    const subscriptionRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await updateDoc(subscriptionRef, {
      paidStatus: true,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('标记订阅状态失败:', error);
    return false;
  }
};

// 更新订阅自动续费状态
export const updateAutoRenewStatus = async (subscriptionId: string, autoRenew: boolean): Promise<boolean> => {
  try {
    const subscriptionRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
    await updateDoc(subscriptionRef, {
      autoRenew,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('更新自动续费状态失败:', error);
    return false;
  }
};

// 批量导入订阅数据
export const importSubscriptions = async (userId: string, subscriptions: Omit<Subscription, 'userId'>[]) => {
  if (!userId) {
    console.error('用户未登录，无法导入订阅');
    return false;
  }

  try {
    // 使用批量写入来提高性能
    const batch = subscriptions.map(async (subscription) => {
      const subscriptionWithMetadata = {
        ...subscription,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await addDoc(collection(db, SUBSCRIPTIONS_COLLECTION), subscriptionWithMetadata);
    });
    
    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('批量导入订阅失败:', error);
    return false;
  }
};

// 按组获取订阅
export const getSubscriptionsByGroup = async (userId: string, group: string): Promise<Subscription[]> => {
  try {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('userId', '==', userId),
      where('group', '==', group)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Subscription));
  } catch (error) {
    console.error('按组获取订阅失败:', error);
    return [];
  }
};

// 获取用户的所有订阅组
export const getUserSubscriptionGroups = async (userId: string): Promise<string[]> => {
  try {
    const subscriptions = await getUserSubscriptions(userId);
    const groupsSet = new Set<string>();
    
    subscriptions.forEach(subscription => {
      if (subscription.group) {
        groupsSet.add(subscription.group);
      }
    });
    
    return Array.from(groupsSet);
  } catch (error) {
    console.error('获取用户订阅组失败:', error);
    return [];
  }
};

// 计算用户订阅统计数据
export const calculateSubscriptionStats = async (userId: string) => {
  try {
    const subscriptions = await getUserSubscriptions(userId);
    
    // 计算总订阅数
    const totalSubscriptions = subscriptions.length;
    
    // 计算月度支出（假设所有费用都是按月计算的基础上）
    let monthlySpending = 0;
    let activeSubscriptions = 0;
    let expiringSoon = 0;
    
    const today = new Date();
    
    subscriptions.forEach(sub => {
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
    
    // 将月度支出四舍五入到两位小数
    monthlySpending = parseFloat(monthlySpending.toFixed(2));
    
    return {
      totalSubscriptions,
      monthlySpending,
      activeSubscriptions,
      expiringSoon,
      annualSpending: parseFloat(annualSpending.toFixed(2)),
      averageMonthlyCost: parseFloat((totalSubscriptions ? monthlySpending / totalSubscriptions : 0).toFixed(2))
    };
  } catch (error) {
    console.error('计算订阅统计数据失败:', error);
    return {
      totalSubscriptions: 0,
      monthlySpending: 0,
      activeSubscriptions: 0,
      expiringSoon: 0,
      annualSpending: 0,
      averageMonthlyCost: 0
    };
  }
}; 