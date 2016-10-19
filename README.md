# Convert JSON Schema to Flow Type Definitions;


[![npm][json-schema-to-flow-type-badge]][json-schema-to-flow-type]
[![dependences][json-schema-to-flow-type-deps-badge]][json-schema-to-flow-type-deps]

[json-schema-to-flow-type]: https://www.npmjs.com/package/@morlay/json-schema-to-flow-type
[json-schema-to-flow-type-badge]: https://img.shields.io/npm/v/@morlay/json-schema-to-flow-type.svg

[json-schema-to-flow-type-deps]: https://david-dm.org/morlay/dep-packages?path=packages/json-schema-to-flow-type
[json-schema-to-flow-type-deps-badge]: https://david-dm.org/morlay/dep-packages.svg?path=packages/json-schema-to-flow-type

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

### `toFlow(flowSchema): string`

will print `export ${upperCamelCase(flowSchema.id)} == ${toFlowType(flowType)}`

### `schemaToFlow(flowSchema): string`

convert definitions and schema root by `toFlow`

### `parseSchema(schema: Schema, imports: ?Imports): string`

pipe `simplifySchema | convertSchema | schemaToFlow`
