import * as _ from 'lodash';
import * as qs from 'qs';
import { BooleanOptional, IParseOptions, IStringifyOptions } from 'qs';

export const parseObjectStringValuesToPrimitives = (
  object: Record<string, any>,
): Record<string, any> | undefined => {
  return object
    ? _.mapValues(object, value => {
        if (_.isObject(value) && !_.isArray(value)) {
          return parseObjectStringValuesToPrimitives(value);
        } else if (_.isString(value)) {
          switch (value) {
            case 'true':
            case 'false':
              return value === 'true';
            case 'null':
              return null;
            case 'undefined':
              return undefined;
            default:
              return !isNaN(Number(value)) ? Number(value) : value;
          }
        }
        return value;
      })
    : object;
};

export const deserializeQueryString = (
  queryString?: string | Record<string, string>,
  options: IParseOptions<BooleanOptional> = {
    comma: false,
    allowDots: true,
    parseArrays: true,
    depth: 10,
    allowEmptyArrays: true,
  },
) => {
  return queryString && Object.entries(queryString).length
    ? parseObjectStringValuesToPrimitives(qs.parse(queryString, options))
    : undefined;
};

export const serializeToQueryString = (
  object?: any,
  options: IStringifyOptions<BooleanOptional> = {
    arrayFormat: 'indices',
    allowDots: true,
    commaRoundTrip: true,
    allowEmptyArrays: true,
  },
) => {
  return qs.stringify(object, options);
};
