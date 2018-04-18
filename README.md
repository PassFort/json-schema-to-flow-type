# json-schema-to-flow-type [![Build Status](https://img.shields.io/travis/PassFort/json-schema-to-flow-type.svg?style=flat-square)](https://travis-ci.org/PassFort/json-schema-to-flow-type) [![NPM](https://img.shields.io/npm/v/json-schema-to-flow-type.svg?style=flat-square)](https://npmjs.org/package/json-schema-to-flow-type) [![Dependencies](https://img.shields.io/david/passfort/json-schema-to-flow-type.svg?style=flat-square)](https://david-dm.org/passfort/json-schema-to-flow-type) [![License](https://img.shields.io/npm/l/json-schema-to-flow-type.svg?style=flat-square)](https://npmjs.org/package/json-schema-to-flow-type)


json-schema-to-flow-type is a Node library for generating [flow](https://flow.org/) type definitions from [json schema](#)

## Installation

`$ yarn add -D json-schema-to-flow-type`

or

`$ npm install --save-dev json-schema-to-flow-type`

## Usage

The code snipped below shows the most common usage of this module. The script imports a json file containing your json-schema, it will then convert it into a string of flow types, which is then written into a type definitions file. This should cover most use cases, but the exported API is described [below](#apis).

```javascript
const {writeFileSync} = require('fs');
const {resolve} = require('path');

const {parseSchema} = require('json-schema-to-flow-type');
const jsonSchema = require('./path/to/schema.json');

const flowTypes: string = parseSchema(jsonSchema);

writeFileSync(
    path.resolve(__dirname, './path/to/types-file.js'),
    flowTypes
)

console.log('Flow definitions generated! 🎉')
```

### APIs
All the methods below can be imported from `json-schema-to-flow`. If you are not sure what you need exactly, the code snippet above should cover your needs.

`parseSchema` is most probably what you are looking for, and the following methods are shown so that you can understand the implementation of it.

#### Simplify schema
```javascript
type Imports = {
  [key: string]: Schema
}
```
`simplifySchema(schema: Schema, imports: ?Imports): Schema`

* `schema` should have `id` for type alias identifier
* outside `$ref` will be resolve the real schema instead of `$ref`;
* imports with `{ #: schema }` will have same rule as above;


#### Convert schema
`convertSchema(schema: Schema): FlowSchema`

convert schema to a flow schema

#### To flow
`toFlow(flowSchema): AstObject`

will export ast object `export ${upperCamelCase(flowSchema.id)} == ${toFlowType(flowType)}`

#### Schema to flow
`schemaToFlow(flowSchema): string`

convert definitions and schema root by `toFlow`

#### Parse schema
`parseSchema(schema: Schema, imports: ?Imports): string`

pipe `simplifySchema | convertSchema | schemaToFlow`


## Development
```
$ yarn
$ yarn test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Changelog

### 0.3.0
* Support for [exact object types](https://flow.org/en/docs/types/objects/#toc-exact-object-types) when `additionalProperties: false` is present.

## License
[WTFPL](http://www.wtfpl.net/)

