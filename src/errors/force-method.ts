/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import ObjectBase from "../core/object-base";

export class ForceMethodBase extends Error {
    constructor( className: string, methodName: string ) {
        super(
            `ForeMethod implementation: at '${ className }' method: '${ methodName }'`
        );
    }
}

export class ForceMethod extends Error {
    constructor( context: ObjectBase | typeof ObjectBase, methodName: string ) {
        super(
            `ForeMethod implementation: at '${ context.getName() }' method: '${ methodName }'`
        );
    }
}

export default ForceMethod;
