// File untuk berbagi cache antar route handler di about-us
// Kita gunakan memory cache untuk menyimpan data about-us dan localStorage backup

// Cache state
let aboutUsCache: any = null;
let lastCacheTime: number = 0;
export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

// Juga menyimpan cache ke global scope agar tersedia di seluruh instance serverless function
declare global {
  var __aboutUsGlobalCache: any;
  var __aboutUsGlobalCacheTime: number;
}

// Inisialisasi global cache jika belum ada
if (typeof global.__aboutUsGlobalCache === 'undefined') {
  global.__aboutUsGlobalCache = null;
  global.__aboutUsGlobalCacheTime = 0;
}

// Getter dan setter untuk cache
export function getCache() {
  // Prioritaskan module-level cache, fallback ke global cache
  const effectiveCache = aboutUsCache || global.__aboutUsGlobalCache;
  const effectiveCacheTime = lastCacheTime || global.__aboutUsGlobalCacheTime;
  
  return {
    data: effectiveCache,
    time: effectiveCacheTime,
    isFresh: effectiveCacheTime > 0 && (Date.now() - effectiveCacheTime < CACHE_DURATION),
    source: aboutUsCache ? 'module' : (global.__aboutUsGlobalCache ? 'global' : 'none')
  };
}

export function setCache(data: any) {
  // Simpan di kedua tempat untuk memastikan persistensi
  aboutUsCache = data;
  lastCacheTime = Date.now();
  
  // Simpan juga di global scope
  global.__aboutUsGlobalCache = data;
  global.__aboutUsGlobalCacheTime = lastCacheTime;
  
  console.log("Cache updated with data ID:", data?._id || 'unknown', "at:", new Date(lastCacheTime).toISOString());
  
  return { data, time: lastCacheTime };
}

export function clearCache() {
  aboutUsCache = null;
  lastCacheTime = 0;
  global.__aboutUsGlobalCache = null;
  global.__aboutUsGlobalCacheTime = 0;
}
