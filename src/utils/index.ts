import * as fs from 'fs'
import * as request from 'request'
import * as pkg from '../../package.json'

async function getUrlContents(u: string): Promise<any> {
    return new Promise((resolve, reject) => {
        request(u, {}, (err: any, res: any, body: any) => { // tslint:disable
            if (err) { reject(err) }
            resolve(body)
        })
    })
}

async function getFileContents(f: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf-8', (err, data) => {
            if (err) { reject(err) }
            resolve(data)
        })
    })
}

export async function getContent(s: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let content
        if (/^https?:\/\//.test(s)) {
            content = getUrlContents(s)
        } else if (fs.existsSync(s.slice(0, 260))) {
            content = getFileContents(s)
        } else {
            content = s
        }
        resolve(content)
    })
}

export function parserUsage(parser: string, args: Arg[]) {
    args.push({
        short: 'h',
        long: 'help',
        description: 'Show this help documentation'
    } as Arg)
    const sorted = args.sort((a: Arg, b: Arg) => a.long.localeCompare(b.long))
    console.log(`usage: ${(pkg as any).name} ${parser} [--key=value|-k=value|--key|-k] <filename|url|none-for-stdin>\n\noptions:`)
    sorted.map(a => {
        console.log(`\t--${a.long},-${a.short}\t${a.description}`)
    })
}

function convertSnakeToCamel(s: string): string {
    return s.replace(/(\_\w)/g, m => m[1].toUpperCase())
}

export function toCamel(ast: AST): AST {
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

export function addPrefix(ast: AST, prefix: String): AST {
    Object
        .keys(ast)
        .map((n: string, i: number) => {
            ast[n].name = prefix + ast[n].name
        })
    return ast
}

export function isOptionSet(options: any, short: string, long: string): boolean {
    return options.hasOwnProperty(short) || options.hasOwnProperty(long)
}

export function getOptionValue(options: any, short: string, long: string): any {
    if (options.hasOwnProperty(short)) {
        return options[short]
    } else if (options.hasOwnProperty(long)) {
        return options[long]
    }
}
