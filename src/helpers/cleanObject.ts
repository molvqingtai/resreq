import typeOf from './typeOf'

interface O {
  [key: string]: any
}

/**
 * Clear invalid values from object
 * @param target target object
 * @param match match type,default undefined|null
 */
const cleanObject = (target: O, match = [undefined, null]): O =>
  Object.entries(target).reduce((acc, [key, value]) => {
    if (typeOf(value) === 'Object') {
      return { ...acc, [key]: cleanObject(value) }
    }
    if (typeOf(value) === 'Array') {
      return {
        ...acc,
        [key]: value.map((item: any) => {
          return typeOf(item) === 'Object' ? cleanObject(item) : item
        })
      }
    }
    if (match.includes(value)) {
      Reflect.deleteProperty(acc, key)
      return acc
    } else {
      return { ...acc, [key]: value }
    }
  }, {})

export default cleanObject
