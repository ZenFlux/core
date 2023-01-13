/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
import CommandBase from "../command-bases/command-base";

export class CommandAlreadyRegistered extends Error {
    constructor( command: typeof CommandBase ) {
        super( `Command: '${ command.getName() }' is already registered` );
    }
}

export default CommandAlreadyRegistered;
