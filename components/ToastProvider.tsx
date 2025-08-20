import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useRef  // <-- Add this import
} from 'react';
import Toast from './Toast';

type ToastType = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastType | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const showToast = (newToast: ToastType) => {
    // Clear any existing toast
    setVisible(false);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Set new toast after a small delay to allow hide animation
    setTimeout(() => {
      setToast(newToast);
      setVisible(true);
      
      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, newToast.duration || 4000);
    }, 300);
  };

  const handleHide = () => {
    setToast(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={visible}
          onHide={handleHide}
          duration={toast.duration}
        />
      )}
    </ToastContext.Provider>
  );
};