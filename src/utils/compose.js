/**
 * Onion core
 * References: https://github.com/reduxjs/redux/commit/44dfc39c3f8e5e8b51eeab7c44057da6c1086752
 * @param {Array} funcs middleware chain
 * @return {Function}   (...args) => f1(f2(f3(...args)))
 */
export default (funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)))
