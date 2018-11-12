import * as swaggerConverter from 'swagger-converter';
import * as swagger2 from '../swagger';

import {
    getOptionValue,
    isOptionSet,
    parserUsage,
    getFileContents
} from '../../utils';

let tempResourceString: String = '';
let tempApiString: String = '';
let resourceListing: Object = {};
let apiDeclarations: Object = {};

export async function parse(content: string, options: any): Promise<AST> {
    if (isOptionSet(options, 'res', 'resource-listing')) {
        tempResourceString = await getFileContents(
            getOptionValue(options, 'res', 'resource-listing')
        );
        resourceListing = JSON.parse(String(tempResourceString));
    }

    if (isOptionSet(options, 'api', 'api-declaration')) {
        tempApiString = await getFileContents(
            getOptionValue(options, 'api', 'api-declaration')
        );
        apiDeclarations = JSON.parse(String(tempApiString));
    }

    const swagger2Document = swaggerConverter.convert(
        resourceListing,
        apiDeclarations
    );

    return swagger2.parse(JSON.stringify(swagger2Document), options);
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
            description:
                '[--prefix-type-name|-prefix]="prefix" prefix type names'
        },
        {
            short: 'res',
            long: 'resource-listing',
            description: ' root Swagger 1.x document'
        },
        {
            short: 'api',
            long: 'api-declaration',
            description:
                'a map with paths from resourceListing as keys and resources as values'
        }
    ];
    parserUsage(parser, args);
}
