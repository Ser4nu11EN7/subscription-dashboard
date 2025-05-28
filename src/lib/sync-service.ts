import { Subscription, addSubscription, updateSubscription, deleteSubscription } from './firebase-service';
import { getCurrentUserId } from './auth-helpers';

// 存储在本地的订阅键
const LOCAL_SUBSCRIPTIONS_KEY = 'subscriptionData';

// 本地存储接口
interface LocalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// 本地存储适配器 (处理不可用的情况)
const localStorageAdapter: LocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('读取本地存储失败:', error);
      return null;
    }
  },
  
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('写入本地存储失败:', error);
    }
  },
  
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('删除本地存储失败:', error);
    }
  }
};

// 保存订阅到本地
export const saveSubscriptionsToLocal = (subscriptions: Subscription[]): void => {
  localStorageAdapter.setItem(LOCAL_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
};

// 从本地获取订阅
export const getSubscriptionsFromLocal = (): Subscription[] => {
  const data = localStorageAdapter.getItem(LOCAL_SUBSCRIPTIONS_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as Subscription[];
  } catch (error) {
    console.error('解析本地订阅数据失败:', error);
    return [];
  }
};

// 将本地订阅同步到Firebase
export const syncLocalToFirebase = async (): Promise<{ success: boolean; message: string }> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return { success: false, message: '用户未登录，无法同步' };
  }
  
  const localSubscriptions = getSubscriptionsFromLocal();
  if (localSubscriptions.length === 0) {
    return { success: true, message: '没有本地数据需要同步' };
  }
  
  try {
    // 创建同步操作的Promise数组
    const syncPromises = localSubscriptions.map(async (subscription) => {
      // 如果已经有ID，则尝试更新；否则添加为新记录
      if (subscription.id) {
        await updateSubscription(subscription.id, subscription);
      } else {
        await addSubscription(userId, subscription);
      }
    });
    
    // 等待所有同步操作完成
    await Promise.all(syncPromises);
    
    // 同步成功后，可以清除本地数据
    // localStorageAdapter.removeItem(LOCAL_SUBSCRIPTIONS_KEY);
    
    return { success: true, message: '本地数据同步到云端成功' };
  } catch (error) {
    console.error('同步本地数据到Firebase失败:', error);
    return { success: false, message: '同步数据失败，请稍后再试' };
  }
};

// 将本地数据与Firebase合并
export const mergeLocalAndFirebase = async (
  firebaseSubscriptions: Subscription[],
  localSubscriptions: Subscription[]
): Promise<Subscription[]> => {
  // 如果没有本地数据，直接使用Firebase数据
  if (localSubscriptions.length === 0) {
    return firebaseSubscriptions;
  }
  
  // 如果没有Firebase数据，直接使用本地数据
  if (firebaseSubscriptions.length === 0) {
    return localSubscriptions;
  }
  
  // 创建一个ID映射来检测重复项
  const idMap = new Map<string, Subscription>();
  
  // 先添加所有Firebase数据
  firebaseSubscriptions.forEach(subscription => {
    if (subscription.id) {
      idMap.set(subscription.id, subscription);
    }
  });
  
  // 然后添加或更新本地数据
  localSubscriptions.forEach(subscription => {
    if (subscription.id && idMap.has(subscription.id)) {
      // 本地版本比较新则更新
      const firebaseSub = idMap.get(subscription.id)!;
      const localUpdated = subscription.updatedAt ? new Date(subscription.updatedAt as any) : new Date(0);
      const firebaseUpdated = firebaseSub.updatedAt ? new Date(firebaseSub.updatedAt as any) : new Date(0);
      
      if (localUpdated > firebaseUpdated) {
        idMap.set(subscription.id, subscription);
      }
    } else if (subscription.id) {
      // 如果ID存在但Firebase中没有，添加它
      idMap.set(subscription.id, subscription);
    } else {
      // 如果没有ID，作为新项目添加
      // 为本地项目生成临时ID (实际添加到Firebase时会得到真实ID)
      const tempId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      subscription.id = tempId;
      idMap.set(tempId, subscription);
    }
  });
  
  // 转换回数组
  return Array.from(idMap.values());
};

// 处理脱机操作队列
interface OfflineOperation {
  type: 'add' | 'update' | 'delete';
  subscription: Subscription;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'subscriptionOfflineQueue';

// 添加操作到脱机队列
export const addToOfflineQueue = (operation: OfflineOperation): void => {
  const queue = getOfflineQueue();
  queue.push(operation);
  localStorageAdapter.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

// 获取脱机队列
export const getOfflineQueue = (): OfflineOperation[] => {
  const data = localStorageAdapter.getItem(OFFLINE_QUEUE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as OfflineOperation[];
  } catch (error) {
    console.error('解析脱机队列失败:', error);
    return [];
  }
};

// 清空脱机队列
export const clearOfflineQueue = (): void => {
  localStorageAdapter.removeItem(OFFLINE_QUEUE_KEY);
};

// 处理脱机队列
export const processOfflineQueue = async (): Promise<{ success: boolean; message: string; processed: number }> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return { success: false, message: '用户未登录，无法处理脱机队列', processed: 0 };
  }
  
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { success: true, message: '没有待处理的脱机操作', processed: 0 };
  }
  
  let processed = 0;
  let failed = 0;
  
  try {
    // 按照时间戳排序操作，确保按正确顺序处理
    queue.sort((a, b) => a.timestamp - b.timestamp);
    
    for (const operation of queue) {
      try {
        switch (operation.type) {
          case 'add':
            await addSubscription(userId, operation.subscription);
            break;
          case 'update':
            if (operation.subscription.id) {
              await updateSubscription(operation.subscription.id, operation.subscription);
            }
            break;
          case 'delete':
            if (operation.subscription.id) {
              await deleteSubscription(operation.subscription.id);
            }
            break;
        }
        processed++;
      } catch (error) {
        console.error(`处理脱机操作失败 [${operation.type}]:`, error);
        failed++;
      }
    }
    
    // 处理完成后清空队列
    clearOfflineQueue();
    
    const message = failed > 0 
      ? `处理了 ${processed} 个操作，${failed} 个操作失败` 
      : `成功处理了 ${processed} 个脱机操作`;
      
    return { success: processed > 0, message, processed };
  } catch (error) {
    console.error('处理脱机队列失败:', error);
    return { success: false, message: '处理脱机操作失败', processed };
  }
};

// 检测网络连接状态
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// 添加订阅 (处理在线/离线状态)
export const addSubscriptionWithSync = async (subscription: Subscription): Promise<{ success: boolean; message: string; id?: string }> => {
  const userId = getCurrentUserId();
  
  // 保存到本地
  const localSubscriptions = getSubscriptionsFromLocal();
  const tempId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const subscriptionWithId = { ...subscription, id: tempId };
  
  localSubscriptions.push(subscriptionWithId);
  saveSubscriptionsToLocal(localSubscriptions);
  
  // 如果在线且已登录，同步到Firebase
  if (isOnline() && userId) {
    try {
      const id = await addSubscription(userId, subscription);
      if (id) {
        // 更新本地存储中的ID
        const updatedLocalSubscriptions = getSubscriptionsFromLocal().map(s => 
          s.id === tempId ? { ...s, id } : s
        );
        saveSubscriptionsToLocal(updatedLocalSubscriptions);
        
        return { success: true, message: '订阅已添加并同步到云端', id };
      }
      
      return { success: true, message: '订阅已添加，但同步失败', id: tempId };
    } catch (error) {
      console.error('添加订阅到Firebase失败:', error);
      // 添加到脱机队列
      addToOfflineQueue({
        type: 'add',
        subscription: subscriptionWithId,
        timestamp: Date.now()
      });
      return { success: true, message: '订阅已添加到本地，将在恢复连接后同步', id: tempId };
    }
  } else {
    // 离线状态或未登录，添加到脱机队列
    if (userId) {
      addToOfflineQueue({
        type: 'add',
        subscription: subscriptionWithId,
        timestamp: Date.now()
      });
    }
    return { success: true, message: '订阅已添加到本地，将在恢复连接后同步', id: tempId };
  }
}; 