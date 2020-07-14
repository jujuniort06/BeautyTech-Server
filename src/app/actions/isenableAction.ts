import { PublicAction } from "../../base/kernel/publicAction";
import { Get } from "../../base/decorators";

export class IsEnableAction extends PublicAction{

    @Get('isenabled/:idintegracao')
    public async get(){
        return {
                  enabled : true
               };
    }
}