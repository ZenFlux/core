import type {
    RollupOptions,
    OutputPlugin,
    ModuleFormat,
    OutputOptions
} from 'rollup';

import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import json from "@rollup/plugin-json";
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser';
import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript'

import pkg from './package.json' assert { type: 'json' };

const babelRuntimeVersion = pkg.dependencies[ '@babel/runtime' ].replace( /^[^0-9]*/, '' );

export interface ICommonPluginArgs {
    babelExcludeNodeModules?: boolean;
    babelHelpers?: 'bundled' | 'runtime' | 'inline' | 'external';
    babelRuntimeVersion?: string;
    babelUseESModules?: boolean;
    createDeclaration?: boolean;
    development?: boolean;
    production?: boolean;
    minify?: boolean;
    sourceMap?: boolean;
}

export type FormatType = 'cjs' | 'es' | 'esm' | 'umd-dev' | 'umd-prod'

export interface IMakeConfArgs {
    format: FormatType,
    inputName: string,
    outputName?: string,
    outputFileName: string,
    external?: string[] | RegExp[],
}

export const makePlugins = ( args: ICommonPluginArgs = {} ): OutputPlugin[] => {
    if ( args.development && args.production ) {
        throw new Error( 'Cannot set both development and production.' );
    }

    const plugins = [
        nodeResolve( {
            extensions,
        } ),
    ]

    const tsConfig: RollupTypescriptOptions = {}

    if ( args.sourceMap ) {
        tsConfig.sourceMap = true;
    }

    tsConfig.declaration = args.createDeclaration || false;

    plugins.push( typescript( tsConfig ) )

    const babelConfig: RollupBabelInputPluginOptions = {
        extensions,
        plugins: [],
        babelHelpers: args.babelHelpers,
    };

    if ( args.babelExcludeNodeModules ) {
        babelConfig.exclude = 'node_modules/**';
    }

    if ( args.babelUseESModules ) {
        babelConfig.plugins?.push( [ '@babel/plugin-transform-runtime', {
            version: args.babelRuntimeVersion,
            useESModules: true,
        } ] );
    } else if ( args.babelRuntimeVersion ) {
        babelConfig.plugins?.push( [ '@babel/plugin-transform-runtime', { version: args.babelRuntimeVersion } ] );
    }

    if ( 'bundled' === args.babelHelpers ) {
        babelConfig.skipPreflightCheck = true;
    }

    plugins.push( babel( babelConfig ) );

    plugins.push( json() );

    if ( args.production || args.development ) {
        plugins.push( replace( {
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify( args.production ? 'production' : 'development' ),
        } ) )
    }

    if ( args.minify ) {
        plugins.push( terser( {
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true
            }
        } ) )
    }

    return plugins;
}

export const makeOutput = ( name: string, format: ModuleFormat, ext = 'js' ): OutputOptions => {
    return {
        format,
        file: `dist/${ format }/${ name }.${ ext }`,
        indent: false,
        exports: 'named',
    }
}

const makeConf = ( args: IMakeConfArgs ): RollupOptions => {
    const { format, inputName, external, outputFileName } = args;

    const shared: any = { input: inputName, external },
        result: RollupOptions = { ...shared };

    switch ( format ) {
        case 'cjs': {
            result.output = makeOutput( outputFileName, format );
            result.plugins = makePlugins( {
                createDeclaration: false,
                babelRuntimeVersion: babelRuntimeVersion,
                babelHelpers: 'runtime'
            } );
        }
        break;

        case 'es':
        {
            result.output = makeOutput( outputFileName, format );
            result.plugins = makePlugins( {
                createDeclaration: true,
                babelRuntimeVersion: babelRuntimeVersion,
                babelUseESModules: true,
                babelHelpers: 'runtime',
                // sourceMap: true,
            } );
        }
        break;

        case 'esm': {
            result.output = {
                ... makeOutput( outputFileName, 'es', 'mjs' ),
                name: outputName,
            };
            result.plugins = makePlugins( {
                createDeclaration: false,
                babelRuntimeVersion: babelRuntimeVersion,
                babelHelpers: 'bundled',
                minify: true,
                production: true,
            } );
        }
        break;

        case 'umd-dev': {
            result.output = {
                ...makeOutput( outputFileName, 'umd' ),
                name: outputName,
            };
            result.plugins = makePlugins( {
                createDeclaration: false,
                babelRuntimeVersion: babelRuntimeVersion,
                babelHelpers: 'bundled',
                babelExcludeNodeModules: true,
                development: true,
                // sourceMap: true,
            } );
        }
        break;

        case 'umd-prod': {
            result.output = {
                ...makeOutput( outputFileName, 'umd' ),
                name: outputName,
            };
            result.plugins = makePlugins( {
                createDeclaration: false,
                babelRuntimeVersion: babelRuntimeVersion,
                babelHelpers: 'bundled',
                babelExcludeNodeModules: true,
                minify: true,
                production: true,
            } )
        }
        break;

        default: {
            throw new Error( `Unknown format: ${ format }` );
        }
    }

    return result;
}

const extensions = [ '.ts' ],
    inputName = 'src/index.ts',
    outputName = '@zenflux/core',
    outputFileName = 'zenflux-core',
    external = [
        ...Object.keys( pkg.dependencies || {} ),
    ].map( name => RegExp( `^${name}($|/)` ) );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function rollup( command: Record<string, unknown> ): Promise<RollupOptions | RollupOptions[]> {
    const formats: FormatType[] = [ 'cjs', 'es', 'esm', 'umd-dev', 'umd-prod' ];

    return formats.map( format => makeConf( {
        format,
        inputName,
        outputName,
        outputFileName,
        external,
    } ) );
}

await rollup( {} );
