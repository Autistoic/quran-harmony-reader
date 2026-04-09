import { useCallback, useState, useEffect } from 'react';

const PERMISSION_KEY = 'notifications-enabled';

// Track active timeouts so we can cancel/reschedule
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

function isSupported(): boolean {
  return 'Notification' in window;
}

function showNotification(title: string, body: string) {
  if (!isSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
    });
  } catch {
    // Silent fail — some browsers block this
  }
}

export function scheduleReviewNotification(id: string, word: string, nextReview: number) {
  // Clear existing timer for this item
  const existing = activeTimers.get(id);
  if (existing) clearTimeout(existing);

  if (nextReview === Infinity) return;
  if (Notification.permission !== 'granted') return;

  const delay = nextReview - Date.now();
  if (delay <= 0) return; // Already due

  // Cap at ~24h to avoid setTimeout overflow issues
  const cappedDelay = Math.min(delay, 24 * 60 * 60 * 1000);

  const timer = setTimeout(() => {
    showNotification(
      '🧠 Hora de repasar',
      `Frase para practicar: "${word.length > 40 ? word.slice(0, 40) + '…' : word}"`
    );
    activeTimers.delete(id);
  }, cappedDelay);

  activeTimers.set(id, timer);
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported() ? Notification.permission : 'denied'
  );
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(PERMISSION_KEY) === 'true';
  });

  useEffect(() => {
    if (isSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported()) return 'denied' as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setEnabled(true);
      localStorage.setItem(PERMISSION_KEY, 'true');
    }
    return result;
  }, []);

  const toggleEnabled = useCallback(async () => {
    if (!enabled) {
      const result = await requestPermission();
      return result === 'granted';
    } else {
      setEnabled(false);
      localStorage.setItem(PERMISSION_KEY, 'false');
      // Clear all timers
      activeTimers.forEach(timer => clearTimeout(timer));
      activeTimers.clear();
      return false;
    }
  }, [enabled, requestPermission]);

  const supported = isSupported();

  return { permission, enabled, supported, requestPermission, toggleEnabled };
};
