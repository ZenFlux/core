import * as ZenCore from "../../src/exports";

describe( 'command-bases', () => {
    describe( 'command-restful', () => {
        test( 'getEndpoint()', () => {
            // Arrange
            const restfulCommand = new class MyDataCommand extends ZenCore.commandBases.CommandRestful {
                getEndpoint() {
                    return 'test';
                }
            };

            // Act
            const endpoint = restfulCommand.getEndpoint();

            // Assert
            expect( endpoint ).toBe( 'test' );
        } );

        test( 'getEndpoint():: Ensure throws ForceMethod', () => {
            // Arrange
            const restfulCommand = new class MyDataCommand extends ZenCore.commandBases.CommandRestful {}

            // Act
            const endpoint = () => restfulCommand.getEndpoint();

            // Assert
            expect( endpoint ).toThrow( ZenCore.errors.ForceMethod );
        } );

        test( 'apply()', async () => {
            // Arrange
            ZenCore.managers.restful.getClient().fetch = jest.fn().mockImplementation(
                async ( path: string, method: ZenCore.interfaces.E_HTTP_METHOD_TYPE, body: {} | null = null ) => {
                    // Fake result.
                    return {
                        path,
                        method,
                        body,
                    }
                } );

            const restfulCommand = new class MyDataCommand extends ZenCore.commandBases.CommandRestful {
                getEndpoint() {
                    return 'custom/endpoint';
                }
            };

            // Act
            const result = await restfulCommand.apply();

            // Assert
            expect( result.path ).toEqual( restfulCommand.getEndpoint() );
        } );

        test( 'apply():: Ensure applyEndpointFormat()', async () => {
            // Arrange.
            ZenCore.managers.restful.getClient().fetch = jest.fn().mockImplementation(
                async ( path: string, method: ZenCore.interfaces.E_HTTP_METHOD_TYPE, body: {} | null = null ) => {
                    // Fake result.
                    return {
                        path,
                        method,
                        body,
                    }
                } );

            const restfulCommand = new class MyDataCommand extends ZenCore.commandBases.CommandRestful {
                getEndpoint() {
                    return 'custom/endpoint/{id}/whatever/{index}';
                }
            }

            // Act.
            const result = await restfulCommand.apply( {
                id: 1,
                index: 3,
            } );

            // Assert.
            expect( result.path ).toEqual( 'custom/endpoint/1/whatever/3' );
        } );
    } );
} );
