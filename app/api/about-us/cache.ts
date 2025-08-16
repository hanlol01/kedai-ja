// File untuk berbagi cache antar route handler di about-us
// Kita gunakan memory cache untuk menyimpan data about-us

// Cache state
let aboutUsCache: any = null;
let lastCacheTime: number = 0;
export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

// Getter dan setter untuk cache
export function getCache() {
  return {
    data: aboutUsCache,
    time: lastCacheTime,
    isFresh: lastCacheTime > 0 && (Date.now() - lastCacheTime < CACHE_DURATION)
  };
}

export function setCache(data: any) {
  aboutUsCache = data;
  lastCacheTime = Date.now();
  return { data, time: lastCacheTime };
}

export function clearCache() {
  aboutUsCache = null;
  lastCacheTime = 0;
}
