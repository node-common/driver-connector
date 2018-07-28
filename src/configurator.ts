import * as URL from "url";

export class Configurator {

    protected _clientId: string = null;

    protected _clientKey: string = null;

    protected _proto: string = null;

    protected _host: string = null;

    protected _port: number = null;

    protected _uri: string = null;

    protected _version: number = 1;

    protected _versionPrefix: string = "/api/v";
    
    protected _withPrefix: boolean = false;
    
    protected _withPrefixNoVersion: boolean = false;

    protected _logging: boolean = false;

    protected _checkPath: string = "/oauth/check";

    protected _issuePath: string = "/oauth/token";

    protected _authorizePath: string = "/oauth/authorize";

    protected _allowInsecure: boolean = false;

    constructor() {

    }

    public setPrefixPresence(flag: boolean) : this {
        
        this._withPrefix = flag;
        return this;
        
    }
    
    public setPrefixNoVersion(flag: boolean) : this {
        
        this._withPrefixNoVersion = flag;
	    return this;
	    
    }
    
    public setPrefix(pref: string) : this {
        
        this._versionPrefix = pref;
        return this;
        
    }
    
    public setURI(uri: string) : this {

        this._uri = uri;

        const u = this.urlToComponents(uri);
        this._host = u.host;
        this._proto = u.protocol;
        this._port = u.port;

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

    public setInsecure(flag: boolean) : this {

        this._allowInsecure = flag;
        return this;

    }

    get uri(): string {

        return this._uri;

    }

    get version(): number {

        return this._version;

    }

    get versionPrefix(): string {

        if(this._withPrefix) {
            if(this._withPrefixNoVersion)
	            return this._versionPrefix;
	        return this._versionPrefix + String(this._version);
        }
        else return "";

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

    get isInsecure(): boolean {

        return this._allowInsecure;

    }

    protected urlToComponents(url: string) : {
        protocol: string;
        host: string;
        port: number;
    } {

        const u = URL.parse(url);

        return {
            protocol: u.protocol,
            host: u.hostname,
            port: Number(u.port)
        }

    }

}