// Firebase 安全规则配置指南
// 请登录 Firebase 控制台 (https://console.firebase.google.com/)，选择您的项目
// 然后前往 Firestore Database > Rules 标签页，粘贴以下规则

/*
// 开发阶段临时规则 - 允许所有读写操作（仅用于测试，生产环境不要使用）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

// 更安全的生产环境规则 - 用户只能操作自己的数据
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 订阅集合的规则
    match /subscriptions/{subscriptionId} {
      // 允许用户读取和写入自己的订阅
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // 允许创建订阅，但必须包含当前用户ID
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // 用户资料集合的规则
    match /users/{userId} {
      // 用户只能读取和修改自己的资料
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

// 如何临时解决权限问题
// 1. 登录Firebase控制台
// 2. 导航至Firestore Database > Rules
// 3. 暂时使用开发阶段规则（允许所有操作）
// 4. 完成测试后，替换为更安全的生产规则

console.log('请在Firebase控制台中设置适当的安全规则，以解决权限错误'); 