import * as URL from "url";

export class Configurator {

    private _clientId: string = null;

    private _clientKey: string = null;

    private _proto: string = null;

    private _host: string = null;

    private _port: number = null;

    private _uri: string = null;

    private _version: number = 1;

    private _versionPrefix: string = "/api/v";

    private _logging: boolean = false;

    private _checkPath: string = "/oauth/check";

    private _issuePath: string = "/oauth/token";

    private _authorizePath: string = "/oauth/authorize";

    constructor() {

    }

    public setURI(uri: string) : this {

        this._uri = uri;
        this.urlToComponents(uri);

        return this;

    }

    public setVersion(num: number) : this {

        this._version = num;

        return this;

    }

    public setClientId(client: string) : this {

        this._clientId = client;

        return this;

    }

    public setClientKey(key: string) : this {

        this._clientKey = key;

        return this;

    }

    public debugLog(flag: boolean) : this {

        this._logging = flag;

        return this;

    }

    get uri(): string {

        return this._uri;

    }

    get version(): number {

        return this._version;

    }

    get versionPrefix(): string {

        return this._versionPrefix + String(this._version);

    }

    get proto(): string {

        return this._proto;

    }

    get host(): string {

        return this._host;

    }

    get port(): number {

        return this._port;

    }

    get isDebug() : boolean {

        return this._logging;

    }

    get clientId(): string {

        return this._clientId;

    }

    get clientKey(): string {

        return this._clientKey;

    }

    get checkPath(): string {

        return this._checkPath;

    }

    get issuePath(): string {

        return this._issuePath;

    }

    get authorizePath(): string {

        return this._authorizePath;

    }

    private urlToComponents(url: string) {

        const u = URL.parse(url);
        this._proto = u.protocol;
        this._host = u.hostname;
        this._port = Number(u.port);

    }

}