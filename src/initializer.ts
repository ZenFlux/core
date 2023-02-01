// @ts-ignore
import * as pkg from "../package.json" assert { type: "json" };

import { IAPIConfig } from "./interfaces/config";

import { destroy, initialize, afterInitializeCallbacks } from "./managers";

import * as exported from './exports';

declare global {
    var ZenCore: any;
    var __ZEN_CORE__IS_INITIALIZED__: boolean;
}

function errorInitTwice() {
    if ( 'undefined' !== typeof __ZEN_CORE__IS_INITIALIZED__ && __ZEN_CORE__IS_INITIALIZED__) {
        throw new Error( 'ZenCore is already initialized.' );
    }
}

errorInitTwice();

export let config: IAPIConfig = {
    version: pkg.version,
};

export const CoreAPI = {
    initialize: ( configuration?: IAPIConfig ) => {
        errorInitTwice();

        config = configuration || config;

        initialize( config );

        globalThis.__ZEN_CORE__IS_INITIALIZED__ = true;

    },

    destroy: () => {
        destroy();

        globalThis.__ZEN_CORE__IS_INITIALIZED__ = false;
    },

    onAfterInitialize: ( callback: () => void ) => {
        afterInitializeCallbacks.push( callback );
    },

    config,

    ...exported,
};

// TODO: Make it available only for development.
if ( ! globalThis?.ZenCore ) globalThis.ZenCore = CoreAPI;

