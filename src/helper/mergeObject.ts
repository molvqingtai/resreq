interface O {
  [key: string]: any
}

const mergeObject = <T extends O, S extends O>(target: T, source: S): T & S => {
  return Object.entries(source).reduce((acc, [key, value]) => {
    if (typeof value === 'object') {
      acc[key as keyof T] = mergeObject(target[key] ?? {}, value)
    } else {
      acc[key as keyof T] = value
    }
    return acc
  }, target) as T & S
}

export default mergeObject
