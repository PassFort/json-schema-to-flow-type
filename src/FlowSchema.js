// @flow

import _ from 'lodash';
import assert from 'assert';

import type {
  Schema,
  SimpleTypes,
} from '../definitions/Schema';

type FlowType = 'Object' | 'Array' | 'string' | 'number' | 'boolean' | 'Date' | 'null' | 'any' | 'void';

const hasProps = (schema: Schema, props: Array<string>): boolean =>
  _.reduce(props, (result: boolean, prop: string) => result || _.has(schema, prop), false);

const isObject = (schema: Schema): boolean => hasProps(schema, [
  'properties',
  'additionalProperties',
  'patternProperties',
  'maxProperties',
  'minProperties',
]);

const isArray = (schema: Schema): boolean => hasProps(schema, [
  'items',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
]);

export class FlowSchema {
  $id: string;
  $flowType: FlowType;
  $flowRef: ?string;
  $required: ?Array<string>;
  $properties: ?{ [key: string]: FlowSchema };
  $enum: ?Array<any>;
  $union: ?Array<FlowSchema>;
  $intersection: ?Array<FlowSchema>;
  $definitions: { [key: string]: FlowSchema };

  static omitUndefined = (arr: Array<any>): Array<any> =>
    _.filter(arr, (item: any): any => !_.isUndefined(item));

  constructor(flowSchema: Object) {
    this.$id = flowSchema.$id;
    this.$flowType = flowSchema.$flowType;
    this.$flowRef = flowSchema.$flowRef;
    this.$enum = flowSchema.$enum;
    this.$definitions = flowSchema.$definitions;

    this.$union = flowSchema.$union;
    this.$intersection = flowSchema.$intersection;

    // only for Object
    this.$properties = flowSchema.$properties;
    this.$required = flowSchema.$required;
  }

  $set(key: string, value: any) {
    return new FlowSchema({
      ...this,
      [key]: value,
    });
  }

  id(id: ?string): FlowSchema {
    return this.$set('$id', id);
  }

  flowType(flowType: ?FlowType): FlowSchema {
    return this.$set('$flowType', flowType);
  }

  flowRef(flowRef: ?string): FlowSchema {
    return this.$set('$flowRef', flowRef);
  }

  definitions(definitions: { [key: string]: FlowSchema }): FlowSchema {
    if (_.isEmpty(definitions)) {
      return this;
    }
    return this.$set('$definitions', definitions);
  }

  props(properties: { [key: any]: FlowSchema }, required: ?Array<any>): FlowSchema {
    return this
      .flowType('Object')
      .$set('$properties', properties)
      .$set('$required', required || []);
  }

  enum(values: ?Array<any>): FlowSchema {
    if (_.isEmpty(values)) {
      return this;
    }
    return this.$set('$enum', values);
  }

  union(flowSchemas: Array<FlowSchema | void>): FlowSchema {
    const finalFlowSchemas = FlowSchema.omitUndefined(flowSchemas);
    if (_.isEmpty(finalFlowSchemas)) {
      return this;
    }
    return this.$set('$union', finalFlowSchemas);
  }

  intersection(flowSchemas: Array<FlowSchema | void>): FlowSchema {
    const finalFlowSchemas = FlowSchema.omitUndefined(flowSchemas);
    if (_.isEmpty(finalFlowSchemas)) {
      return this;
    }
    return this.$set('$intersection', finalFlowSchemas);
  }
}

export const flow = (flowType: ?FlowType): FlowSchema =>
  (new FlowSchema({})).flowType(flowType || 'any');

export const convertSchema = (schema: Schema): FlowSchema => {
  if (schema.$ref) {
    return flow().id(schema.id).flowRef(schema.$ref);
  }

  if (schema.allOf) {
    const patchedSchema = _.reduce(schema.allOf, (prev: Schema, item: Schema) =>
      _.mergeWith(prev, item, (mergedValue: any, newValue: any, key: string): any => {
        if (_.isNil(mergedValue)) {
          return;
        }
        if (key === '$required') {
          return _.uniq(mergedValue.concat(newValue)); // eslint-disable-line consistent-return
        }
        if (_.isPlainObject(mergedValue)) {
          if (!_.isPlainObject(newValue)) {
            throw new Error(`Failed to merge "allOf" schemas because "${key}" has different values.`);
          }
          return;
        }
        assert.deepEqual(mergedValue, newValue, `Failed to merge "allOf" schemas because "${key}" has different values: ${JSON.stringify(mergedValue)} and ${JSON.stringify(newValue)}.`);
      })
    , _.omit(schema, ['allOf', '$ref']));

    return convertSchema(patchedSchema);
  }

  const f = flow()
    .id(schema.id)
    .enum(schema.enum)
    .definitions(
      _.mapValues(
        schema.definitions,
        (definition: Schema, id: any) => convertSchema(_.assign(_.omit(definition, '$ref'), { id })),
      ),
    );

  if (_.isArray(schema.type)) {
    return f.union(
      _.map(
        [].concat(schema.type || []),
        (type: SimpleTypes) => convertSchema({
          ...schema,
          type,
        }),
      ),
    );
  }

  if (schema.oneOf) {
    return f.union(_.map(schema.oneOf, convertSchema));
  }

  if (schema.anyOf) {
    return f.union(_.map(schema.anyOf, convertSchema));
  }

  if (isObject(schema) && isArray(schema)) {
    return f.flowType('any');
  }

  if (isObject(schema)) {
    return f.flowType('Object')
      .props(_.mapValues(schema.properties, convertSchema), schema.required)
      .union([
        ...(_.map(schema.patternProperties, convertSchema)),
        (typeof schema.additionalProperties === 'object') ? convertSchema(schema.additionalProperties) : undefined,
        (typeof schema.additionalProperties === 'boolean' && schema.additionalProperties) ? convertSchema({}) : undefined,
      ]);
  }

  if (isArray(schema)) {
    return f.flowType('Array')
      .union(_.map([].concat(schema.items || {}), convertSchema));
  }

  switch (_.toLower(String(schema.type))) {
    case 'string':
      return f.flowType('string');
    case 'number':
    case 'integer':
      return f.flowType('number');
    case 'boolean':
      return f.flowType('boolean');
    case 'date':
      return f.flowType('Date');
    case 'null':
      return f.flowType('null');
    default:
      return f.flowType('any');
  }
};
