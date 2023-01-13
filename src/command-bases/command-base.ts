/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Base for all commands, they are all will be managed by the `Commands` managers.
 * @TODO
 *  - Add validateArgs method or find something better.
 */
import ObjectBase from "../core/object-base";

import ForceMethod from "../errors/force-method";

import Logger from "../modules/logger";

import { ICommandArgsInterface, ICommandOptionsInterface } from "../interfaces/commands";

export abstract class CommandBase extends ObjectBase {
    protected args: ICommandArgsInterface = {};
    protected options: ICommandOptionsInterface = {};

    private readonly logger: Logger;

    constructor( args: ICommandArgsInterface = {}, options = {} ) {
        super();

        const name = ( this.constructor as typeof CommandBase ).getName();

        this.logger = new Logger( name, true, {
            sameColor: true,
        } );

        this.logger.startWith( { args, options } );

        this.initialize( args, options );
    }

    initialize( args: ICommandArgsInterface, options: ICommandOptionsInterface ) {
        this.args = args;
        this.options = options;
    }

    apply( args = this.args, options = this.options ): any {// eslint-disable-line @typescript-eslint/no-unused-vars
        throw new ForceMethod( this, "apply" );
    }

    async run() {
        this.onBeforeApply && this.onBeforeApply();

        const result = await this.apply( this.args, this.options );

        this.onAfterApply && this.onAfterApply();

        return result;
    }

    getArgs() {
        return this.args;
    }

    getOptions() {
        return this.options;
    }

    onBeforeApply?():void;

    onAfterApply?():void;
}

export default CommandBase;
