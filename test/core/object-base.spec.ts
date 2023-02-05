import * as ZenCore from '../../src/';

import shared from "../__shared__";

describe( 'Core', () => {
    describe( 'ObjectBase', () => {
        test( 'constructor()', () => {
            // Arrange.
            const core = new class core1 extends ZenCore.core.ObjectBase {}(),
                core2 = new class core2 extends ZenCore.core.ObjectBase {}();

            // Act.
            const id1 = core.virtualId,
                id2 = core2.virtualId;

            // Assert.
            expect( id1 - shared.initialObjectsCount ).toBe( 0 );
            expect( id2 - shared.initialObjectsCount ).toBe( 1 );
        } );

        test( 'getName()', () => {
            // Arrange.
            const core = class extends ZenCore.core.ObjectBase {
                getName() {
                    return 'ZenCore/Test/GetName'
                }
            }

            // Act.
            const name = new core().getName();

            // Assert.
            expect( name ).toBe( 'ZenCore/Test/GetName' );
        } )

        test( 'getName() : With foreMethodImplementation', () => {
            // Arrange.
            const core = new class core extends ZenCore.core.ObjectBase {
            }();

            // Act.
            expect( () => {
                core.getName();
            } ).toThrow( `ForeMethod implementation: at 'ObjectBase' method: 'getName'` );
        } );
    } );
} );
