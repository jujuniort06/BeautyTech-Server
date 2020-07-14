import { Server } from "./base/server";

process.env.TZ = 'America/Sao_Paulo';

Server.getInstance().build();
Server.getInstance().runExpressApp(3000);