/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Providing a simple wrapper for fetch API.
 */
import ObjectBase from "../core/object-base";

import Logger from '../modules/logger';

import { HTTPMethodEnum } from "../enums/http";

import {
    TErrorHandlerCallback,
    TResponseFilterCallback,
    TResponseHandlerCallback,
} from "../interfaces";

// noinspection ExceptionCaughtLocallyJS

export class Http extends ObjectBase {
    private readonly logger: Logger;

    private readonly apiBaseUrl: string;

    private errorHandler?: TErrorHandlerCallback = undefined;
    private responseFilter?: TResponseFilterCallback = undefined;
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
            if ( ! response.ok ) {
                throw response;
            }

            let responseText = await response.text();

            responseText = this.applyResponseFilter( responseText );

            // TODO: Currently support JSON and plain text.
            if ( response.headers?.get( 'Content-Type' )?.includes( 'application/json' ) ) {
                data = JSON.parse( responseText );
            } else {
                data = responseText;
            }

            if ( this.applyResponseHandler( data ) ) {
                return false;
            }
        } catch ( e ) {
            if ( this.applyErrorHandler( e ) ) {
                return false;
            }

            await Promise.reject( e );
        }

        this.logger.drop( { path }, data );

        return data;
    }

    public setErrorHandler( callback: TErrorHandlerCallback ) {
        if ( this.errorHandler ) {
            throw new Error( 'Error handler already set.' );
        }

        this.errorHandler = callback;
    }

    public setResponseFilter( callback: TResponseFilterCallback ) {
        if ( this.responseFilter ) {
            throw new Error( 'Response filter already set.' );
        }

        this.responseFilter = callback;
    }

    public setResponseHandler( callback: TResponseHandlerCallback ) {
        if ( this.responseHandler ) {
            throw new Error( 'Response handler already set.' );
        }

        this.responseHandler = callback;
    }

    private applyErrorHandler( error: any ) {
        return this.errorHandler && this.errorHandler( error );
    }

    private applyResponseFilter( text: string ) {
        return ( this.responseFilter && this.responseFilter( text ) ) || text;
    }

    private applyResponseHandler( text: string ) {
        return this.responseHandler && this.responseHandler( text );
    }
}

export default Http;
