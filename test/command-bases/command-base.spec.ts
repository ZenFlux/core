import * as ZenCore from "../../src/exports";
import { ICommandArgsInterface } from "../../src/interfaces/commands";

describe( 'command-bases' , () => {
    describe( 'command-base', () => {
        test( 'initialize()', () => {
            // Arrange.
            const args: ICommandArgsInterface = {
                    test: 'test',
                },
                options = {
                    test: 'test',
                };

            const CommandClass = class Command extends ZenCore.commandBases.CommandBase {
                static getName() {
                    return 'ZenCore/Commands/Command/Test'
                }
            };

            const instance = new CommandClass( args, options );

            // Act.
            instance.initialize( args, options )

            // Assert.
            expect( instance.getArgs() ).toEqual( args );
            expect( instance.getOptions() ).toEqual( options );
        } );

        test( 'apply()', () => {
            // Arrange.
            const CommandClass = class Command extends ZenCore.commandBases.CommandBase {
                public passed: boolean;

                static getName() {
                    return 'ZenCore/Commands/Command/Test'
                }


                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                apply( args: ICommandArgsInterface = this.args, options: {} = this.options ) {
                    if ( args.passed ) {
                        this.passed = true;
                    }
                }
            };

            const instance = new CommandClass( { passed: true } );

            // Act.
            instance.run();

            // Assert.
            expect( instance.passed ).toBe( true );
        } )
    } );
} );
