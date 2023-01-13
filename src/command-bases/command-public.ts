/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 * @description: CommandPublic represents a USER action, every class which inherit from this class will USER action.
 * */
import CommandBase from "./command-base";

export class CommandPublic extends CommandBase {
    static getName() {
        return 'Core/CommandBases/CommandPublic';
    }
}

export default CommandPublic;
