// @flow

import _ from 'lodash';

import type { Schema } from './schema.js.flow';

import {
  simplifySchema,
} from './Schema';

import {
  convertSchema,
  FlowSchema,
} from './FlowSchema';

type SchemaProcessor = (flowSchema: FlowSchema) => string;

const upperCamelCase = (str: string): string => _.upperFirst(_.camelCase(str));

const unionTypes = (types: Array<string>): string => _.join(_.uniq(types), ' | ');

const intersectionTypes = (types: Array<string>): string => _.join(_.uniq(types), ' & ');

const fieldsToFlowObjectDef = (
  fields: { [key: string]: string },
): string => {
  const flowDef = _.map(
    fields,
    (typeDefine: string, field: string): string => (
      `${field}: ${typeDefine}`
    ),
  ).join(', ');

  return `{ ${flowDef} }`;
};

const processArraySchema = (flowSchema: FlowSchema, processor: SchemaProcessor): string =>
  `Array<${processor(flowSchema.flowType('any'))}>`;

const processObjectSchema = (flowSchema: FlowSchema, processor: SchemaProcessor): string => {
  const fields = _.reduce(
    flowSchema.$properties || {},
    (nextFields: Object, fieldFlowSchema: FlowSchema, field: string) => ({
      ...nextFields,
      [`${field}${_.includes(flowSchema.$required, field) ? '' : '?'}`]: processor(fieldFlowSchema),
    }),
    {},
  );

  return fieldsToFlowObjectDef({
    ...fields,
    ...(flowSchema.$union ? ({
      '[key: any]': processor(flowSchema.flowType('any')),
    }) : {}),
  });
};

const toFlowType = (flowSchema: FlowSchema): string => {
  if (flowSchema.$flowRef) {
    return upperCamelCase(flowSchema.$flowRef);
  }

  if (flowSchema.$enum) {
    return unionTypes(_.map(flowSchema.$enum, (value) => JSON.stringify(value)));
  }

  if (flowSchema.$flowType === 'Array') {
    return processArraySchema(flowSchema, toFlowType);
  }

  if (flowSchema.$flowType === 'Object') {
    return processObjectSchema(flowSchema, toFlowType);
  }

  if (flowSchema.$union) {
    return unionTypes(_.map(flowSchema.$union, toFlowType));
  }

  if (flowSchema.$intersection) {
    return intersectionTypes(_.map(flowSchema.$intersection, toFlowType));
  }

  return flowSchema.$flowType;
};

export const toFlow = (flowSchema: FlowSchema): string =>
  `export type ${upperCamelCase(flowSchema.$id)} = ${toFlowType(flowSchema)};`;

export const schemaToFlow = (flowSchema: FlowSchema): string => [
  ...(_.map(flowSchema.$definitions, toFlow)),
  toFlow(flowSchema),
].join('\n\n');

export {
  simplifySchema,
  convertSchema,
};

export const parseSchema = (
  schema: Schema, imports: ?{ [key: string]: Schema },
): string =>
  _.flow(
    (s: Schema) => simplifySchema(s, imports),
    convertSchema,
    schemaToFlow,
  )(schema);

