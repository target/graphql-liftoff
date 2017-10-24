import { parserUsage } from '../../utils'

/**
 * Returns a Promise<AST> that resolves after given time.
 * AST is used to build GraphQL schema.
 * @param {string} content - UTF-8 formatted string from stdin, http response, or file content
 * @param {any} options - Object containing parsed Arguments from CLI or direct input from generateSchema in main.ts
 * @returns {Promise<AST>}
 */
export async function parse(content: string, options: any): Promise<AST> {
    let isYAML = false
    if (options.hasOwnProperty('y') || options.hasOwnProperty('yaml')) { isYAML = true }

    const exampleAST: AST = {
        ExampleType: {
            name: 'ExampleType',
            description: 'this is an example description',
            fields: [
                {
                    name: 'exampleField',
                    description: 'example field',
                    // For more information about GraphQL scalar types, see:
                    // http://graphql.org/learn/schema/#scalar-types
                    type: 'String',
                    required: false
                } as GraphQLField
            ] as GraphQLField[]
        } as GraphQLType
    } as AST
    return Promise.resolve(exampleAST)
}

/**
 * Formats data for parser usage printer
 * usage:
 * graphql-liftoff example
 * graphql-liftoff example -h|--help
 *
 * @param {string} parser - Name of the parser
 * @returns {void}
 */
export function usage(parser: string): void {
    const args = [
        {
            short: 'e',
            long: 'example',
            description: 'example argument'
        } as Arg
    ]
    parserUsage(parser, args)
}
