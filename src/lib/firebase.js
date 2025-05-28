// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // 如果你确实需要 Analytics

// 尝试导入本地配置，如果不存在则使用环境变量
let firebaseConfig;
try {
  // 本地开发环境：从firebase-config.js导入
  const config = require("./firebase-config").default;
  firebaseConfig = config;
} catch (error) {
  // Vercel部署环境：使用环境变量
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
