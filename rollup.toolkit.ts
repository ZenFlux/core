import { IZenToolkitConfig } from "@zenflux/rollup-toolkit";

const config: IZenToolkitConfig = {
    format: [ 'es' ],
    extensions: [ '.ts' ],
    inputFileName: 'src/index.ts',
    outputName: '@zenflux/core',
    outputFileName: 'zenflux-core',
};

export default config;
