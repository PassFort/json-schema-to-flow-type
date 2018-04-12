# Convert JSON Schema to Flow Type Definitions

[![Build Status](https://img.shields.io/travis/morlay/json-schema-to-flow-type.svg?style=flat-square)](https://travis-ci.org/morlay/json-schema-to-flow-type)
[![NPM](https://img.shields.io/npm/v/json-schema-to-flow-type.svg?style=flat-square)](https://npmjs.org/package/json-schema-to-flow-type)
[![Dependencies](https://img.shields.io/david/morlay/json-schema-to-flow-type.svg?style=flat-square)](https://david-dm.org/morlay/json-schema-to-flow-type)
[![License](https://img.shields.io/npm/l/json-schema-to-flow-type.svg?style=flat-square)](https://npmjs.org/package/json-schema-to-flow-type)



## APIs

```js
type Imports = {
  [key: string]: Schema
}
```

### `simplifySchema(schema, Schema, imports: ?Imports): Schema`

* `schema` should have `id` for type alias identifier
* outside `$ref` will be resolve the real schema instead of `$ref`;
* imports with `{ #: schema }` will have same rule as above;

### `convertSchema(schema: Schema): FlowSchema`

convert schema to a flow schema

### `toFlow(flowSchema): AstObject`

will export ast object `export ${upperCamelCase(flowSchema.id)} == ${toFlowType(flowType)}`

### `schemaToFlow(flowSchema): string`

convert definitions and schema root by `toFlow`

### `parseSchema(schema: Schema, imports: ?Imports): string`

pipe `simplifySchema | convertSchema | schemaToFlow`

## Changelog

### 0.3.0
* Support for [exact object types](https://flow.org/en/docs/types/objects/#toc-exact-object-types) when `additionalProperties: false` is present.
