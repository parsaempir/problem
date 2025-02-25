var TimeLimitedCache = function() {
    this.cache = new Map();
};

/** 
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 */
TimeLimitedCache.prototype.set = function(key, value, duration) {
    const expirationTime = Date.now() + duration;
    const existed = this.cache.has(key);
    this.cache.set(key, {value, expirationTime});
    return existed && expirationTime > Date.now();
};

/** 
 * @param {number} key
 * @return {number} value associated with key
 */
TimeLimitedCache.prototype.get = function(key) {
    const entry = this.cache.get(key);
    if(entry && entry.expirationTime > Date.now()){
           return entry.value;
    }
    this.cache.delete(key);
    return -1;
};

/** 
 * @return {number} count of non-expired keys
 */
TimeLimitedCache.prototype.count = function() {
    let count = 0;
    const currentTime = Date.now();
    for(let [key, entry] of this.cache){
        if(entry.expirationTime > currentTime) count++;
        else this.cache.delete(key);
    }
    return count;
};

/**
 * const timeLimitedCache = new TimeLimitedCache()
 * timeLimitedCache.set(1, 42, 1000); // false
 * timeLimitedCache.get(1) // 42
 * timeLimitedCache.count() // 1
 */