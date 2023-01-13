export interface IAPIConfig {
    /**
     * @description: API version, from `package.json`
     */
    version: string;

    /**
     * @description: API base url for http requests.
     */
    baseURL?: string;
}
