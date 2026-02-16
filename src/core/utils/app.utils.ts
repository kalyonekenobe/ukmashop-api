export const deepCleanToInterface = <T>(object: any, template: T): T => {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  if (typeof template !== 'object' || template === null) {
    return object;
  }

  const result: any = Array.isArray(template) ? [] : {};

  for (const key of Object.keys(template)) {
    if (key in object) {
      const value = (object as any)[key];
      const subTemplate = (template as any)[key];

      result[key] =
        typeof value === 'object' && typeof subTemplate === 'object'
          ? deepCleanToInterface(value, subTemplate)
          : value;
    }
  }

  return result;
};
