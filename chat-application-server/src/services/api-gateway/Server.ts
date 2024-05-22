/**
 * Cette classe configure les middlewares de proxy pour rediriger les requêtes vers différents services.
 * 
 * @module services/api-gateway/Server
 * 
 */
import App from './App';
import { Services } from '../../utils/Keywords';
import { ApigwLogger as Logger } from '../../modules/logger/Logger';
import SERVICES from '../../config/services.json';

/**
 * @class Server
 * @description Cette classe configure et démarre le serveur API Gateway.
 * @exports Server
 */
class Server {

    /** 
     * L'application Express encapsulée dans la classe App. 
     * @private
     * @readonly
     * @type {App}
     */
    private readonly app: App;

    /** 
     * Le port sur lequel le serveur écoute. 
     * @private
     * @readonly
     * @type {string | number}
     */
    private readonly port: string | number;

    /**
     * @constructor
     * @description Initialise une nouvelle instance de la classe Server.
     */
    constructor() {
        this.app = new App();
        this.port = SERVICES[process.env.NODE_ENV][Services.apigw].port;
    }

    /**
     * Démarre le serveur et écoute sur le port spécifié.
     * @method serve
     * @public
     * @returns {void}
     */
    public readonly serve = (): void => {
        this.app.webServer.listen(this.port, () => {
            Logger.log('Gateway API Server listening on port ' + this.port);
        });
    }
}

/** 
 * Crée une nouvelle instance de Server et démarre le serveur.
 * @ignore
 */
new Server().serve();