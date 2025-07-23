'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
  sessionExpiry: number;
  rememberMe: boolean;
}

interface AdminContextType {
  session: AdminSession;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  updateActivity: () => void;
  showTimeoutWarning: boolean;
  extendSession: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Session timeout constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REMEMBER_ME_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before expiry
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession>({
    isAuthenticated: false,
    isLoading: true,
    lastActivity: Date.now(),
    sessionExpiry: Date.now() + SESSION_TIMEOUT,
    rememberMe: false,
  });
  
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const router = useRouter();
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update last activity time
  const updateActivity = () => {
    const now = Date.now();
    const newExpiry = now + (session.rememberMe ? REMEMBER_ME_TIMEOUT : SESSION_TIMEOUT);
    
    setSession(prev => ({
      ...prev,
      lastActivity: now,
      sessionExpiry: newExpiry,
    }));

    // Reset warning
    setShowTimeoutWarning(false);
  };

  // Check session validity
  const checkSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const now = Date.now();
        const rememberMe = localStorage.getItem('adminRememberMe') === 'true';
        const timeout = rememberMe ? REMEMBER_ME_TIMEOUT : SESSION_TIMEOUT;
        
        setSession(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: now,
          sessionExpiry: now + timeout,
          rememberMe,
        }));
        return true;
      } else {
        setSession(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
        }));
        return false;
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSession(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: 'include',
      });

      if (response.ok) {
        const now = Date.now();
        const timeout = rememberMe ? REMEMBER_ME_TIMEOUT : SESSION_TIMEOUT;
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('adminRememberMe', 'true');
        } else {
          localStorage.removeItem('adminRememberMe');
        }

        setSession({
          isAuthenticated: true,
          isLoading: false,
          lastActivity: now,
          sessionExpiry: now + timeout,
          rememberMe,
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local storage
      localStorage.removeItem('adminRememberMe');
      
      // Reset session
      setSession({
        isAuthenticated: false,
        isLoading: false,
        lastActivity: Date.now(),
        sessionExpiry: Date.now(),
        rememberMe: false,
      });

      // Clear timers
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }

      setShowTimeoutWarning(false);
      router.push('/admin/login');
    }
  };

  // Extend session
  const extendSession = () => {
    updateActivity();
    setShowTimeoutWarning(false);
  };

  // Set up activity monitoring
  useEffect(() => {
    if (session.isAuthenticated) {
      // Track user activity
      const handleActivity = () => {
        updateActivity();
      };

      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Set up periodic session check
      activityTimerRef.current = setInterval(async () => {
        const now = Date.now();
        const timeUntilExpiry = session.sessionExpiry - now;

        // Show warning if close to expiry
        if (timeUntilExpiry <= WARNING_TIME && !showTimeoutWarning) {
          setShowTimeoutWarning(true);
        }

        // Auto logout if expired
        if (timeUntilExpiry <= 0) {
          await logout();
        }
      }, ACTIVITY_CHECK_INTERVAL);

      return () => {
        // Clean up event listeners
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });

        // Clear timers
        if (activityTimerRef.current) {
          clearInterval(activityTimerRef.current);
        }
      };
    }
  }, [session.isAuthenticated, session.sessionExpiry, showTimeoutWarning]);

  // Initial session check
  useEffect(() => {
    checkSession();
  }, []);

  const contextValue: AdminContextType = {
    session,
    login,
    logout,
    checkSession,
    updateActivity,
    showTimeoutWarning,
    extendSession,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}