/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
    const cache = new Map();
  
    function deepEqual(a, b) {
      if (a === b) return true;
      if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
      
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
      }
      
      return true;
    }
  
    return function (...args) {
      const key = args.map(arg => {
        return arg && typeof arg === 'object' ? arg : arg;
      }).find((arg, index, arr) => arr.slice(index + 1).some(other => deepEqual(arg, other))) || args.join(',');
  
      if (cache.has(key)) {
        return cache.get(key);
      }
  
      const result = fn(...args);
  
      cache.set(key, result);
  
      return result;
    };
  }
  
  /** 
   * let callCount = 0;
   * const memoizedFn = memoize(function (a, b) {
   *	 callCount += 1;
   *   return a + b;
   * })
   * memoizedFn(2, 3) // 5
   * memoizedFn(2, 3) // 5
   * console.log(callCount) // 1 
   */