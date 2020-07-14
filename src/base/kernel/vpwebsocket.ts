import * as WebSocket from 'ws';

export class PubSubMessage {
    public messageType = '';
    public topic       = '';
    public payLoad     = '';
}

export class WebSocketServer {
    private static INSTANCE : WebSocketServer = new WebSocketServer();

    private wss : any;

    public static getInstance() : WebSocketServer{
        return WebSocketServer.INSTANCE;
    }

    public setWss(wss : WebSocket.Server){
        this.wss = wss;
    }

    public publish(topic : string, message : any){
        this.wss.clients.forEach((client : any) => {
            if(client.topics.indexOf(topic) < 0) {
                return;
            }

            let pubsub = new PubSubMessage();
            pubsub.messageType = 'message';
            pubsub.topic       = topic;
            pubsub.payLoad     = message;

            (<WebSocket>client).send(JSON.stringify(pubsub));
        });
    }
}

export class VPWebSocket {
    private webSocket : any;

    constructor (private ws : WebSocket){
        this.webSocket = ws;

        if (!this.webSocket.topics){
            this.webSocket.topics = [];
        }
    }

    private prepareObject(message : string) : any{
        if (message == null || message == undefined){
            return null;
        }

        try{
            let obj = JSON.parse(message);

            if (!obj.messageType || obj.messageType == null || obj.messageType == undefined || obj.messageType == ''){
                return null;
            }

            if (!obj.topic || obj.topic == null || obj.topic == undefined || obj.topic == ''){
                return null;
            }

            if (!obj.payLoad){
                obj.payLoad = '';
            }

            return obj;
        }catch(e){            
            console.log(e);
            return null;
        }        
    }

    private subscribe(pubSubMessage : PubSubMessage){
        if (pubSubMessage.messageType != 'subscribe'){
            return;
        }
        
        if (this.webSocket.topics.indexOf(pubSubMessage.topic) >= 0){
            return;
        }

        this.webSocket.topics.push(pubSubMessage.topic);
    }

    private unSubscribe(pubSubMessage : PubSubMessage){
        if (pubSubMessage.messageType != 'unsubscribe'){
            return;
        }

        if (!this.webSocket.topics){
            return;
        }

        let index = this.webSocket.topics.indexOf(pubSubMessage.topic);
        
        if (index < 0){
            return;
        }        

        this.webSocket.topics.splice(index, 1);
    }

    public processMessage(message : string){
        let pubSubMessage = this.prepareObject(message);

        if (pubSubMessage == null){
            return;
        }

        this.subscribe(pubSubMessage);
        this.unSubscribe(pubSubMessage);
    }
}