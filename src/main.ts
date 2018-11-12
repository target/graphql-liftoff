import { buildSchema } from './builder';
import { parsers } from './parsers';
import { getContent } from './utils';

export async function generateSchema(
    parser: string,
    options: any
): Promise<string | void> {
    if (parsers.hasOwnProperty(parser)) {
        if (options.hasOwnProperty('parserUsage')) {
            parsers[parser].usage(options.parser);
        } else {
            console.log('options', options);
            return getContent(options.data)
                .then(c => parsers[parser].parse(c, options)) // tslint:disable-line promise-function-async
                .then((r: AST) => buildSchema(r))
                .catch((err: any) => console.error(err));
        }
    } else {
        return Promise.reject(`error: parser '${parser}' does not exist.`);
    }
}
