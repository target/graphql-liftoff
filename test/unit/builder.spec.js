import { buildSchema } from '../../src/builder.ts'

it('should build a basic schema', () => {
    // given
    const ast = {
        example: {
            name: 'example',
            description: 'example description',
            fields: [
                {
                    name: 'exampleField',
                    description: 'exampleField description',
                    type: 'String',
                    required: true
                }
            ]
        }
    }
    const expected = `# example description
type example {
  # exampleField description
  exampleField: String!
}`
    // when
    const result = buildSchema(ast)

    // then
    expect(result).toEqual(expected)
})

it('should build a basic schema with no descriptions', () => {
    // given
    const ast = {
        example: {
            name: 'example',
            fields: [
                {
                    name: 'exampleField',
                    type: 'String',
                    required: true
                }
            ]
        }
    }
    const expected = `type example {
  exampleField: String!
}`
    // when
    const result = buildSchema(ast)

    // then
    expect(result).toEqual(expected)
})

it('should sort types and fields', () => {
    // given
    const ast = {
        zexample: {
            name: 'zexample',
            description: 'zexample description',
            fields: [
                {
                    name: 'zexampleField',
                    description: 'zexampleField description',
                    type: 'String',
                    required: false
                },
                {
                    name: 'exampleField',
                    description: 'exampleField description',
                    type: 'String',
                    required: true
                }
            ]
        },
        example: {
            name: 'example',
            description: 'example description',
            fields: [
                {
                    name: 'exampleField',
                    description: 'exampleField description',
                    type: 'String',
                    required: true
                }
            ]
        }
    }
    const expected = `# example description
type example {
  # exampleField description
  exampleField: String!
}

# zexample description
type zexample {
  # exampleField description
  exampleField: String!
  # zexampleField description
  zexampleField: String
}`
    // when
    const result = buildSchema(ast)

    // then
    expect(result).toEqual(expected)
})
