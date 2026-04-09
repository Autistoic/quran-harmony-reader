import { useState, useCallback, useMemo } from 'react';

export interface PracticeItem {
  id: string;
  word: string;
  addedAt: number;
  nextReview: number;
  level: number;
}

const STORAGE_KEY = 'pimsleur-items';
const INTERVALS = [5, 25, 120, 1440]; // minutes

function loadItems(): PracticeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: PracticeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const usePimsleur = () => {
  const [items, setItems] = useState<PracticeItem[]>(loadItems);

  // On mount, reschedule notifications for pending items
  useEffect(() => {
    const notifEnabled = localStorage.getItem('notifications-enabled') === 'true';
    if (notifEnabled) {
      items.forEach(item => {
        if (item.level < INTERVALS.length && item.nextReview > Date.now()) {
          scheduleReviewNotification(item.id, item.word, item.nextReview);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback((next: PracticeItem[]) => {
    setItems(next);
    saveItems(next);
  }, []);

  const addItem = useCallback((word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    setItems(prev => {
      if (prev.some(i => i.word === trimmed)) return prev;
      const now = Date.now();
      const nextReview = now + INTERVALS[0] * 60_000;
      const newItem: PracticeItem = {
        id: crypto.randomUUID(),
        word: trimmed,
        addedAt: now,
        nextReview,
        level: 0,
      };
      const next = [...prev, newItem];
      saveItems(next);
      if (localStorage.getItem('notifications-enabled') === 'true') {
        scheduleReviewNotification(newItem.id, newItem.word, nextReview);
      }
      return next;
      saveItems(next);
      return next;
    });
  }, []);

  const reviewItem = useCallback((id: string, success: boolean) => {
    setItems(prev => {
      const next = prev.map(item => {
        if (item.id !== id) return item;
        const newLevel = success ? Math.min(item.level + 1, INTERVALS.length) : 0;
        if (newLevel >= INTERVALS.length) {
          return { ...item, level: newLevel, nextReview: Infinity };
        }
        const nextReview = Date.now() + INTERVALS[newLevel] * 60_000;
        if (localStorage.getItem('notifications-enabled') === 'true') {
          scheduleReviewNotification(id, item.word, nextReview);
        }
        return { ...item, level: newLevel, nextReview };
      });
      saveItems(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      saveItems(next);
      return next;
    });
  }, []);

  const dueItems = useMemo(
    () => items.filter(i => i.level < INTERVALS.length && i.nextReview <= Date.now()),
    [items]
  );

  return { items, dueItems, addItem, reviewItem, removeItem };
};
