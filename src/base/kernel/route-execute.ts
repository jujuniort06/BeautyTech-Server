import {Route} from './route-types';
import {Request, Response } from 'express';
import {AccessControl} from './access_control';
import {KernelUtils} from './kernel-utils';
import { ORM } from '../../database/orm';
import { Action } from './action';
import { EntityManager } from 'mikro-orm';

export class RouteExecute {
    private action : any;

    constructor(private route : Route, private req : Request, private resp : Response){
        this.action = new route.classType.constructor(this.req, this.resp);

        this.execute();
    }

    private async accessControl() : Promise<any> {
        return new AccessControl(this.action, this.req, this.resp).verify();
    }

    private async callMethod() : Promise<any>{
        let result : any = null;

        return new Promise(async (resolvePrincipal, rejectPrincipal) => {
            (<Action>this.action).getEM().transactional((em : any )=> {
                return new Promise(async (resolve, reject) => {
                    try{
                        result = await this.action[this.route.methodName](this.req.body);
    
                        await (<Action>this.action).getEM().flush();
                        resolve();
                    }catch(e){
                        reject(e);
                    }
                });        
            }).then(async (response : any) =>{         
                resolvePrincipal(result);
            }).catch(async (error : any) => {
                rejectPrincipal(new KernelUtils().createExceptionFromException(error));
            });
        });
    } 

    private async execute() : Promise<any> {
        let hasAccess : boolean = false;

        await this.accessControl().then(
            (response : boolean) => {
                hasAccess = response;
            }
        ).catch (error => {
            this.sendError(error);
        });

        if (!hasAccess){
            return;
        }

        await this.callMethod().then(
            (response) => {
                this.sendResponse(response);
            }
        ).catch(error => {
            this.sendError(error);
        });
    }

    
    private sendResponse(data : any =  null) {
        if (data !== null && data !== undefined){
            this.resp.status(this.action.getStatusCode());
            this.resp.json(data);
        } else {
            this.resp.status(this.action.getStatusCode()).end();
        }
    }

    
    private sendError(e : any = null){
        console.log('Error: ' + e);
        if (e.HttpError){
            this.action.statusCode = e.HttpError;
        } else {
            this.action.statusCode = 500;
        }

        let error = new KernelUtils().createErrorApiObject(this.action.statusCode, '', '', '');
        
        if (e.ApiError){
            error.ApiError = e.ApiError;
        }

        if (e.ErrorDescription){
            error.ErrorDescription = e.ErrorDescription;
        }

        if (e.AditionalInfo){
            error.AditionalInfo = e.AditionalInfo;
        }

        this.resp.status(this.action.statusCode);
        this.resp.json(error);
    }
}