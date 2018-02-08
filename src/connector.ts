import {Configurator} from "./configurator";
import * as HTTP from "http";
import * as HTTPS from "https";
import {ClientRequest, IncomingMessage, RequestOptions} from "http";
import {URL} from "url";

/**
 *  Simple API driver connector with OAUTH2 authorization token
 *  ------------------------------------------------------------------
 *
 */
export class Connector {

    public handler: ConnectorHandler = null;

    public securedHandler: ConnectorHandler = null;

    public _conf: Configurator = null;

    public _token: OauthTokenInterface = null;

    /**
     * Create new Connector with new Configurator
     * ------------------------------------------------------------------
     */
    constructor() {

        this._conf = new Configurator();

        this.handler = HTTP;

        this.securedHandler = HTTPS;

    }

    /**
     * Apply token of Authorization Token Interface
     * ------------------------------------------------------------------
     * @param {OauthTokenInterface} t
     */
    public setToken(t: OauthTokenInterface) {

        this._token = t;

    }

    /**
     * Set configuration
     * ------------------------------------------------------------------
     * @param {Configurator} conf
     */
    public setConfiguration(conf: Configurator) {

        this._conf = conf;

    }

    /**
     * Connector serving GET request
     * ------------------------------------------------------------------
     * @param {string} path
     * @param {} headers
     * @param {} options        : Options object. If you want pass some additional
     *                          options related to request.
     *
     * @param {boolean} noAuth  : Set this flag to true if you no need connector
     *                          to set up Authorization header from it's own
     *                          key storage. Meaning - this option will turn off
     *                          automatic authentication for request will be produced
     * @returns {Promise}
     */
    public async get(path: string,
                     headers: {[key: string]: string},
                     options: {[key: string]: string} = null,
                     noAuth: boolean = false) : Promise<ConnectionResponse> {

        return new Promise<ConnectionResponse>((resolve, reject) => {

            let handler: ConnectorHandler = null;
            let cbuffer: string = "";

            // Determine protocol which connector will be using (Configuration level)
            if(this._conf.proto === "securedHandler")

                handler = this.securedHandler;

            else

                handler = this.handler;


            // If No Auto Authorization flag is not ON then set auto-authorization
            // for all of requests
            if(!noAuth)
                this.appendTokenInformation(headers);

            // Set Request options to form proper type of Request
            const opt: RequestOptions = {
                method: "GET",
                headers: headers,
                hostname: this._conf.host,
                port: this._conf.port,
                path: this._conf.versionPrefix + path
            };

            const r = handler.request(opt, (res) => {

                res.setEncoding('utf8');

                res.on("data", (chunk: string) => {
                    cbuffer = cbuffer.concat(chunk);
                });

                res.on("end", () => {

                    const result: ConnectionResponse = {
                        status: res.statusCode,
                        message: cbuffer,
                        data: null,
                        error: "",
                        originPath: opt.path,
                        originHeaders: opt.headers,
                        originMethod: opt.method
                    };

                    try {
                        result.data = JSON.parse(cbuffer);
                    } catch (e) {
                        result.error = e.message;
                    }

                    resolve(result);

                });

            });

            r.on("error", (e) => {

                const result: ConnectionResponse = {
                    status: 500,
                    message: e.message,
                    data: null,
                    error: e.message,
                    originPath: opt.path,
                    originHeaders: opt.headers,
                    originMethod: opt.method
                };

                reject(result);

            });

            r.end();

        });

    }

    /**
     * Connector serving POST request
     * ------------------------------------------------------------------
     * @param {string} path
     * @param {} headers
     * @param {} body
     * @param {} options        : Options object. If you want pass some additional
     *                          options related to request.
     *
     * @param {boolean} noAuth  : Set this flag to true if you no need connector
     *                          to set up Authorization header from it's own
     *                          key storage. Meaning - this option will turn off
     *                          automatic authentication for request will be produced
     * @param {} method
     * @returns {Promise}
     */
    public async post(path: string,
                      headers: {[key: string]: string},
                      body: {[key: string]: any},
                      options: {[key: string]: string} = null,
                      noAuth: boolean = false,
                      method = "POST") : Promise<ConnectionResponse> {

        return new Promise<ConnectionResponse>((resolve, reject) => {

            let handler: ConnectorHandler = null;
            let cbuffer: string = "";

            // Determine protocol which connector will be using (Configuration level)
            if(this._conf.proto === "securedHandler")

                handler = HTTPS;

            else

                handler = HTTP;

            const strBody = this.appendContentInformation(body, headers);

            // If No Auto Authorization flag is not ON then set auto-authorization
            // for all of requests
            if(!noAuth)
                this.appendTokenInformation(headers);

            // Set Request options to form proper type of Request
            const opt: RequestOptions = {
                method: method,
                headers: headers,
                hostname: this._conf.host,
                port: this._conf.port,
                path: this._conf.versionPrefix + path
            };

            const r = handler.request(opt, (res) => {

                res.setEncoding('utf8');

                res.on("data", (chunk: string) => {
                    cbuffer = cbuffer.concat(chunk);
                });

                res.on("end", () => {

                    const result: ConnectionResponse = {
                        status: res.statusCode,
                        message: cbuffer,
                        data: null,
                        error: "",
                        originPath: opt.path,
                        originHeaders: opt.headers,
                        originMethod: opt.method
                    };

                    try {
                        result.data = JSON.parse(cbuffer);
                    } catch (e) {
                        result.error = e.message;
                    }

                    resolve(result);

                });

            });

            r.on("error", (e) => {

                const result: ConnectionResponse = {
                    status: 500,
                    message: e.message,
                    data: null,
                    error: e.message,
                    originPath: opt.path,
                    originHeaders: opt.headers,
                    originMethod: opt.method
                };

                reject(result);

            });

            r.write(strBody);

            r.end();

        });

    }

    /**
     * Connector serving DELETE Request
     * ------------------------------------------------------------------
     * @param {string} path
     * @param {} headers
     * @param {} options
     * @param {boolean} noAuth
     * @returns {Promise<ConnectionResponse>}
     */
    public async delete(path: string,
                        headers: {[key:string]:string},
                        options: {[key:string]:string} = null,
                        noAuth: boolean = false) {

        return this.post(path, headers, {}, options, noAuth, "DELETE");

    }

    /**
     * Connector serving PUT Request
     * ------------------------------------------------------------------
     * @param {string} path
     * @param {} headers
     * @param {} body
     * @param {} options
     * @param {boolean} noAuth
     * @returns {Promise<ConnectionResponse>}
     */
    public async put(path: string,
                     headers: {[key:string]:string},
                     body: {[key: string]: any},
                     options: {[key:string]:string} = null,
                     noAuth: boolean = false) {

        return this.post(path, headers, body, options, noAuth, "PUT");

    }

    /**
     * Connector serving PATCH Request
     * ------------------------------------------------------------------
     * @param {string} path
     * @param {} headers
     * @param {} body
     * @param {} options
     * @param {boolean} noAuth
     * @returns {Promise<ConnectionResponse>}
     */
    public async patch(path: string,
                     headers: {[key:string]:string},
                     body: {[key: string]: any},
                     options: {[key:string]:string} = null,
                     noAuth: boolean = false) {

        return this.post(path, headers, body, options, noAuth, "PATCH");

    }

    /**
     * Append body and headers to connection
     * ------------------------------------------------------------------
     * @param body
     * @param {} headers
     * @returns {string}
     */
    private appendContentInformation(body: any, headers: {[key:string]:string}) : string {

        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = String(Buffer.byteLength(body));

        return body;

    }

    /**
     * Append token information to Authorization header
     * ------------------------------------------------------------------
     * @param {} headers
     */
    private appendTokenInformation(headers: {[key:string]:string}) : void {

        if(this._token !== null) {

            headers["Authorization"] = this._token.getAuthorizationString();

        }

    }
    
}

export interface OauthTokenInterface {
    getToken() : string,
    getAuthorizationString() : string
}

export interface ConnectionResponse {
    status?: number;
    message?: string;
    data?: {[key: string] : any} | Array<{[key: string] : any}>;
    error?: string,
    originPath: string,
    originHeaders: {[key: string] : any},
    originMethod: string
}

export interface ConnectorHandler {
    request(options: RequestOptions | string | URL,
            callback?: (res: IncomingMessage) => void) : ClientRequest;
}

export enum AuthTokenType {
    Bearer,
    BasicCredentials
}