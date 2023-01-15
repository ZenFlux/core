import shared from "./__shared__";

import { APIGetIdCounter, APIResetIdCounter } from "../src/core/object-base";

beforeAll( async () => {
} )

beforeEach( async () => {
    shared.initZenCore();

    shared.initialObjectsCount = APIGetIdCounter();
} );

afterEach( () => {
    shared.destroyZenCore();

    APIResetIdCounter();

    jest.resetModules();
    jest.restoreAllMocks();
} );
