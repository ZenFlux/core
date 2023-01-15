import * as __ZEN_CORE__ from "../src/exports";

import { IAPIConfig } from "../src/interfaces/config";

export var ZenCore:any = {} as typeof __ZEN_CORE__;

const shared = {
    initialObjectsCount: 0,

    normalizeZenCore: function() {
        ZenCore = __ZEN_CORE__;
    },

    initZenCore: function() {
        this.normalizeZenCore();

        ZenCore.managers.initialize( {} as IAPIConfig )
    },

    destroyZenCore: function() {
        ZenCore.managers.destroy();
    }
}

export default shared;
