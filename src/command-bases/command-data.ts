/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Each data command should represent a final REST endpoint.
 */
import { ForceMethod } from '../errors/force-method';
import { CommandBase } from './command-base';

import { data } from '../managers/';

export abstract class CommandData extends CommandBase {
    static getName() {
        return 'Core/CommandBases/CommandData';
    }

    /**
     * Function getEndpoint() : Override this method is required to determine endpoint and magic query params.
     * @example
     * ```
     * args = { query: { id: 1 }  };
     * getEndpoint() = '/api/v1/users/{id}';
     * result = '/api/v1/users/1';
     * ```
     */
    getEndpoint(): string {
        throw new ForceMethod( this, 'getEndpoint' );
    }

    apply( args = this.args, options = this.options ) {// eslint-disable-line @typescript-eslint/no-unused-vars
        const endpoint = this.applyEndpointFormat( this.getEndpoint(), args );

        return data.getClient().fetch(
            endpoint, data.currentHttpMethod, args || null
        );
    }

    private applyEndpointFormat( endpoint: string, data: any = {} ): string {
        // Replace query with `magic` placeholders.
        if ( endpoint.includes( '{' ) ) {
            endpoint = endpoint.split( '/' ).map( ( endpointPart ) => {
                const match = endpointPart.match( '\\{(.*?)\\}' );

                if ( match?.length && 'undefined' !== typeof data[ match[ 1 ] ] ) {
                    return data[ match[ 1 ] ];
                }

                return endpointPart;
            } ).join( '/' );
        }

        return endpoint;
    }
}

export default CommandData;
