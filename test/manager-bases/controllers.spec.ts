import * as ZenCore from "../../src/exports";

describe("managers", () => {
    describe( 'controllers', () => {
        test( 'get() & register()', () => {
            // Arrange.
            const controller = ZenCore.managers.controllers.register( new class MyController extends ZenCore.core.Controller {
                    static getName() {
                        return 'Test/Controller'
                    }
                } );


            // Act - Get controller.
            const result = ZenCore.managers.controllers.get( controller.getName() );

            // Assert.
            expect( result.getName() ).toBe( controller.getName() );
        } );
    } );
} );
