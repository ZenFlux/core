/**
 * TODO: Create a package @zenflux/rollup to handle this mess.
 */
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

const extensions = [ '.ts' ],
    input = 'src/index.ts',
    outputName = '@zenflux/core',
    outputFileName = 'zenflux-core',
    external = [
        ...Object.keys( pkg.dependencies || {} ),
    ].map( name => RegExp( `^${name}($|/)` ) );

interface ICommonPluginArgs {
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

const makePlugins = ( args: ICommonPluginArgs = {} ): OutputPlugin[] => {
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

const makeOutput = ( name: string, format: ModuleFormat, ext = 'js' ): OutputOptions => {
    return {
        format,
        file: `dist/${ format }/${ name }.${ ext }`,
        indent: false,
        exports: 'named',
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function rollup( command: Record<string, unknown> ): Promise<RollupOptions | RollupOptions[]> {
    const shared = {
        input,
        external,
    }, commonJSBuild: RollupOptions = {
        ...shared,
        output: makeOutput( outputFileName, 'cjs' ),
        plugins: makePlugins( {
            createDeclaration: false,
            babelRuntimeVersion: babelRuntimeVersion,
            babelHelpers: 'runtime'
        } ),
    }, esBuild: RollupOptions = {
        ...shared,
        output: makeOutput( outputFileName, 'es' ),
        plugins: makePlugins( {
            createDeclaration: true,
            babelRuntimeVersion: babelRuntimeVersion,
            babelUseESModules: true,
            babelHelpers: 'runtime',
            // sourceMap: true,
        } )
    }, esBrowserBuild: RollupOptions = {
        ...shared,
        output: {
            ...makeOutput( outputFileName, 'es', 'mjs' ),
            name: outputName,
        },
        plugins: makePlugins( {
            createDeclaration: false,
            babelRuntimeVersion: babelRuntimeVersion,
            babelHelpers: 'bundled',
            minify: true,
            production: true,
        } )
    }, umdBuildDev: RollupOptions = {
        ...shared,
        output: {
            ...makeOutput( outputFileName, 'umd' ),
            name: outputName,
        },
        plugins: makePlugins( {
            createDeclaration: false,
            babelRuntimeVersion: babelRuntimeVersion,
            babelHelpers: 'bundled',
            babelExcludeNodeModules: true,
            development: true,
            // sourceMap: true,
        } )
    }, umdBuildProd: RollupOptions = {
        ...shared,
        output: {
            ...makeOutput( outputFileName, 'umd' ),
            name: outputName,
        },
        plugins: makePlugins( {
            createDeclaration: false,
            babelRuntimeVersion: babelRuntimeVersion,
            babelHelpers: 'bundled',
            babelExcludeNodeModules: true,
            minify: true,
            production: true,
        } )
    };

    return [
        commonJSBuild,
        esBuild,
        esBrowserBuild,
        umdBuildDev,
        umdBuildProd,
    ];
}

await rollup( {} );
