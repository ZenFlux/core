import { IZenFluxRollupConfig } from "@zenflux/rollup-toolkit";

const config: IZenFluxRollupConfig = {
    format: [ 'cjs', 'es', 'esm', 'umd' ],
    extensions: [ '.ts' ],
    inputFileName: 'src/index.ts',
    outputName: '@zenflux/core',
    outputFileName: 'zenflux-core',
};

export default config;
