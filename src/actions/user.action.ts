import { PrivateAction } from "./private.action";
import { Response, Params, Controller, Get, attachControllers, Middleware, Post, Request, Patch, Put} from '@decorators/express';
import { UserMiddleware } from '../middleware/user.middleware';
import { ObjectUtils } from "../utils/ObjectUtils";
import { User } from "../model/user.model";
import { UIID } from "../utils/Uiid";
import { StringUtils } from "../utils/StringUtils";

@Controller('/user', null, [UserMiddleware])
export class UserAction extends PrivateAction {

  @Get('/')
  public async Load(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.query.key)){
      response.send();
      return;  
    }

    let user : any = {};

    user.Key    = response.req.query.key;
    user.Status = 1;

    let result = await User.findOne({where: user, raw: true});

    response.send(result);
  }

  @Post('/')
  public async Save(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body)){
      return;
    }

    let user = new User();

    user.Key      = UIID.generate()           ;
    user.Name     = response.req.body.Name    ;
    user.Password = response.req.body.Password;
    user.Id       = response.req.body.Id      ;
    user.Phone    = response.req.body.Phone   ;
    user.Type     = response.req.body.Type    ;
    user.Email    = response.req.body.Email   ;
    user.Status   = 1                         ;

    await user.save();

    let result = await User.findOne({where: {Key: user.Key}, raw: true});
    
    response.send(result);
  }

  @Put('/')
  public async Update(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body) || (StringUtils.isEmpty(response.req.body.Key))){
      return;
    }

    let user : any = {};

    user.Name     = response.req.body.Name    ;
    user.Password = response.req.body.Password;
    user.Id       = response.req.body.Id      ;
    user.Phone    = response.req.body.Phone   ;
    user.Type     = response.req.body.Type    ;
    user.Email    = response.req.body.Email   ;
    
    await User.update(user, {where: {Key: response.req.body.Key, Status: 1}});

    let result = await User.findOne({where: {Key: response.req.body.Key}, raw: true});

    response.send(result);
  }

  @Patch('/')
  public async Delete(@Response() response, @Request() request){
    if (ObjectUtils.isNullOrUndefined(response.req.body.Key)){
      return;
    }

    await User.update({Status: 2}, {where: {Key: response.req.body.Key}});

    response.send({Key: response.req.body.Key});
  }
}
