/**
 * typeOf
 * @param  {Any} target [target value]
 * @return {String}     [type of target]
 */
const typeOf = (target: any) => Object.prototype.toString.call(target).slice(8, -1)

export default typeOf
