// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // 如果你确实需要 Analytics
import firebaseConfig from "./firebase-config"; // 导入外部配置文件

// 注意：firebase-config.js 已添加到 .gitignore
// 当克隆代码库时，需要基于 firebase-config-example.js 创建自己的 firebase-config.js

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize desired Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // 如果你需要 Analytics

// Export the services you will use
export { auth, db }; //, analytics };