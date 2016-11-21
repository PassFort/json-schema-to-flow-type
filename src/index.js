// @flow

import * as t from 'babel-types';
import generate from 'babel-generator';
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

const optional = (astNode) =>
  _.assign(astNode, { optional: true });

const processArraySchema = (flowSchema: FlowSchema, processor: SchemaProcessor): Object =>
  t.genericTypeAnnotation(
    t.identifier('Array'),
    t.typeParameterInstantiation([
      processor(flowSchema.flowType('any')),
    ]),
  );

const processObjectSchema = (flowSchema: FlowSchema, processor: SchemaProcessor): Object => {
  const properties = _.map(
    flowSchema.$properties || {},
    (fieldFlowSchema: FlowSchema, field: string) => {
      const ast = t.objectTypeProperty(
        t.identifier(field),
        processor(fieldFlowSchema),
      );

      if (_.includes(flowSchema.$required, field)) {
        return ast;
      }

      return optional(ast);
    },
  );

  return t.objectTypeAnnotation(
    properties,
    flowSchema.$union ? [
      t.objectTypeIndexer(
        t.identifier('key'),
        t.anyTypeAnnotation(),
        processor(flowSchema.flowType('any')),
      ),
    ] : null,
  );
};

const toFlowType = (flowSchema: FlowSchema): Object => {
  if (flowSchema.$flowRef) {
    return t.identifier(upperCamelCase(flowSchema.$flowRef));
  }

  if (flowSchema.$enum) {
    return t.createUnionTypeAnnotation(
      _.map(
        flowSchema.$enum,
        (value) => t.identifier(JSON.stringify(value)),
      ),
    );
  }

  if (flowSchema.$flowType === 'Array') {
    return processArraySchema(flowSchema, toFlowType);
  }

  if (flowSchema.$flowType === 'Object') {
    return processObjectSchema(flowSchema, toFlowType);
  }

  if (flowSchema.$union) {
    return t.unionTypeAnnotation(_.map(flowSchema.$union, toFlowType));
  }

  if (flowSchema.$intersection) {
    return t.intersectionTypeAnnotation(_.map(flowSchema.$intersection, toFlowType));
  }


  if (flowSchema.$flowType === 'any') {
    return t.anyTypeAnnotation()
  }

  return t.createTypeAnnotationBasedOnTypeof(flowSchema.$flowType);
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
  generate(
    t.program([
      ...(_.map(flowSchema.$definitions, toFlow)),
      toFlow(flowSchema),
    ]),
  ).code;

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

