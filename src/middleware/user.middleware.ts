import { Middleware } from '@decorators/express';
import { NextFunction } from 'express';
import { Response, Request} from '@decorators/express';
 
export class UserMiddleware implements Middleware {
  public use(@Response() response, @Request() request, next: NextFunction): void {    
    // RequestContext.create(ORM.getInstance().getORM().em, next);
    next();
  }  

}