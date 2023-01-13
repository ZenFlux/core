/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: CommandInternal, is used when part of the logic needed to be in the command but not represent a user action.
 */
import CommandBase from "./command-base";

export class CommandInternal extends CommandBase {
    static getName() {
        return 'Core/CommandBases/CommandInternal';
    }
}

export default CommandInternal;
