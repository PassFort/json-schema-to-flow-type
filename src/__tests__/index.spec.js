// @flow

import test from 'ava';
import fs from 'fs';
import schemaJSON from './fixtures/schema.json';
import swaggerJSON from './fixtures/swagger.json';

import {
  parseSchema,
} from '../index';

const stringify = (str: string): string => `// @flow
/* eslint no-use-before-define: 0 */

${str}
`;

test('convert schema json', () => {
  const result = parseSchema({
    ...schemaJSON,
    id: 'Schema',
  });

  fs.writeFileSync('../schema.js.flow', stringify(result));
});

test('convert swagger json', () => {
  const result = parseSchema({
    ...swaggerJSON,
    id: 'Swagger',
  }, {
    './fixtures/schema.json': schemaJSON,
  });

  fs.writeFileSync('../swagger.js.flow', stringify(result));
});
