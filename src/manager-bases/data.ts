/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Responsible for manging data commands which are wrappers for HTTP requests.
 */
import Commands from "./commands";

import { CommandData } from '../command-bases/';

import Http from '../clients/http';

import { HTTPMethodEnum } from "../enums/http";

import { IAPIConfig } from "../interfaces/config";
import { ICommandArgsInterface, ICommandOptionsInterface } from '../interfaces/commands';
import {
    TResponseHandlerCallback,
    TErrorHandlerCallback,
    TResponseFilterCallback,
    EResponseHandlerType,
    TPossibleHandlers,
} from "../interfaces";

export class Data extends Commands {
    private static client: Http;

    public currentHttpMethod: HTTPMethodEnum;

    static getName() {
        return 'Core/Managers/Data';
    }

    constructor( Config: IAPIConfig) {
        super();

        // @ts-ignore
        Data.client = new Http( Config.baseURL );
    }

    public getClient() {
        return Data.client;
    }

    public get( command: string, args: ICommandArgsInterface = {}, options: ICommandOptionsInterface = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.GET;

        return super.run( command, args, options );
    }

    public update( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.PATCH;

        return super.run( command, args, options );
    }

    public delete( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.DELETE;

        return super.run( command, args, options );
    }

    public create( command: string, args: ICommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.POST;

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

        if ( HTTPMethodEnum.GET === this.currentHttpMethod ) {
            newArgs.args.query = args;
        } else {
            newArgs.args.data = args;
        }

        args.result = await super.runInstance( command, newArgs, options );

        // Clear method type.
        this.currentHttpMethod = HTTPMethodEnum.__EMPTY__;

        return args.result;
    }

    /**
     * Handlers on return true will swallow the request.
     */
    public setHandler( type: EResponseHandlerType, callback: TPossibleHandlers ) {
        switch ( type ) {
            case EResponseHandlerType.ERROR_HANDLER:
                Data.client.setErrorHandler( callback as TErrorHandlerCallback );
                break;
            case EResponseHandlerType.RESPONSE_FILTER:
                Data.client.setResponseFilter( callback as TResponseFilterCallback );
                break;
            case EResponseHandlerType.RESPONSE_HANDLER:
                Data.client.setResponseHandler( callback as TResponseHandlerCallback );
                break;

            default:
                throw new Error( `Unknown handler type: '${ type }'` );
        }
    }
}

export default Data;
