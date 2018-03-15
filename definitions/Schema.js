// @flow
/* eslint-disable */

export type SchemaArray = Array<Schema>;

export type PositiveInteger = number;

export type PositiveIntegerDefault0 = PositiveInteger;

export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";

export type StringArray = Array<string>;

export type Schema = {
  id?: string;
  $ref?: string;
  $schema?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: PositiveInteger;
  minLength?: PositiveIntegerDefault0;
  pattern?: string;
  additionalItems?: boolean | Schema;
  items?: Schema | SchemaArray;
  maxItems?: PositiveInteger;
  minItems?: PositiveIntegerDefault0;
  uniqueItems?: boolean;
  maxProperties?: PositiveInteger;
  minProperties?: PositiveIntegerDefault0;
  required?: StringArray;
  additionalProperties?: boolean | Schema;
  definitions?: { [key: any]: Schema;
  };
  properties?: { [key: any]: Schema;
  };
  patternProperties?: { [key: any]: Schema;
  };
  dependencies?: { [key: any]: Schema | StringArray;
  };
  enum?: Array<any>;
  type?: SimpleTypes | Array<SimpleTypes>;
  allOf?: SchemaArray;
  anyOf?: SchemaArray;
  oneOf?: SchemaArray;
  not?: Schema;
};
