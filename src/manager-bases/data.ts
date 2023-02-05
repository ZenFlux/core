/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Responsible for manging data commands which are wrappers for HTTP requests.
 */
import Commands from "./commands";

import { CommandData } from '../command-bases/';

import Http from '../clients/http';

import {
    IAPIConfig,
    ICommandArgsInterface,
    ICommandOptionsInterface,
    TErrorHandlerCallbackType,
    TPossibleHandlersType,
    TResponseFilterCallbackType,
    TResponseHandlerCallbackType,

    E_RESPONSE_HANDLER_TYPE,
    E_HTTP_METHOD_TYPE
} from "../interfaces/";

export class Data extends Commands {
    private static client: Http;

    public currentHttpMethod: E_HTTP_METHOD_TYPE;

    static getName() {
        return 'Core/Managers/Data';
    }

    constructor( Config: IAPIConfig) {
        super();

        Data.client = new Http( Config.baseURL );
    }

    public getClient() {
        return Data.client;
    }

    public get( command: string, args: ICommandArgsInterface = {}, options: ICommandOptionsInterface = {} ) {
        this.currentHttpMethod = E_HTTP_METHOD_TYPE.GET;

        return super.run( command, args, options );
    }

    public update( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = E_HTTP_METHOD_TYPE.PATCH;

        return super.run( command, args, options );
    }

    public delete( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = E_HTTP_METHOD_TYPE.DELETE;

        return super.run( command, args, options );
    }

    public create( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = E_HTTP_METHOD_TYPE.POST;

        return super.run( command, args, options );
    }

    protected async runInstance( command: CommandData, args: ICommandArgsInterface = {}, options: {} = {} ) {
        if ( ! this.currentHttpMethod ) {
            throw new Error( 'Cannot run directly use one of the http methods: "get", "update", "delete, "create' );
        }

        // New args.
        const newArgs = {
            type: this.currentHttpMethod,
            args: {
                query: {},
                data: {},
            },
        };

        if ( E_HTTP_METHOD_TYPE.GET === this.currentHttpMethod ) {
            newArgs.args.query = args;
        } else {
            newArgs.args.data = args;
        }

        args.result = await super.runInstance( command, newArgs, options );

        // Clear method type.
        this.currentHttpMethod = E_HTTP_METHOD_TYPE.__EMPTY__;

        return args.result;
    }

    /**
     * Handlers on return true will swallow the request.
     */
    public setHandler( type: E_RESPONSE_HANDLER_TYPE, callback: TPossibleHandlersType ) {
        switch ( type ) {
            case E_RESPONSE_HANDLER_TYPE.ERROR_HANDLER:
                Data.client.setErrorHandler( callback as TErrorHandlerCallbackType );
                break;
            case E_RESPONSE_HANDLER_TYPE.RESPONSE_FILTER:
                Data.client.setResponseFilter( callback as TResponseFilterCallbackType );
                break;
            case E_RESPONSE_HANDLER_TYPE.RESPONSE_HANDLER:
                Data.client.setResponseHandler( callback as TResponseHandlerCallbackType );
                break;

            default:
                throw new Error( `Unknown handler type: '${ type }'` );
        }
    }
}

export default Data;
