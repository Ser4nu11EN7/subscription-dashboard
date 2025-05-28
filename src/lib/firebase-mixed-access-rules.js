// Firebase 混合访问模式安全规则
// 适用于：无需强制登录但需保护个人数据的应用
// 请登录 Firebase 控制台 (https://console.firebase.google.com/) 设置这些规则

/**
 * 混合访问模式安全规则 - 复制下面的规则到Firebase控制台
 * 
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 全局函数：检查用户是否已认证
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 全局函数：检查是否是该资源的所有者
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // 全局函数：检查是否为管理员
    function isAdmin() {
      return isAuthenticated() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // 公开数据 - 任何人都可以读取的数据
    match /publicData/{document=**} {
      allow read: if true;  // 允许任何人读取
      allow write: if isAuthenticated() && isAdmin();  // 只有管理员可以写入
    }
    
    // 订阅数据 - 用户必须登录且只能操作自己的数据
    match /subscriptions/{subscriptionId} {
      allow read: if resource.data.isPublic == true || 
                   (isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin()));
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // 用户资料 - 只有本人可以完全访问
    match /users/{userId} {
      // 允许读取某些公开字段
      allow read: if request.auth.uid == userId || 
                   isAdmin() || 
                   (resource.data.publicProfile == true);
      
      // 只有本人可以创建和修改自己的资料
      allow create, update: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
    }
    
    // 设置数据 - 区分公开和私有
    match /settings/{settingId} {
      // 公开设置可以被任何人读取
      allow read: if resource.data.isPublic == true || 
                   (isAuthenticated() && (settingId == request.auth.uid || isAdmin()));
      
      // 私有设置只能被所有者修改
      allow write: if isAuthenticated() && (settingId == request.auth.uid || isAdmin());
    }
    
    // 应用信息 - 完全公开
    match /appInfo/{document} {
      allow read: if true;
      allow write: if isAuthenticated() && isAdmin();
    }
    
    // 管理员角色
    match /admins/{adminId} {
      allow read: if isAuthenticated() && request.auth.uid == adminId;
      // 只允许其他管理员添加或删除管理员
      allow write: if isAuthenticated() && isAdmin() && request.auth.uid != adminId;
    }
  }
}
 */

// 使用说明：
// 1. 登录Firebase控制台(https://console.firebase.google.com/)
// 2. 导航至Firestore Database > Rules
// 3. 复制上面注释中的规则并粘贴到规则编辑器中
// 4. 点击"发布"按钮使规则生效

// 数据结构设计建议：
// 1. 公开数据：存放在 publicData 集合中
// 2. 订阅数据：存放在 subscriptions 集合中，添加 isPublic 字段控制可见性
// 3. 用户资料：存放在 users 集合中，添加 publicProfile 字段控制公开信息
// 4. 设置数据：存放在 settings 集合中，添加 isPublic 字段区分公开和私有设置
// 5. 应用信息：存放在 appInfo 集合中，完全公开访问

console.log('混合访问模式的Firebase规则已准备就绪'); 