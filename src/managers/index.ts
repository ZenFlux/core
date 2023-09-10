/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import Commands from "../manager-bases/commands";
import Controllers from "../manager-bases/controllers";
import Restful from "../manager-bases/restful";
import Internal from "../manager-bases/internal";

import { IAPIConfig } from "../interfaces/";

export const afterInitializeCallbacks: ( () => void )[] = [];

export function initialize( config: IAPIConfig ) {
    commands = new Commands();
    controllers = new Controllers();
    restful = new Restful( config );
    internal = new Internal();
}

export function destroy() {
    commands = {} as Commands;
    controllers = {} as Controllers;
    restful = {} as Restful;
    internal = {} as Internal;
}

export var commands = {} as Commands;
export var controllers = {} as Controllers;
export var restful = {} as Restful;
export var internal = {} as Internal;
