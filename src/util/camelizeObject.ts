import camelCase from 'camelcase';
import decamelize from 'decamelize';

const hyphenize = arg => decamelize(arg, '-');
const isObject = x => x !== null && typeof x === 'object';

type Transformable = Array<any> | object;

const recursivelyTransformObj = (obj: Transformable, formatFn: Function): Transformable => {
  const out = <Array<any>>obj ? [] : {};

  for (const key of Object.keys(obj)) {
    const transformedKey = formatFn(key);
    if (isObject(obj[key])) {
      out[transformedKey] = recursivelyTransformObj(obj[key], formatFn);
    } else {
      out[transformedKey] = obj[key];
    }
  }

  return out;
};

export const camelizeObject = (obj: Transformable): Transformable => recursivelyTransformObj(obj, camelCase);

export const hyphenizeObject = (obj: Transformable): Transformable => recursivelyTransformObj(obj, hyphenize);
