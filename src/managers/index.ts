/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import Commands from "../manager-bases/commands";
import Controllers from "../manager-bases/controllers";
import Data from "../manager-bases/data";
import Internal from "../manager-bases/internal";

import { IAPIConfig } from "../interfaces/config";

export const afterInitializeCallbacks: ( () => void )[] = [];

export function initialize( config: IAPIConfig ) {
    commands = new Commands();
    controllers = new Controllers();
    data = new Data( config );
    internal = new Internal();
}

export function destroy() {
    commands = {} as Commands;
    controllers = {} as Controllers;
    data = {} as Data;
    internal = {} as Internal;
}

export var commands = {} as Commands;
export var controllers = {} as Controllers;
export var data = {} as Data;
export var internal = {} as Internal;
