import { ZenCore } from "../__shared__";

import { HTTPMethodEnum } from "../../src/enums/http";

describe( 'command-bases', () => {
    describe( 'command-data', () => {
        test( 'getEndpoint()', () => {
            // Arrange
            const dataCommand = new class MyDataCommand extends ZenCore.commandBases.CommandData {
                getEndpoint() {
                    return 'test';
                }
            }

            // Act
            const endpoint = dataCommand.getEndpoint();

            // Assert
            expect( endpoint ).toBe( 'test' );
        } );

        test( 'getEndpoint():: Ensure throws ForceMethod', () => {
            // Arrange
            const dataCommand = new class MyDataCommand extends ZenCore.commandBases.CommandData {}

            // Act
            const endpoint = () => dataCommand.getEndpoint();

            // Assert
            expect( endpoint ).toThrow( ZenCore.errors.ForceMethod );
        } );

        test( 'apply()', async () => {
            // Arrange
            ZenCore.managers.data.getClient().fetch = jest.fn().mockImplementation(
                async ( path: string, method: HTTPMethodEnum, body: {} | null = null ) => {
                    // Fake result.
                    return {
                        path,
                        method,
                        body,
                    }
                } );

            const dataCommand = new class MyDataCommand extends ZenCore.commandBases.CommandData {
                getEndpoint() {
                    return 'custom/endpoint';
                }
            }

            // Act
            const result = await dataCommand.apply();

            // Assert
            expect( result.path ).toEqual( dataCommand.getEndpoint() );
        } );

        test( 'apply():: Ensure applyEndpointFormat()', async () => {
            // Arrange.
            ZenCore.managers.data.getClient().fetch = jest.fn().mockImplementation(
                async ( path: string, method: HTTPMethodEnum, body: {} | null = null ) => {
                    // Fake result.
                    return {
                        path,
                        method,
                        body,
                    }
                } );

            const dataCommand = new class MyDataCommand extends ZenCore.commandBases.CommandData {
                getEndpoint() {
                    return 'custom/endpoint/{id}/whatever/{index}';
                }
            }

            // Act.
            const result = await dataCommand.apply( {
                id: 1,
                index: 3,
            } );

            // Assert.
            expect( result.path ).toEqual( 'custom/endpoint/1/whatever/3' );
        } );
    } );
} );
