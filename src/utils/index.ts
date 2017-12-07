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
    console.log(`usage: ${(pkg as any).name} ${parser} [--key=value|--key|-k] <filename|url|none-for-stdin>\n\noptions:`)
    sorted.map(a => {
        console.log(`\t--${a.long},-${a.short}\t${a.description}`)
    })
}

export function convertSnakeToCamel(s: string) {
    return s.replace(/(\_\w)/g, m => m[1].toUpperCase())
}
