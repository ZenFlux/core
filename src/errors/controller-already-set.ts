/**
 * @author: Leonid Vinikov <leonidvinikov@gmail.com>
 */
export class ControllerAlreadySet extends Error {
    constructor() {
        super( 'Controller already set.' );
    }
}

export default ControllerAlreadySet;
