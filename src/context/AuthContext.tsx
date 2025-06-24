"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

// 定义上下文类型
interface AuthContextType {
  session: any | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// 创建一个上下文，可以在整个应用程序中使用
const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  isAuthenticated: false,
});

// 全局单例管理器，严格控制 useSession 的调用
class SessionManager {
  private static instance: SessionManager | null = null;
  private sessionData: {
    session: any | null;
    isLoading: boolean;
    error: Error | null;
    timestamp: number;
  } | null = null;

  private subscribers: Set<(data: any) => void> = new Set();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public async initialize(): Promise<void> {
    // 防止并发初始化
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized) {
      return;
    }

    this.initPromise = new Promise(async (resolve) => {
      try {
        // 这里我们需要手动调用 authClient 的方法而不是使用 hook
        // 因为 hook 只能在组件中使用
        const sessionResult = await this.fetchSessionData();
        this.sessionData = {
          ...sessionResult,
          timestamp: Date.now(),
        };
        this.isInitialized = true;
        this.notifySubscribers();
      } catch (error) {
        console.error("Failed to initialize session:", error);
        this.sessionData = {
          session: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to initialize session"),
          timestamp: Date.now(),
        };
      }
      resolve();
    });

    return this.initPromise;
  }

  private async fetchSessionData(): Promise<{
    session: any | null;
    isLoading: boolean;
    error: Error | null;
  }> {
    try {
      // 使用 authClient 的 getSession 方法而不是 hook
      const session = await authClient.getSession();
      return {
        session: session.data,
        isLoading: false,
        error: session.error
          ? new Error(session.error.message || "Session error")
          : null,
      };
    } catch (error) {
      return {
        session: null,
        isLoading: false,
        error:
          error instanceof Error ? error : new Error("Unknown session error"),
      };
    }
  }

  public subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback);

    // 如果已经有数据，立即通知
    if (this.sessionData) {
      callback(this.sessionData);
    }

    // 返回取消订阅函数
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    if (this.sessionData) {
      this.subscribers.forEach((callback) => callback(this.sessionData));
    }
  }

  public getSessionData() {
    return this.sessionData;
  }

  public async refreshSession(): Promise<void> {
    try {
      const sessionResult = await this.fetchSessionData();
      this.sessionData = {
        ...sessionResult,
        timestamp: Date.now(),
      };
      this.notifySubscribers();
    } catch (error) {
      console.error("Failed to refresh session:", error);
      this.sessionData = {
        session: null,
        isLoading: false,
        error:
          error instanceof Error ? error : new Error("Unknown refresh error"),
        timestamp: Date.now(),
      };
      this.notifySubscribers();
    }
  }

  public async signOut(): Promise<void> {
    try {
      await authClient.signOut();
      this.sessionData = {
        session: null,
        isLoading: false,
        error: null,
        timestamp: Date.now(),
      };
      this.notifySubscribers();
    } catch (error) {
      console.error("Sign out error:", error);
      this.sessionData = {
        session: null,
        isLoading: false,
        error:
          error instanceof Error ? error : new Error("Unknown signout error"),
        timestamp: Date.now(),
      };
      this.notifySubscribers();
      // 如果登出失败，强制刷新页面
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }

  public clearCache(): void {
    this.sessionData = null;
    this.isInitialized = false;
    this.initPromise = null;
  }
}

// 全局单例实例
const sessionManager = SessionManager.getInstance();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<{
    session: any | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    session: null,
    isLoading: true,
    error: null,
  });

  const initRef = useRef(false);

  // 初始化会话管理器
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      await sessionManager.initialize();
      const data = sessionManager.getSessionData();
      if (data) {
        setSessionState({
          session: data.session,
          isLoading: data.isLoading,
          error: data.error,
        });
      }
    };

    initialize();
  }, []);

  // 订阅会话状态变化
  useEffect(() => {
    const unsubscribe = sessionManager.subscribe((data) => {
      setSessionState({
        session: data.session,
        isLoading: data.isLoading,
        error: data.error,
      });
    });

    return unsubscribe;
  }, []);

  // 使用 useCallback 优化 signOut 函数，避免每次重新创建
  const signOut = useCallback(async () => {
    await sessionManager.signOut();
  }, []);

  // 使用 useMemo 优化 context value，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    // 判断用户是否已认证
    const isAuthenticated = !!sessionState.session?.user;

    return {
      session: sessionState.session,
      isLoading: sessionState.isLoading,
      error: sessionState.error,
      signOut,
      isAuthenticated,
    };
  }, [
    sessionState.session,
    sessionState.isLoading,
    sessionState.error,
    signOut,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// 创建一个自定义 hook 以便在组件中轻松访问认证状态
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 导出会话管理器实例，供其他地方使用
export { sessionManager };
