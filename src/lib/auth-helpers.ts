import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  User,
  sendEmailVerification,
  updatePassword,
  AuthError
} from 'firebase/auth';
import { auth } from './firebase';

// 注册新用户
export const registerUser = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return {
      success: true,
      message: '注册成功，请验证您的邮箱',
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = '注册失败，请重试';

    // 处理常见错误
    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = '该邮箱已被注册';
        break;
      case 'auth/invalid-email':
        errorMessage = '邮箱格式不正确';
        break;
      case 'auth/weak-password':
        errorMessage = '密码强度不足，请使用至少6个字符';
        break;
      default:
        errorMessage = `注册失败: ${authError.message}`;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// 用户登录
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      message: '登录成功',
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = '登录失败，请重试';

    // 处理常见错误
    switch (authError.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = '邮箱或密码不正确';
        break;
      case 'auth/invalid-email':
        errorMessage = '邮箱格式不正确';
        break;
      case 'auth/user-disabled':
        errorMessage = '该账户已被禁用';
        break;
      case 'auth/too-many-requests':
        errorMessage = '登录尝试次数过多，请稍后再试';
        break;
      default:
        errorMessage = `登录失败: ${authError.message}`;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// 用户登出
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: '登出成功'
    };
  } catch (error) {
    return {
      success: false,
      message: '登出失败，请重试'
    };
  }
};

// 重置密码
export const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: '密码重置邮件已发送，请查收'
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = '发送密码重置邮件失败';

    if (authError.code === 'auth/user-not-found') {
      errorMessage = '此邮箱未注册';
    } else if (authError.code === 'auth/invalid-email') {
      errorMessage = '邮箱格式不正确';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// 更新用户资料
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      };
    }

    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL
    });

    return {
      success: true,
      message: '个人资料更新成功'
    };
  } catch (error) {
    return {
      success: false,
      message: '更新个人资料失败'
    };
  }
};

// 更改密码
export const changePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      };
    }

    await updatePassword(user, newPassword);
    return {
      success: true,
      message: '密码更新成功'
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = '密码更新失败';

    if (authError.code === 'auth/requires-recent-login') {
      errorMessage = '此操作需要重新登录，请退出后重新登录再试';
    } else if (authError.code === 'auth/weak-password') {
      errorMessage = '密码强度不足，请使用至少6个字符';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// 检查用户是否已登录
export const isUserLoggedIn = (): boolean => {
  return auth.currentUser !== null;
};

// 获取当前登录用户
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// 获取当前用户ID
export const getCurrentUserId = (): string | null => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

// 检查邮箱是否已验证
export const isEmailVerified = (): boolean => {
  return auth.currentUser ? auth.currentUser.emailVerified : false;
};

// 重新发送邮箱验证
export const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      };
    }

    await sendEmailVerification(user);
    return {
      success: true,
      message: '验证邮件已重新发送'
    };
  } catch (error) {
    return {
      success: false,
      message: '发送验证邮件失败'
    };
  }
}; 