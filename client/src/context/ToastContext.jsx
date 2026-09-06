import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [activities, setActivities] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      message,
      type,
    });

    setActivities((previousActivities) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        timestamp: new Date().toISOString(),
      },
      ...previousActivities,
    ].slice(0, 50));

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
        activities,
        clearActivities,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}