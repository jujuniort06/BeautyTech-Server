import { PublicAction } from "../../base/kernel/publicAction";
import { Get } from "../../base/decorators";
import { ProtectedAction } from "../../base/kernel/protectedAction";

export class CronAction extends ProtectedAction{
    
    @Get('/cron')
    public executeCron() : any {
        
    }
}