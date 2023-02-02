/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Providing a simple wrapper for fetch API.
 */
import ObjectBase from "../core/object-base";

import Logger from '../modules/logger';

import { HTTPMethodEnum } from "../enums/http";

import {
    TErrorHandlerCallback,
    TResponseHandlerCallback,
} from "../interfaces/data";

// noinspection ExceptionCaughtLocallyJS

export class Http extends ObjectBase {
    private readonly logger: Logger;

    private readonly apiBaseUrl: string;

    private errorHandler?: TErrorHandlerCallback = undefined;
    private responseHandler?: TResponseHandlerCallback = undefined;

    static getName() {
        return 'Core/Clients/Http';
    }

    /**
     * Function constructor() : Create the http.
     */
    constructor( apiBaseUrl = 'http://localhost' ) {
        super();

        this.logger = new Logger( Http.getName(), true );

        this.logger.startWith( { apiBaseUrl } );

        this.apiBaseUrl = apiBaseUrl + '/';
    }

    public setResponseHandler( callback: TResponseHandlerCallback ) {
        if ( this.responseHandler ) {
            throw new Error( 'Data handler already set.' );
        }

        this.responseHandler = callback;
    }

    public setErrorHandler( callback: TErrorHandlerCallback ) {
        if ( this.errorHandler ) {
            throw new Error( 'Error handler already set.' );
        }

        this.errorHandler = callback;
    }

    /**
     * Function fetch() : Fetch api.
     */
    async fetch( path: string, method: HTTPMethodEnum, body: any = {} ) {
        this.logger.startWith( { path, method, body } );

        const params: RequestInit = { 'credentials': 'include' }, // Support cookies.
            headers = {};

        if ( [
            HTTPMethodEnum.POST,
            HTTPMethodEnum.PUT,
            HTTPMethodEnum.PATCH,
        ].includes( method ) ) {
            Object.assign( headers, { 'Content-Type': 'application/json' } );
            Object.assign( params, {
                method,
                headers: headers,
                body: JSON.stringify( body )
            } );

        } else {
            Object.assign( params, { headers } );
        }

        const response = await globalThis.fetch( this.apiBaseUrl + path, params );

        let data = undefined;

        try {
            let responseText = await response.text();

            if ( ! response.ok ) {
                throw response;
            } else if ( this.applyResponseHandler( responseText ) ) {
                return false;
            } else if ( response.headers.get( 'Content-Type' )?.includes( 'application/json' ) ) {
                data = JSON.parse( responseText );
            } else {
                throw response;
            }
        } catch ( e ) {
            if ( this.applyErrorHandler( e ) ) {
                return false;
            }

            console.error( e );

            return false;
        }

        this.logger.drop( { path }, data );

        return data;
    }

    private applyErrorHandler( error: any ) {
        return this.errorHandler && this.errorHandler( error );
    }

    private applyResponseHandler( text: string ) {
        return this.responseHandler && this.responseHandler( text );
    }
}

export default Http;
