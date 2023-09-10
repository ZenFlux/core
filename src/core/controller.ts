/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: Responsible for commands, Aka ( CommandsSpace ).
 */
import ObjectBase from "./object-base";

import { CommandRestful, CommandInternal, CommandPublic } from "../command-bases";

import * as managers from "../managers/";

export abstract class Controller extends ObjectBase {
    commands: { [ key: string ]: typeof CommandPublic };
    restful: { [ key: string ]: typeof CommandRestful };
    internal: { [ key: string ]: typeof CommandInternal };

    static getName() {
        return 'Core/Core/Controller';
    }

    public constructor() {
        super();

        this.initialize();
    }

    initialize() {
        this.register();

        this.setupHooks && this.setupHooks();
    }

    register() {
        this.commands = managers.commands.register( this.getCommands(), this ) as
            { [ key: string ]: typeof CommandPublic };

        this.restful = managers.restful.register( this.getRestful(), this ) as
            { [ key: string ]: typeof CommandRestful };

        this.internal = managers.internal.register( this.getInternal(), this ) as
            { [ key: string ]: typeof CommandInternal };
    }

    getCommands(): { [ key: string ]: typeof CommandPublic } {
        return {};
    }

    getRestful(): { [ key: string ]: typeof CommandRestful } {
        return {};
    }

    getInternal(): { [ key: string ]: typeof CommandInternal } {
        return {};
    }

    /**
     * Function setupHooks() : Override this method to setup hooks.
     */
    setupHooks?():void
}

export default Controller;
