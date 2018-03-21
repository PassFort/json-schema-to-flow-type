// @flow

import test from 'ava';

import {
  convertSchema,
  flow,
} from '../FlowSchema';

test('should convert allOf', (t) => {
  t.deepEqual(
    convertSchema({
      id: 'AllOf',
      allOf: [{
        type: 'string',
      }, {
        default: 0,
      }],
    }),
    flow('string')
      .id('AllOf'),
  );
});

test('should convert oneOf', t => {
  t.deepEqual(
    convertSchema({
      id: 'OneOf',
      properties: {
        foo: {
          type: 'string',
        },
      },
      oneOf: [
        {
          type: 'object',
          properties: {
            string: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            number: {
              type: 'number',
            },
          },
        },
      ],
    }),

    flow('any')
    .union([
      flow('Object').props({ foo: flow('string'), string: flow('string') }),
      flow('Object').props({ foo: flow('string'), number: flow('number') }),
    ])
    .id('OneOf'),
  );
});

test('should convert multiple properties by allOf', t => {
  t.deepEqual(
    convertSchema({
      id: 'AllOf',
      allOf: [{
        type: 'object',
        properties: {
          string: {
            type: 'string',
          },
        },
      }, {
        type: 'object',
        properties: {
          number: {
            type: 'number',
          },
        },
      }],
    }),

    flow('Object')
      .props({
        string: flow('string'),
        number: flow('number'),
      }).id('AllOf'),
  );
});

test('should convert exact object', t => {
  t.deepEqual(
    convertSchema({
      id: 'Exact',
      properties: {
        number: {
          type: 'number',
        },
        string: {
          type: 'string',
        },
      },
      additionalProperties: false,
    }),
    flow('Object')
      .props({
        string: flow('string'),
        number: flow('number'),
      })
      .id('Exact')
      .setExact(true),
  );
});


test('should error if allOf schemas not compatible', (t) => {
  const error = t.throws(() =>
    convertSchema({
      id: 'AllOf',
      allOf: [{
        type: 'object',
        properties: {
          test: {
            type: 'string',
          },
        },
      }, {
        type: 'object',
        properties: {
          test: {
            type: 'number',
          },
        },
      }],
    }),
  );
  t.is(error.message, 'Failed to merge "allOf" schemas because "type" has different values: "string" and "number".');
});

test('should merge required properties of allOf', (t) => {
  t.deepEqual(
    convertSchema({
      id: 'AllOf',
      allOf: [{
        type: 'object',
        properties: {
          string: {
            type: 'string',
          },
        },
        required: ['string'],
      }, {
        type: 'object',
        properties: {
          number: {
            type: 'number',
          },
        },
        required: ['number'],
      }],
    }),

    flow('Object')
      .props({
        string: flow('string'),
        number: flow('number'),
      },
      ['string', 'number'])
      .id('AllOf'),
  );
});

test('should convert enum', (t) => {
  t.deepEqual(
    convertSchema({
      id: 'Enum',
      type: 'string',
      enum: ['1', '2', '3'],
    }),
    flow('string')
      .id('Enum')
      .enum(['1', '2', '3']),
  );
});

test('should convert multi type', (t) => {
  t.deepEqual(
    convertSchema({
      type: ['string', 'number'],
    }),
    flow()
      .union([
        flow('string'),
        flow('number'),
      ]),
  );
});

test('should convert simple types', (t) => {
  t.deepEqual(
    convertSchema({
      id: 'String',
      type: 'string',
    }),
    flow('string')
      .id('String'),
  );

  t.deepEqual(
    convertSchema({
      id: 'Number',
      type: 'number',
    }),
    flow('number')
      .id('Number'),
  );

  t.deepEqual(
    convertSchema({
      id: 'Integer',
      type: 'integer',
    }),
    flow('number')
      .id('Integer'),
  );

  t.deepEqual(
    convertSchema({
      id: 'Boolean',
      type: 'boolean',
    }),
    flow('boolean')
      .id('Boolean'),
  );

  t.deepEqual(
    convertSchema({
      id: 'Null',
      type: 'null',
    }),
    flow('null')
      .id('Null'),
  );
});


test('should convert Object', (t) => {
  t.deepEqual(
    convertSchema({
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
        number: {
          type: 'number',
        },
      },
      required: ['string'],
    }),
    flow('Object')
      .props({
        string: flow('string'),
        number: flow('number'),
      }, [
        'string',
      ]),
  );
});

test('should convert Object with additionalProps', (t) => {
  t.deepEqual(
    convertSchema({
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
      },
      additionalProperties: true,
    }),
    flow('Object')
      .props({
        string: flow('string'),
      })
      .union([
        flow(),
      ])
      .setExact(false),
  );

  t.deepEqual(
    convertSchema({
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
      },
      additionalProperties: {
        type: 'string',
      },
    }),
    flow('Object')
      .props({
        string: flow('string'),
      })
      .union([
        flow('string'),
      ])
      .setExact(false),
  );
});

test('should convert Array', (t) => {
  t.deepEqual(
    convertSchema({
      type: 'array',
      items: {
        type: 'string',
      },
    }),
    flow('Array')
      .union([
        flow('string'),
      ]),
  );
});
