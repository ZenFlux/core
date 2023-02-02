import Http from '../../src/clients/http';
import { HTTPMethodEnum } from '../../src/enums/http';

describe( 'clients', () => {
    describe( 'http', () => {
        const baseURL = 'http://localhost',
            fetchOriginal = globalThis.fetch;

        let http: Http;

        beforeEach( () => {
            http = new Http( baseURL );
        } );

        afterAll( () => {
            globalThis.fetch = fetchOriginal;
        } );

        test( 'fetch():: returns correct data', async () => {
            // Arrange.
            const mockResponse = { data: 'mock data' },
                mockJsonPromise = Promise.resolve(mockResponse),
                mockFetchPromise = Promise.resolve({
                    text: () => Promise.resolve( JSON.stringify( mockResponse ) ),
                    ok: true,
                    json: () => mockJsonPromise,
                    headers: {
                        get: () => 'application/json'
                    }
                });

            globalThis.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

            // Act.
            const result = await http.fetch('/path', HTTPMethodEnum.GET);

            // Assert.
            expect(result).toEqual(mockResponse);
        });

        test( 'fetch():: returns false on error', async () => {
            // Arrange.
            const mockFetchPromise = Promise.resolve( {
                json: () => {
                    throw new Error();
                }
            } );

            global.fetch = jest.fn().mockImplementation( () => mockFetchPromise );

            // Mute console.error.
            jest.spyOn( console, 'error' ).mockImplementation( () => {} );

            // Act.
            const result = await http.fetch( '/path', HTTPMethodEnum.GET );

            // Assert.
            expect( result ).toBe( false );
        } );

        test( 'fetch():: with POST method sends correct data', async () => {
            // Arrange.
            const mockBody = { key: 'value' },
                mockFetchPromise = Promise.resolve( {
                    json: () => {}
                } );


            global.fetch = jest.fn().mockImplementation( () => mockFetchPromise );

            // Act.
            await http.fetch( 'path', HTTPMethodEnum.POST, mockBody );

            // Assert.
            expect( global.fetch ).toHaveBeenCalledWith(
                baseURL + '/path',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( mockBody ),
                    credentials: 'include',
                },
            );
        } );
    } );
} );
