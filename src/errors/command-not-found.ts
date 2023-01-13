/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
export class CommandNotFound extends Error {
    constructor( command: string ) {
        super( `Command: '${ command }' is not found` );
    }
}

export default CommandNotFound;
