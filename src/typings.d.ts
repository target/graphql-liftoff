declare module 'oas-raml-converter';

declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'swagger-converter' {
    export function listApiDeclarations(
        sourceUrl: String,
        resource: Object
    ): Object;

    export function convert(
        resourceListing: Object,
        apiDeclarations: Object
    ): String;
}

interface Parsers {
    [key: string]: Parser;
}

interface Parser {
    parse(content: string, options: any): Promise<AST>;
    usage(parser: string): void;
}

interface AST {
    [key: string]: GraphQLType;
}

interface GraphQLType {
    name: string;
    description: string | undefined;
    fields: GraphQLField[];
}

interface GraphQLField {
    name: string;
    description: string | undefined;
    type: string;
    required: boolean | undefined;
}

interface Arg {
    short: string;
    long: string;
    description: string;
}
