// @flow

import _ from 'lodash';
import schemaJSON from './fixtures/schema.json';
import swaggerJSON from './fixtures/swagger.json';

import {
  simplifySchema,
} from '../Schema';

test('should simplify schema', () => {
  const result = simplifySchema(schemaJSON);
  expect(_.isObject(result)).toBe(true);
});

test('should simplify schema with imports', () => {
  const result = simplifySchema(swaggerJSON, {
    './fixtures/schema.json': schemaJSON,
  });

  expect(_.isObject(result)).toBe(true);
});
