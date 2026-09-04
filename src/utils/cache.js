export const cache = {
  set: (key, data) => {
    try {
      localStorage.setItem(`pimaga_cache_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Cache write failed:", e);
    }
  },
  get: (key) => {
    try {
      const raw = localStorage.getItem(`pimaga_cache_${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
