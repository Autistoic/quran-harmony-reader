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
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          word: trimmed,
          addedAt: now,
          nextReview: now + INTERVALS[0] * 60_000,
          level: 0,
        },
      ];
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
        return {
          ...item,
          level: newLevel,
          nextReview: Date.now() + INTERVALS[newLevel] * 60_000,
        };
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
