"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const icons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

const textColors = {
  success: "text-green-800",
  error: "text-red-800",
  warning: "text-yellow-800",
  info: "text-blue-800",
};

export default function ToastNotification({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const duration = toast.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  if (!isVisible) return null;

  return (
    <div
      className={`w-80 p-4 mb-2 rounded-lg border ${bgColors[toast.type]} ${textColors[toast.type]} shadow-lg transition-all duration-300`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="mr-3 text-lg">{icons[toast.type]}</span>
        <div className="flex-1">
          <p className="font-medium">{toast.title}</p>
          {toast.message && (
            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          className="ml-4 text-gray-400 hover:text-gray-600"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}