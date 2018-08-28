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
    return Object
        .keys(ast)
        .reduce((acc: AST, cur: string, idx: number) => {
            acc[cur] = {
                name: convertSnakeToPascal(ast[cur].name),
                description: ast[cur].description,
                fields: ast[cur].fields.map(f => {
                    f.name = convertSnakeToCamel(f.name)
                    return f
                })
            } as GraphQLType
            return acc
        }, {} as AST)
}

export function addPrefix(ast: AST, prefix: String): AST {
    console.log("inside addPrefix")
    console.log(JSON.stringify(ast))
    const types = Object.keys(ast).map((f: any) => {
        return ast[f].name
    })
    return Object
        .keys(ast)
        .reduce((acc: AST, cur: string) => {
            acc[cur] = {
                name: prefix + ast[cur].name,
                description: ast[cur].description,
                fields: ast[cur].fields.map(f => {
                    if(types.includes(f.type)){
                        f.type = `${prefix}${f.type}`
                    }else if(types.includes(f.type.slice(1, -1))){
                        f.type = `[${prefix}${f.type.slice(1, -1)}]`
                    }
                    return f
                })
            } as GraphQLType
            return acc
        }, {} as AST)
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

export function convertSnakeToPascal(s: string): string {
    return convertSnakeToCamel(s).replace(/^\w/, c => c.toUpperCase())
}

export function inferTypeNameFromArrayName(arrayName: any): string {
    // If the last character of the array name is 's', it removes the last character and conver remaining string to Pascal Case,
    // Otherwise, it simply converts the name to Pascal Case. 
    // It sometime generates name that may not be appropriate e.g.vendorReturnPolicies: [AAA_VendorReturnPolicie] 
    if (arrayName.charAt(arrayName.length - 1) === 's') {
        return convertSnakeToPascal(arrayName.slice(0, -1))
    }else{
        return convertSnakeToPascal(arrayName)
    }
}