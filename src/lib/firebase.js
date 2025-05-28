// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // 如果你确实需要 Analytics

// 尝试导入本地配置，如果不存在则使用环境变量
let firebaseConfig;
try {
  // 本地开发环境：从firebase-config.js导入
  // 使用动态导入以避免构建时错误
  if (typeof window !== 'undefined') {
    const importedConfig = require("./firebase-config").default;
    if (importedConfig && importedConfig.apiKey) {
      firebaseConfig = importedConfig;
      console.log("Using local Firebase config");
    } else {
      throw new Error("Invalid local config");
    }
  } else {
    throw new Error("Server environment detected");
  }
} catch (error) {
  // Vercel部署环境或本地配置无效：使用环境变量
  console.log("Using environment variables for Firebase config");
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
  };
}

// 确认配置有效
if (!firebaseConfig || !firebaseConfig.apiKey) {
  console.warn("Firebase configuration is missing or invalid. App may not function correctly.");
  // 提供空配置以避免应用崩溃
  firebaseConfig = {
    apiKey: "dummy-api-key",
    authDomain: "dummy-project.firebaseapp.com",
    projectId: "dummy-project",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000"
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize desired Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // 如果你需要 Analytics

// Export the services you will use
export { auth, db }; //, analytics };
