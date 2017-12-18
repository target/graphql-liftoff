import * as pkg from '../../package.json'
import { generateSchema } from '../main'
import { parsers } from '../parsers'

const args: string[] = process.argv.splice(2)

if (args.length === 0) {
    usage()
} else if (args.length === 1) {
    if (args.includes('-h') || args.includes('--help')) {
        usage()
    } else if (!process.stdin.isTTY) {
        useStdin()
    } else {
        args.push('parserUsage')
        exec(args[0], args, false)
    }
} else {
    if (process.stdin.isTTY) {
        if (args.includes('-h') || args.includes('--help')) {
            args.push('parserUsage')
        }
        exec(args[0], args, false)
    } else {
        useStdin()
    }
}

function useStdin(): void {
    const data: string[] = []
    const stdin = process.stdin
    stdin.setEncoding('utf8')
    stdin.resume()

    stdin.on('data', (c: string) => {
        data.push(c)
    })

    stdin.on('end', () => {
        args.push('data=' + data.join(''))
        exec(args[0], args, true)
    })
}

async function exec(parser: string, mArgs: string[], stdin: boolean): Promise<any> {
    let options
    if (args.includes('parserUsage')) {
        options = {
            parserUsage: true,
            parser
        }
    } else {
        options = mArgs.reduce((sum: any, val: string, index: number): any => {
            if (index === 0) {
                sum.parser = val
            } else if (index === mArgs.length - 1 && !stdin) {
                sum.data = val
            } else {
                const parsed = val.replace(/^-+/, '')
                const splitVal = parsed.indexOf('=')

                if (splitVal > 0) {
                    const key = parsed.slice(0, splitVal)
                    const value = parsed.slice(splitVal + 1)

                    if (value === '') {
                        sum[key] = true
                    } else {
                        sum[key] = value
                    }
                } else {
                    sum[parsed] = true
                }
            }
            return sum
        }, {})
    }

    await generateSchema(parser, options).then(schema => {
        if (schema) {
            console.log(schema)
        }
    }).catch(err => {
        console.error(err)
    })
}

function usage(): void {
    console.log(`usage: ${(pkg as any).name} [--help|-h] <parser> [--key=value|-k=value|--key|-k] <filename|url|none-for-stdin>

description:
\t${(pkg as any).name} ${(pkg as any).description}

available parsers:`)
    Object.keys(parsers).sort().map(k => console.log(`\t${k}`))
    console.log()
    console.log(`version:
\t${(pkg as any).version}`)
}
