import Commands from "../manager-bases/commands";
import Controllers from "../manager-bases/controllers";
import Data from "../manager-bases/data";
import Internal from "../manager-bases/internal";

import { IAPIConfig } from "./config";

export interface IManagers {
    initialize: ( config: IAPIConfig ) => void;
    destroy: () => void;

    commands: Commands;
    controllers: Controllers;
    data: Data;
    internal: Internal;
}
