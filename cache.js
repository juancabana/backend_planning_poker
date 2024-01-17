// cache.js
import NodeCache from 'node-cache';
const myCache = new NodeCache();

// Función para obtener datos del caché
export function getFromCache(key) {
  return myCache.get(key);
}

// Función para almacenar datos en el caché
export function setInCache(key, value, ttl = 60) {
  // ttl (time-to-live) en segundos, por defecto es 60 segundos
  myCache.set(key, value, ttl);
}

export function restartCache () {
  myCache.flushAll()
}
