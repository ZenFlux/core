/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import Controller from "../core/controller";

export class ControllerAlreadyRegistered extends Error {
    constructor( controller: Controller ) {
        super( `Controller: '${ controller.getName() }' is already registered` );
    }
}

export default ControllerAlreadyRegistered;
