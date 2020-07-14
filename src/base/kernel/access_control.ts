import {PublicAction} from './publicAction';
import { ProtectedAction } from './protectedAction';
import {Request, Response } from 'express';

export class AccessControl {
    public constructor(private action : any, private req : Request, private resp : Response){
        
    }

    private verifyIsPrivateAction() : boolean{
        return false;
    }

    private verifyIsPublicAction() : boolean{
        if (this.action instanceof PublicAction){
            return true;
        }

        return false;
    }

    private verifyProtectedAction() : boolean{
        if (!(this.action instanceof ProtectedAction)){
            return false;
        }

        if (this.req.query.apikey == 'FA4B71B066404664A5F3F9BC0520D2D2'){
            return true;
        }

        return false;
    }

    public async verify() : Promise<any>{
        return new Promise (
            (resolve, reject) => {
                if (this.verifyIsPublicAction()){
                    resolve(true);
                    return;
                }

                if (this.verifyProtectedAction()){
                    resolve(true);
                    return;
                }

                if (this.verifyIsPrivateAction()){
                    resolve(true);
                    return;
                }

                reject(false);
            }
        );
    }
}