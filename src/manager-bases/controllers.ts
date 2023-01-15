/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Responsible for manging controllers, each controller is global singleton instance.
 */
import ObjectBase from "../core/object-base";
import Controller from "../core/controller";

import { ControllerAlreadyRegistered } from "../errors/controller-already-registered";

export class Controllers extends ObjectBase {
    controllers: { [ key: string ]: Controller } = {};

    static getName() {
        return 'Core/Managers/Controllers';
    }

    get( name: string ) {
        return this.controllers[ name ];
    }

    getAll() {
        return this.controllers;
    }

    register( controller: Controller ) {
        if ( this.controllers[ controller.getName() ] ) {
            throw new ControllerAlreadyRegistered( controller );
        }

        // Register.
        this.controllers[ controller.getName() ] = controller;

        return controller;
    }
}

export default Controllers;
