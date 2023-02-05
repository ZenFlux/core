/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: is base class/object for all classes, responsible for: 'getName', implementation.
 */
import { ForceMethodBase } from "../errors/force-method";

import { IObjectBaseInterface } from "../interfaces/";

let IdCounter = 0;

/**
 * Base class 4 *
 */
export abstract class ObjectBase implements IObjectBaseInterface {
    public virtualId: number = 0;

    static getName(): string {
        throw new ForceMethodBase( "ObjectBase", "getName" );
    }

    constructor() {
        this.virtualId = IdCounter;

        APIIncreaseIdCounter();
    }

    getName(): string {
        return ( this.constructor as typeof ObjectBase ).getName();
    }
}

export function APIResetIdCounter() {
    IdCounter = 0;

    return 0;
}

export function APIIncreaseIdCounter(): number {
    return IdCounter++;
}

export function APIGetIdCounter(): number {
    return IdCounter;
}

export default ObjectBase;
