import * as yml from 'js-yaml'
import * as converter from 'oas-raml-converter'
import { convertSnakeToCamel, parserUsage } from '../../utils'

let isYAML: boolean = false
let isPrefix: boolean = false
let isCamelCase: boolean = false

let prefix: string = ''
export async function parse(content: string, options: any): Promise<AST> {
    if (optionSet(options, 'c', 'camel-case')) { isCamelCase = true }
    if (optionSet(options, 'p', 'prefix-type-name')) {
        prefix = String(getOptionValue(options, 'p', 'prefix-type-name'))
        isPrefix = true
    }
    if (optionSet(options, 'y', 'yaml')) { isYAML = true }
    const transformer = new converter.Converter(converter.Formats.OAS20, converter.Formats.RAML)
    if (!isYAML) {
        content = yml.safeDump(JSON.parse(content))
    }
    return transformer.getModelFromData(content).then((model: any) => {
        return parseDefinitions(model.types)
    })
}

export function usage(parser: string): void {
    const args = [
        {
            short: 'c',
            long: 'camel-case',
            description: 'convert all keys from snake_case to camelCase'
        },
        {
            short: 'p',
            long: 'prefix-type-name',
            description: '-p "prefix" prefix type names'
        },
        {
            short: 'y',
            long: 'yaml',
            description: 'parse swagger specification of YAML format'
        }
    ]
    parserUsage(parser, args)
}

function parseDefinitions(definitions: any[], ast: AST = {} as AST): AST {
    definitions.map((d: any) => parseDefinition(d, ast))
    if (isCamelCase) { ast = toCamel(ast) }
    if (isPrefix) { ast = addPrefix(ast) }
    return ast
}

function toCamel(ast: AST): AST {
    Object
        .keys(ast)
        .map((n: string, i: number) => {
            ast[n].name = convertSnakeToCamel(ast[n].name)
            ast[n].fields
                .map((f: GraphQLField, fi: number) => {
                    ast[n].fields[fi].name = convertSnakeToCamel(ast[n].fields[fi].name)
                })
        })
    return ast
}

function addPrefix(ast: AST): AST {
    Object
        .keys(ast)
        .map((n: string, i: number) => {
            ast[n].name = prefix + ast[n].name
        })
    return ast
}

function parseDefinition(d: any, ast: AST): void {
    // no duplicate types
    if (!ast[d.name]) {
        if ((d.internalType === 'object' && d.hasOwnProperty('properties')) || !d.internalType) {

            const astType = {} as GraphQLType

            // name and description
            astType.name = d.name
            astType.description = d.description || d._default

            // fields
            astType.fields = d.properties.map((p: any) => {
                let name
                let description
                let type

                name = p.name
                description = p.description || p._default

                if (p.internalType === 'object') {
                    type = p.name
                    parseDefinition(p, ast)
                } else if (p.internaltype === 'array') {
                    type = `[${p.items.reference}]`
                } else {
                    type = convertType(p.internalType)
                }
                return {
                    name,
                    description,
                    type
                }
            })

            // required
            if (d.propsRequired) {
                d.propsRequired.map((r: any) => {
                    const index = astType.fields.findIndex(e => {
                        return e.name === r
                    })
                    astType.fields[index].required = true
                })
            }
            ast[d.name] = astType
        }
    }
}

function convertType(type: string): string {
    // see: http://docs.swagger.io/spec.html#431-primitives
    // see: http://graphql.org/learn/schema/#scalar-types
    switch (type) {
        case 'integer':
        case 'int32':
            return 'Int' // 32-bit
        case 'number':
        case 'float':
        case 'double':
            return 'Float' // double precision
        case 'string':
            return 'String'
        case 'boolean':
            return 'Boolean'
        default:
            return 'String'
    }
}

function optionSet(options: any, short: string, long: string): boolean {
    if (options.hasOwnProperty(short) || options.hasOwnProperty(long)) {
        return true
    }
    return false
}

function getOptionValue(options: any, short: string, long: string): any {
    let i = -1
    if (options.hasOwnProperty(short)) {
        i = Object.keys(options).findIndex(x => x === short)
    } else if (options.hasOwnProperty(long)) {
        i = Object.keys(options).findIndex(x => x === long)
    }
    return Object.keys(options)[i + 1]
}
