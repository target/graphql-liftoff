export function buildSchema(ast: AST): string {
    let output: string = ''
    Object
        .keys(ast)
        .sort()
        .map((n: string, i: number) => {
            // build fields
            let fields = ''
            ast[n].fields
                .sort((a: GraphQLField, b: GraphQLField) => a.name.localeCompare(b.name))
                .map((f: GraphQLField) => {
                    if (f.description) {
                        fields += '\n  # '
                        fields += f.description
                    }
                    fields += '\n  '
                    if (f.required) {
                        fields += `${f.name}: ${f.type}!`
                    } else {
                        fields += `${f.name}: ${f.type}`
                    }
                })

            // print type
            if (ast[n].description) {
                output += `# ${ast[n].description}`
                output += '\n'
            }
            output += `type ${ast[n].name} {${fields}`
            output += '\n}\n\n'
        })
    return output.slice(0, -2) // remove trailing newlines
}
