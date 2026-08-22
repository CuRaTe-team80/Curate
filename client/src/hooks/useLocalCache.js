import { useEffect, useCallback } from 'react';

const CACHE_PREFIX = 'curate_cache_';

export function useLocalCache(key, data) {
  const fullKey = CACHE_PREFIX + key;

  useEffect(() => {
    if (data === undefined || data === null) return;
    try {
      localStorage.setItem(fullKey, JSON.stringify({ data, savedAt: Date.now() }));
    } catch (err) {
      console.warn('useLocalCache: failed to save', err);
    }
  }, [fullKey, data]);

  const loadCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      return JSON.parse(raw).data;
    } catch (err) {
      console.warn('useLocalCache: failed to load', err);
      return null;
    }
  }, [fullKey]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(fullKey);
  }, [fullKey]);

  return { loadCache, clearCache };
}