"use client";

// TypeScript declaration for window.__toastManager
declare global {
  interface Window {
    __toastManager?: ToastManager;
  }
}

import { Toast, ToastType } from "@/components/Toast";

class ToastManager {
  toasts: Toast[];
  listeners: ((toasts: Toast[]) => void)[];
  nextId: number;

  constructor() {
    this.toasts = [];
    this.listeners = [];
    this.nextId = 0;
  }

  subscribe = (listener: (toasts: Toast[]) => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  private notify = () => {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  };

  add = (message: string, type: ToastType = "info", duration = 3000) => {
    if (!Array.isArray(this.toasts)) this.toasts = [];
    const id = `toast-${this.nextId++}`;
    const toast: Toast = { id, message, type, duration };
    this.toasts.push(toast);
    this.notify();
    return id;
  };

  remove = (id: string) => {
    if (!Array.isArray(this.toasts)) this.toasts = [];
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  };

  success = (message: string, duration = 3000) => {
    return this.add(message, "success", duration);
  };

  error = (message: string, duration = 5000) => {
    return this.add(message, "error", duration);
  };

  info = (message: string, duration = 3000) => {
    return this.add(message, "info", duration);
  };
}

// Ensure singleton in development and production
let toast: ToastManager;
if (typeof window !== "undefined") {
  // @ts-ignore
  if (
    !window.__toastManager ||
    !(window.__toastManager instanceof ToastManager)
  ) {
    const existing = window.__toastManager as ToastManager | undefined;
    const instance = new ToastManager();
    if (existing && Array.isArray(existing.toasts)) {
      instance.toasts = existing.toasts;
    }
    window.__toastManager = instance;
  }
  // @ts-ignore
  toast = window.__toastManager;
} else {
  toast = new ToastManager();
}

export { toast };
export {};
