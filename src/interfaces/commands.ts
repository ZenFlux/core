export type CommandCallbackType = ( args?: any, options?: any ) => any;

export interface ICommandArgsInterface {
    [ key: string ]: any;
}

export interface ICommandOptionsInterface {
    [ key: string ]: any;
}

export interface IOnHookAffectInterface {
    [ key: string ]: Array<String>;
}

export interface IOnHookInterface {
    [ key: string ]: Array<CommandCallbackType>;
}
