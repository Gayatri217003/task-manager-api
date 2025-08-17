/**
 * Very simple in-memory cache with TTL (seconds).
 * Use for GET endpoints as an optional bonus.
 */
const cacheStore = new Map();

function getKey(req) {
  return req.originalUrl + "::" + (req.user ? req.user.id : "anon");
}

module.exports = function cache(ttlSeconds = 60) {
  return (req, res, next) => {
    if (req.method !== "GET") return next();
    const key = getKey(req);
    const now = Date.now();
    const cached = cacheStore.get(key);
    if (cached && (now - cached.time) < ttlSeconds * 1000) {
      return res.json(cached.data);
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cacheStore.set(key, { time: Date.now(), data });
      return originalJson(data);
    };
    next();
  };
};
