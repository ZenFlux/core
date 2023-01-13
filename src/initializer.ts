import pkg from "../package.json";

import * as exported from './exports';

import { IAPIConfig } from "./interfaces/config";

declare global {
    var ZenCore: any;
}

let isInitialized = false;

function errorInitTwice() {
    if ( isInitialized ) {
        throw new Error( 'ZenCore is already initialized.' );
    }
}

errorInitTwice();

export let config: IAPIConfig = {
    version: pkg.version,
}

const afterInitializeCallbacks: ( () => void )[] = [];

export const CoreAPI = {
    initialize: ( configuration?: IAPIConfig ) => {
        errorInitTwice();

        config = configuration || config;

        exported.managers.commands = new exported.managerBases.Commands();
        exported.managers.controllers = new exported.managerBases.Controllers();
        exported.managers.data = new exported.managerBases.Data( config );
        exported.managers.internal = new exported.managerBases.Internal();

        isInitialized = true;

        afterInitializeCallbacks.forEach( ( callback ) => callback() );
    },

    destroy: () => {
        isInitialized = false;

        exported.managers.commands = {} as exported.managerBases.Commands;
        exported.managers.controllers = {} as exported.managerBases.Controllers
        exported.managers.data = {} as exported.managerBases.Data;
        exported.managers.internal = {} as exported.managerBases.Internal;
    },

    onAfterInitialize: ( callback: () => void ) => {
        afterInitializeCallbacks.push( callback );
    },

    config,

    ...exported,
}

// TODO: Make it available only for development.
if ( ! globalThis?.ZenCore ) globalThis.ZenCore = CoreAPI;

