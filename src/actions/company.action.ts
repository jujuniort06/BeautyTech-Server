import { Response, Params, Controller, Get, attachControllers, Middleware, Post, Request, Patch, Put} from '@decorators/express';
import { UserMiddleware } from "../middleware/user.middleware";
import { Company } from '../model/company.model';
import { ObjectUtils } from '../utils/ObjectUtils';
import { UIID } from '../utils/Uiid';
import { PrivateAction } from "./private.action";

@Controller('/company', null, [UserMiddleware])
export class CompanyAction extends PrivateAction {

  @Get('/')
  public async Load(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key)){
      response.send();
      return;  
    }

    let company : any = {};

    company.Key    = response.req.query.key;
    company.Status = 1;

    let result = await Company.findOne({where: company, raw: true});

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body)){
      return;
    }

    let company = new Company();

    company.Key          = UIID.generate()               ;
    company.Fantasy_Name = response.req.body.Fantasy_Name;
    company.Status       = 1                             ;

    await user.save();

    let result = await User.findOne({where: {Key: user.Key}, raw: true});
    
    response.send(result);
  }

  @Put('/')
  public async Update(@Response() response, @Request() request){

  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request){

  }
}