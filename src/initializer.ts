import pkg from "../package.json";

import { IAPIConfig } from "./interfaces/config";

import { destroy, initialize, afterInitializeCallbacks } from "./managers";

import * as exported from './exports';

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


export const CoreAPI = {
    initialize: ( configuration?: IAPIConfig ) => {
        errorInitTwice();

        config = configuration || config;

        initialize( config )

        isInitialized = true;

    },

    destroy: () => {
        destroy();

        isInitialized = false;
    },

    onAfterInitialize: ( callback: () => void ) => {
        afterInitializeCallbacks.push( callback );
    },

    config,

    ...exported,
}

// TODO: Make it available only for development.
if ( ! globalThis?.ZenCore ) globalThis.ZenCore = CoreAPI;

