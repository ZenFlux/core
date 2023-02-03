export type TErrorHandlerCallback = ( data: any ) => boolean;

export type TResponseFilterCallback = ( text: string ) => string;

export type TResponseHandlerCallback = ( text: string) => boolean;

export type TPossibleHandlers = TErrorHandlerCallback | TResponseFilterCallback | TResponseHandlerCallback;

export enum EResponseHandlerType {
    ERROR_HANDLER = 'error_handler',
    RESPONSE_FILTER = 'response_filter',
    RESPONSE_HANDLER = 'response_handler',
}
