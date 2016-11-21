/* eslint-disable */
export type Info = {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
  [key: any]: VendorExtension;
};

export type Contact = {
  name?: string;
  url?: string;
  email?: string;
  [key: any]: VendorExtension;
};

export type License = {
  name: string;
  url?: string;
  [key: any]: VendorExtension;
};

export type Paths = { [key: any]: VendorExtension | PathItem;
};

export type Definitions = { [key: any]: Schema;
};

export type ParameterDefinitions = { [key: any]: Parameter;
};

export type ResponseDefinitions = { [key: any]: Response;
};

export type ExternalDocs = {
  description?: string;
  url: string;
  [key: any]: VendorExtension;
};

export type Examples = { [key: any]: any;
};

export type MimeType = string;

export type Operation = {
  tags?: Array<string>;
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocs;
  operationId?: string;
  produces?: MediaTypeList;
  consumes?: MediaTypeList;
  parameters?: ParametersList;
  responses: Responses;
  schemes?: SchemesList;
  deprecated?: boolean;
  security?: Security;
  [key: any]: VendorExtension;
};

export type PathItem = {
  $ref?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  parameters?: ParametersList;
  [key: any]: VendorExtension;
};

export type Responses = { [key: any]: ResponseValue | VendorExtension;
};

export type ResponseValue = Response | JsonReference;

export type Response = {
  description: string;
  schema?: Schema | FileSchema;
  headers?: Headers;
  examples?: Examples;
  [key: any]: VendorExtension;
};

export type Headers = { [key: any]: Header;
};

export type Header = {
  type: "string" | "number" | "integer" | "boolean" | "array";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  description?: string;
  [key: any]: VendorExtension;
};

export type VendorExtension = any;

export type BodyParameter = {
  description?: string;
  name: string;
  in: "body";
  required?: boolean;
  schema: Schema;
  [key: any]: VendorExtension;
};

export type HeaderParameterSubSchema = {
  required?: boolean;
  in?: "header";
  description?: string;
  name?: string;
  type?: "string" | "number" | "boolean" | "integer" | "array";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  [key: any]: VendorExtension;
};

export type QueryParameterSubSchema = {
  required?: boolean;
  in?: "query";
  description?: string;
  name?: string;
  allowEmptyValue?: boolean;
  type?: "string" | "number" | "boolean" | "integer" | "array";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormatWithMulti;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  [key: any]: VendorExtension;
};

export type FormDataParameterSubSchema = {
  required?: boolean;
  in?: "formData";
  description?: string;
  name?: string;
  allowEmptyValue?: boolean;
  type?: "string" | "number" | "boolean" | "integer" | "array" | "file";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormatWithMulti;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  [key: any]: VendorExtension;
};

export type PathParameterSubSchema = {
  required: true;
  in?: "path";
  description?: string;
  name?: string;
  type?: "string" | "number" | "boolean" | "integer" | "array";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  [key: any]: VendorExtension;
};

export type NonBodyParameter = HeaderParameterSubSchema | FormDataParameterSubSchema | QueryParameterSubSchema | PathParameterSubSchema;

export type Parameter = BodyParameter | NonBodyParameter;

export type Schema = {
  $ref?: string;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: Array<string>;
  enum?: Array<any>;
  additionalProperties?: Schema | boolean;
  type?: "array" | "boolean" | "integer" | "null" | "number" | "object" | "string" | Array<"array" | "boolean" | "integer" | "null" | "number" | "object" | "string">;
  items?: Schema | Array<Schema>;
  allOf?: Array<Schema>;
  properties?: { [key: any]: Schema;
  };
  discriminator?: string;
  readOnly?: boolean;
  xml?: Xml;
  externalDocs?: ExternalDocs;
  example?: any;
  [key: any]: VendorExtension;
};

export type FileSchema = {
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  required?: Array<string>;
  type: "file";
  readOnly?: boolean;
  externalDocs?: ExternalDocs;
  example?: any;
  [key: any]: VendorExtension;
};

export type PrimitivesItems = {
  type?: "string" | "number" | "integer" | "boolean" | "array";
  format?: string;
  items?: PrimitivesItems;
  collectionFormat?: CollectionFormat;
  default?: Default;
  maximum?: Maximum;
  exclusiveMaximum?: ExclusiveMaximum;
  minimum?: Minimum;
  exclusiveMinimum?: ExclusiveMinimum;
  maxLength?: MaxLength;
  minLength?: MinLength;
  pattern?: Pattern;
  maxItems?: MaxItems;
  minItems?: MinItems;
  uniqueItems?: UniqueItems;
  enum?: Enum;
  multipleOf?: MultipleOf;
  [key: any]: VendorExtension;
};

export type Security = Array<SecurityRequirement>;

export type SecurityRequirement = { [key: any]: Array<string>;
};

export type Xml = {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
  [key: any]: VendorExtension;
};

export type Tag = {
  name: string;
  description?: string;
  externalDocs?: ExternalDocs;
  [key: any]: VendorExtension;
};

export type SecurityDefinitions = { [key: any]: BasicAuthenticationSecurity | ApiKeySecurity | Oauth2ImplicitSecurity | Oauth2PasswordSecurity | Oauth2ApplicationSecurity | Oauth2AccessCodeSecurity;
};

export type BasicAuthenticationSecurity = {
  type: "basic";
  description?: string;
  [key: any]: VendorExtension;
};

export type ApiKeySecurity = {
  type: "apiKey";
  name: string;
  in: "header" | "query";
  description?: string;
  [key: any]: VendorExtension;
};

export type Oauth2ImplicitSecurity = {
  type: "oauth2";
  flow: "implicit";
  scopes?: Oauth2Scopes;
  authorizationUrl: string;
  description?: string;
  [key: any]: VendorExtension;
};

export type Oauth2PasswordSecurity = {
  type: "oauth2";
  flow: "password";
  scopes?: Oauth2Scopes;
  tokenUrl: string;
  description?: string;
  [key: any]: VendorExtension;
};

export type Oauth2ApplicationSecurity = {
  type: "oauth2";
  flow: "application";
  scopes?: Oauth2Scopes;
  tokenUrl: string;
  description?: string;
  [key: any]: VendorExtension;
};

export type Oauth2AccessCodeSecurity = {
  type: "oauth2";
  flow: "accessCode";
  scopes?: Oauth2Scopes;
  authorizationUrl: string;
  tokenUrl: string;
  description?: string;
  [key: any]: VendorExtension;
};

export type Oauth2Scopes = { [key: any]: string;
};

export type MediaTypeList = Array<MimeType>;

export type ParametersList = Array<Parameter | JsonReference>;

export type SchemesList = Array<"http" | "https" | "ws" | "wss">;

export type CollectionFormat = "csv" | "ssv" | "tsv" | "pipes";

export type CollectionFormatWithMulti = "csv" | "ssv" | "tsv" | "pipes" | "multi";

export type Title = string;

export type Description = string;

export type Default = any;

export type MultipleOf = number;

export type Maximum = number;

export type ExclusiveMaximum = boolean;

export type Minimum = number;

export type ExclusiveMinimum = boolean;

export type MaxLength = number;

export type MinLength = number;

export type Pattern = string;

export type MaxItems = number;

export type MinItems = number;

export type UniqueItems = boolean;

export type Enum = Array<any>;

export type JsonReference = {
  $ref: string;
};

export type Swagger = {
  swagger: "2.0";
  info: Info;
  host?: string;
  basePath?: string;
  schemes?: SchemesList;
  consumes?: MediaTypeList;
  produces?: MediaTypeList;
  paths: Paths;
  definitions?: Definitions;
  parameters?: ParameterDefinitions;
  responses?: ResponseDefinitions;
  security?: Security;
  securityDefinitions?: SecurityDefinitions;
  tags?: Array<Tag>;
  externalDocs?: ExternalDocs;
  [key: any]: VendorExtension;
};
