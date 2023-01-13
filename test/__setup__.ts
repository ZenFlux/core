import ZenCore from '../src/';

import shared from "./__shared__";

import { APIGetIdCounter, APIResetIdCounter } from "../src/core/object-base";

beforeAll( async () => {
    // Do something.
 })

beforeEach(async () => {
    ZenCore.initialize();

    shared.initialObjectsCount = APIGetIdCounter();
} );

afterEach(() => {
    ZenCore.destroy();

    APIResetIdCounter();

    jest.resetModules();
    jest.restoreAllMocks();
} );
