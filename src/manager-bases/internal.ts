/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Responsible for manging internal commands, To serve commands that are not triggered by user.
 */
import { Commands } from "./commands";

export class Internal extends Commands {
    static getName() {
        return 'Core/Managers/Internal';
    }
}

export default Internal;
