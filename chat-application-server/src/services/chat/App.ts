import express from 'express'
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from 'dotenv'
import helmet from "helmet"
import path from 'path'
import fs from 'fs'
import { createServer as createHTTPServer, Server as HTTPServer } from "http"
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https"
import mongoose from 'mongoose'
import Routes from './routes/Routes'



export default class App {

    private readonly _app: express.Application = express()

    private _httpServer: HTTPServer

    private _httpsServer: HTTPSServer

    public get webServer(): HTTPServer | HTTPSServer {
        return process.env.NODE_ENV == "development" ? this._httpServer : this._httpsServer
    }

    public get app(): express.Application {
        return this._app
    }

    constructor() {

        dotenv.config({
            path: fs.existsSync(path.join(path.dirname(process.cwd()), '.env.development')) ? path.join(path.dirname(process.cwd()), '.env.development') : path.join(path.dirname(process.cwd()), '.env')

        })

        this.config()

        Routes.routes(this.app)

    }

    private readonly config = (): void => {
        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        //cors configuration
        this.app.use(cors({
            origin: process.env.DOMAIN_NAME,
        }))

        if (process.env.NODE_ENV == "development")
            this._httpServer = createHTTPServer(this._app)
        else
            this._httpsServer = createHTTPSServer({
                requestCert: true,
                rejectUnauthorized: true,
                key: fs.readFileSync('chemin/vers/votre/cle_privee_client.key'),
                cert: fs.readFileSync('chemin/vers/votre/certificat_client.pem'),
                ca: fs.readFileSync('chemin/vers/ca_certificat_microservice.pem'),
            }, this._app)

        //connection to the database
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("can't connect to mongodb: ", err));

    }

}
