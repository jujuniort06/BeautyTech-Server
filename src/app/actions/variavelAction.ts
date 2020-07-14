import { PublicAction } from "../../base/kernel/publicAction";
import { Get, Patch } from "../../base/decorators";
import { KernelUtils } from "../../base/kernel/kernel-utils";
import { VariavelBO } from "../bo/variavel-bo";

export class VariavelAction extends PublicAction{

  @Get('equipamento/:id/variavel')
  public async getAll(){
    new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(this.request.params.id));
    
    return await new VariavelBO(this.getEM()).ler(this.request.params.id);
  }
  
  @Patch('variavel')
  public async patch(obj : any){
    console.log(obj);
    new KernelUtils().createExceptionApiError('0003', '', !KernelUtils.isArray(obj));
    
    for(const element of obj){
      new VariavelBO(this.getEM()).delete(element.key, element.fkEquipamento, element.nome);
    }
  }
}