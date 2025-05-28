# Vercel部署指南

本指南将帮助您正确配置并部署订阅管理仪表板应用到Vercel。

## 前置条件

确保您已经：

1. 创建了Firebase项目并设置了身份验证和Firestore数据库
2. 将代码推送到您的GitHub仓库

## 部署步骤

### 1. 连接GitHub仓库

1. 登录您的[Vercel账户](https://vercel.com/)
2. 点击"New Project"按钮
3. 导入您的GitHub仓库
4. 选择包含subscription-dashboard项目的仓库

### 2. 配置项目设置

Vercel应该自动检测到这是一个Next.js项目，但您可以检查并确认以下设置：

- **Framework Preset**: Next.js
- **Build Command**: `next build` (这应该是默认设置)
- **Output Directory**: `.next` (这应该是默认设置)
- **Node.js Version**: 18.x 或更高

如果Vercel未正确识别框架，您可以手动配置这些选项。

### 3. 设置环境变量

这是最关键的步骤，由于Firebase配置信息不应该直接提交到代码库中，我们需要在Vercel上设置这些环境变量：

1. 在项目设置中，导航到"Environment Variables"选项卡
2. 添加以下环境变量（从您的Firebase项目中获取这些值）：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id（可选）
```

3. 确保所有变量都添加到"Production"、"Preview"和"Development"环境中
4. 点击"Save"保存设置

### 4. 部署项目

1. 完成上述设置后，点击"Deploy"按钮
2. Vercel会从您的GitHub仓库拉取代码，并开始构建过程
3. 构建完成后，您将获得一个部署URL

## 故障排除

### "找不到'firebase-config.js'模块"错误

如果部署失败并出现找不到firebase-config.js的错误，请检查：

1. 确保在环境变量中设置了所有Firebase配置值
2. 验证项目中的`src/lib/firebase.js`文件是否正确处理环境变量回退

### TypeScript类型错误

如果部署失败并显示TypeScript错误，检查：

1. 错误消息中指出的组件文件
2. 确保组件属性与类型定义匹配

## 本地开发 vs. Vercel部署

在本地开发时，您可以使用`src/lib/firebase-config.js`文件（从`firebase-config-example.js`复制并填入您的值），但在Vercel部署中，应用将使用您设置的环境变量。

## 部署后验证

部署成功后：

1. 访问您的应用URL
2. 尝试注册/登录功能
3. 测试添加和管理订阅服务
4. 检查控制台中是否有任何错误

如需更多帮助，请参阅[Next.js部署文档](https://nextjs.org/docs/deployment)和[Vercel文档](https://vercel.com/docs)。 