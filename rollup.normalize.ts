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

