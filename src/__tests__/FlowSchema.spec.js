// @flow

import {convertSchema, flow} from '../FlowSchema'

test('should convert allOf', () => {
    expect(
        convertSchema({
            id: 'AllOf',
            allOf: [
                {
                    type: 'string'
                },
                {
                    default: 0
                }
            ]
        })
    ).toEqual(flow('string').id('AllOf'))
})

test('should convert oneOf', () => {
    expect(
        convertSchema({
            id: 'OneOf',
            properties: {
                foo: {
                    type: 'string'
                }
            },
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        string: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        number: {
                            type: 'number'
                        }
                    }
                }
            ]
        })
    ).toEqual(
        flow('any')
            .union([
                flow('Object').props({
                    foo: flow('string'),
                    string: flow('string')
                }),
                flow('Object').props({
                    foo: flow('string'),
                    number: flow('number')
                })
            ])
            .id('OneOf')
    )
})

test('should convert multiple properties by allOf', () => {
    expect(
        convertSchema({
            id: 'AllOf',
            allOf: [
                {
                    type: 'object',
                    properties: {
                        string: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        number: {
                            type: 'number'
                        }
                    }
                }
            ]
        })
    ).toEqual(
        flow('Object')
            .props({
                string: flow('string'),
                number: flow('number')
            })
            .id('AllOf')
    )
})

test('should convert exact object', () => {
    expect(
        convertSchema({
            id: 'Exact',
            properties: {
                number: {
                    type: 'number'
                },
                string: {
                    type: 'string'
                }
            },
            additionalProperties: false
        })
    ).toEqual(
        flow('Object')
            .props({
                string: flow('string'),
                number: flow('number')
            })
            .id('Exact')
            .setExact(true)
    )
})

test('should error if allOf schemas not compatible', () => {
    const error = expect(() =>
        convertSchema({
            id: 'AllOf',
            allOf: [
                {
                    type: 'object',
                    properties: {
                        test: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        test: {
                            type: 'number'
                        }
                    }
                }
            ]
        })
    ).toThrow()
})

test('should merge required properties of allOf', () => {
    expect(
        convertSchema({
            id: 'AllOf',
            allOf: [
                {
                    type: 'object',
                    properties: {
                        string: {
                            type: 'string'
                        }
                    },
                    required: ['string']
                },
                {
                    type: 'object',
                    properties: {
                        number: {
                            type: 'number'
                        }
                    },
                    required: ['number']
                }
            ]
        })
    ).toEqual(
        flow('Object')
            .props(
                {
                    string: flow('string'),
                    number: flow('number')
                },
                ['string', 'number']
            )
            .id('AllOf')
    )
})

test('should convert enum', () => {
    expect(
        convertSchema({
            id: 'Enum',
            type: 'string',
            enum: ['1', '2', '3']
        })
    ).toEqual(
        flow('string')
            .id('Enum')
            .enum(['1', '2', '3'])
    )
})

test('should convert enum', () => {
    expect(
        convertSchema({
            id: 'Enum',
            type: 'string',
            enum: ['1', '2', '3']
        })
    ).toEqual(
        flow('string')
            .id('Enum')
            .enum(['1', '2', '3'])
    )
})

test('should convert multi type', () => {
    expect(
        convertSchema({
            type: ['string', 'number']
        })
    ).toEqual(flow().union([flow('string'), flow('number')]))
})

test('should convert simple types', () => {
    expect(
        convertSchema({
            id: 'String',
            type: 'string'
        })
    ).toEqual(flow('string').id('String'))

    expect(
        convertSchema({
            id: 'Number',
            type: 'number'
        })
    ).toEqual(flow('number').id('Number'))

    expect(
        convertSchema({
            id: 'Integer',
            type: 'integer'
        })
    ).toEqual(flow('number').id('Integer'))

    expect(
        convertSchema({
            id: 'Boolean',
            type: 'boolean'
        })
    ).toEqual(flow('boolean').id('Boolean'))

    expect(
        convertSchema({
            id: 'Null',
            type: 'null'
        })
    ).toEqual(flow('null').id('Null'))
})

test('should convert Object', () => {
    expect(
        convertSchema({
            type: 'object',
            properties: {
                string: {
                    type: 'string'
                },
                number: {
                    type: 'number'
                }
            },
            required: ['string']
        })
    ).toEqual(
        flow('Object').props(
            {
                string: flow('string'),
                number: flow('number')
            },
            ['string']
        )
    )
})

test('should convert Object with additionalProps', () => {
    expect(
        convertSchema({
            type: 'object',
            properties: {
                string: {
                    type: 'string'
                }
            },
            additionalProperties: true
        })
    ).toEqual(
        flow('Object')
            .props({
                string: flow('string')
            })
            .union([flow()])
            .setExact(false)
    )

    expect(
        convertSchema({
            type: 'object',
            properties: {
                string: {
                    type: 'string'
                }
            },
            additionalProperties: {
                type: 'string'
            }
        })
    ).toEqual(
        flow('Object')
            .props({
                string: flow('string')
            })
            .union([flow('string')])
            .setExact(false)
    )
})

test('should convert Array', () => {
    expect(
        convertSchema({
            type: 'array',
            items: {
                type: 'string'
            }
        })
    ).toEqual(flow('Array').union([flow('string')]))
})
