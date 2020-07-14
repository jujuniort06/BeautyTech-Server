import express = require("express");
import { ORM } from "../database/orm";
import * as WebSocket from 'ws';
import * as http from 'http';
import { VPWebSocket, WebSocketServer } from "./kernel/vpwebsocket";
import { Execute } from "../app/eval/execute";

var cors = require('cors');
var bodyParser = require('body-parser');

export class Server {
    private static instance : Server;

    private server : any = null;
    private app    : express.Application;
    private wss    : WebSocket.Server;    

    private constructor(){
        this.app    = express();
        this.server = http.createServer(this.app);
        this.wss    = new WebSocket.Server({server: this.server, path : '/websocket'});

        WebSocketServer.getInstance().setWss(this.wss);

        this.wss.on('connection', (ws : any) => {
            ws.isAlive = true;
            ws.topics = [];

            ws.on('message', (message : string) => {
               console.log(message);
               new VPWebSocket(ws).processMessage(message);
            });

            ws.on('pong', () => {
                ws.isAlive = true;
            });
        });        

        setInterval(() => {
            this.wss.clients.forEach((ws : any) => {
                if (!ws.isAlive){
                    (<WebSocket>ws).terminate();
                    return;
                }

                ws.isAlive = false;
                (<WebSocket>ws).ping(null, false);
            });
        }, 15000);
        
        setInterval(() => {
            new Execute();
        }, 300000);
    }

    public static getInstance() : Server{
        if (Server.instance == null || Server.instance == undefined){
            Server.instance = new Server();
        }

        return Server.instance;
    }

    public build() : void{
        this.prepareExpressApp();
    }

    private async prepareExpressApp() {
        let orm = ORM.getInstance();

        this.app.use(cors({maxAge : 86400}));
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use(bodyParser.urlencoded({limit: '1mb', extended: true }));
        this.app.use((req, res, next) => {
            let request : any = req;
            
            request.em = orm.getORM().em.fork();
            next();
          });
    }

    private reggisterActions() : void {
        require('../app/actions');
    }

    public runExpressApp(port : number) : void {
        this.reggisterActions();

        this.server.listen(port, () => {
            console.log('Server started at ' + port);
        });
    }

    public getExpressApp () : express.Application{
        return this.app;
    }
}