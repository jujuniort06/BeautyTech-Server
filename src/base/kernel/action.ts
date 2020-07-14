import {Request, Response } from 'express';
import { EntityManager, EntityRepository } from 'mikro-orm';
import { IEntityType, EntityName } from 'mikro-orm/dist/decorators';
;

export class Action {
    private token : string = '';
    private statusCode : number = 200;
    
    constructor(protected request : Request, protected response : Response){

    }

    protected getRepository<T extends IEntityType<T>>(entityName: EntityName<T>): EntityRepository<T>{
        return this.getEM().getRepository(entityName);
    }

    public getEM() : EntityManager{
        let req : any = this.request;

        return req.em;
    }

    public setToken(token : string){
        this.token = token;
    }

    public getToken() : string{
        return this.token;
    }

    public setStatusCode(statusCode : number){
        this.statusCode = statusCode;
    }

    public getStatusCode() : number {
        return this.statusCode;
    }
}