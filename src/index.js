// @flow

import * as t from 'babel-types';
import generate from 'babel-generator';
import _ from 'lodash';

import type {
  Schema,
} from '../definitions/Schema';

import {
  simplifySchema,
} from './Schema';

import {
  convertSchema,
  FlowSchema,
} from './FlowSchema';

import {
  toFlowType,
  upperCamelCase,
} from './FlowTypeGenerator';

export {
  simplifySchema,
  convertSchema,
  toFlowType,
};

export const toFlow = (flowSchema: FlowSchema): Object =>
  t.exportNamedDeclaration(
    t.typeAlias(
      t.identifier(upperCamelCase(flowSchema.$id)),
      null,
      toFlowType(flowSchema),
    ),
    [],
  );

export const schemaToFlow = (flowSchema: FlowSchema): string =>
  _.map(
    [
      ...(_.map(flowSchema.$definitions, toFlow)),
      toFlow(flowSchema),
    ],
    (ast: Object): string => generate(ast).code,
  ).join('\n\n');

export const parseSchema = (schema: Schema, imports: ?{ [key: string]: Schema }): string =>
  _.flow(
    (s: Schema) => simplifySchema(s, imports),
    convertSchema,
    schemaToFlow,
  )(schema);

