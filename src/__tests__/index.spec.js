import test from 'ava';
import fse from 'fs-extra';
import schemaJSON from './fixtures/schema.json';
import swaggerJSON from './fixtures/swagger.json';

import {
  parseSchema,
} from '../index';

const stringify = (str: string): string => `/* eslint-disable */
${str}
`;

test('convert schema json', () => {
  const result = parseSchema({
    ...schemaJSON,
    id: 'Schema',
  });

  fse.outputFileSync('./definitions/Schema.js', stringify(result));
});

test('convert swagger json', () => {
  const result = parseSchema({
    ...swaggerJSON,
    id: 'Swagger',
  }, {
    './fixtures/schema.json': schemaJSON,
  });

  fse.outputFileSync('./definitions/Swagger.js', stringify(result));
});
