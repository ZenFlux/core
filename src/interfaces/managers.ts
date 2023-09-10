import Commands from "../manager-bases/commands";
import Controllers from "../manager-bases/controllers";
import Restful from "../manager-bases/restful";
import Internal from "../manager-bases/internal";

import { IAPIConfig } from "./config";

export interface IManagers {
    initialize: ( config: IAPIConfig ) => void;
    destroy: () => void;

    commands: Commands;
    controllers: Controllers;
    restful: Restful;
    internal: Internal;
}
