declare module 'oas-raml-converter'

declare module '*.json' {
    const value: any
    export default value
}

interface Parsers {
    [key:string]: Parser
}

interface Parser {
    parse(content: string, options: any): Promise<AST>
    usage(parser: string): void
}

interface AST {
    [key:string]: GraphQLType
}

interface GraphQLType {
    name: string
    description: string | undefined
    fields: GraphQLField[]
}

interface GraphQLField {
    name: string
    description: string | undefined
    type: string
    required: boolean | undefined
}

interface Arg {
    short: string
    long: string
    description: string
}
