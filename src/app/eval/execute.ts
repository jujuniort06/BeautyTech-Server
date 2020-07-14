import { EntityManager } from "mikro-orm";
import { ORM } from "../../database/orm";
import { Equipamento } from "../../database/model/equipamento.model";
import { VPStringUtils } from "../../base/kernel/VPStringUtils";
import { KernelUtils } from "../../base/kernel/kernel-utils";
import { VPEval } from "./vpeval";
import { EquipamentoRegras } from "../../database/model/equipamentoRegras.model";
import { Telegram } from "../../base/telegram/telegram";

export class Execute {

    private entityManager : EntityManager = ORM.getInstance().getORM().em.fork();

    constructor(private fkEquipamento : string = '', private fkRegra : string = ''){
        this.executar();
    }

    private async carregarEquimentos(){
        const where : any = {status: 1};

        if (!VPStringUtils.isEmpty(this.fkEquipamento)){
            where.fkEquipamento = this.fkEquipamento;
        }

        return await this.entityManager.getRepository(Equipamento).findAll(where);
    }

    private async carregarRegras(fkEquipamento : string){        
        let result : any = null;
        const where : any = {fkEquipamento: fkEquipamento, status: 1, ativo : 1};

        if (!VPStringUtils.isEmpty(this.fkRegra)){
            where.key = this.fkRegra;
        }

        result = await this.entityManager.getRepository(EquipamentoRegras).find(where);

        return result;
    }

    private async executarRegra(regra : any){
        return new Promise((resolve, reject) => {
            new VPEval(regra.fkEquipamento).evaluate(regra.src, (response : any) => {
                if (!response.sucess){
                    reject(response);
                    return;
                }
                
                resolve(response);
            });
        });
    }

    private enviarMensagemTelegram(equipamento : any, regras : Array<any>){
        const regrasNegocioProblema = [];
        const regrasFonteProblema   = [];

        /*Telegram.getInstance().sendMsg("👨Cia do Lanche\n"+
                                       "Problemas: \n"+
                                       "* Fila - 15\n"+
                                       "* Imp. Cozinha - 3\n"+
                                       "* Imp. Caixa - 1");*/

        if (KernelUtils.isEmptyArray(regras)){
            return;
        }
    
        for (const regra of regras){            

            if (!KernelUtils.isNullOrUndefined(regra.response)){
                if (!regra.response.ruleOk){
                    regrasNegocioProblema.push(regra);
                }
                continue;
            }

            if (!KernelUtils.isNullOrUndefined(regra.error)){
               regrasFonteProblema.push(regra); 
            }
        }

        if (!KernelUtils.isEmptyArray(regrasNegocioProblema)){
            let message = "CLIENTE COM PROBLEMA\n" + equipamento.nome + "\n" + "Regras:\n";

            for (const regra of regrasNegocioProblema){
                message = message + regra.nome + "\n";
            }

            Telegram.getInstance().sendMsg(message);
        }

        if (!KernelUtils.isEmptyArray(regrasFonteProblema)){
            let message = "PROBLEMAS NO FONTE\n" + equipamento.nome + "\n" + "Regras:\n";

            for (const regra of regrasFonteProblema){
                message = message + regra.nome + "\n";
            }

            Telegram.getInstance().sendMsg(message);
        }
    }

    private async executar(){  
        console.log('Iniciando execução das regras... ' + new Date());  
        const equipamentos = await this.carregarEquimentos();

        if (KernelUtils.isEmptyArray(equipamentos)){
            return;
        }

        for(const equipamento of equipamentos){
            let regras = await this.carregarRegras(equipamento.key);

            if (KernelUtils.isEmptyArray(regras)){
                continue;
            }

            for (const regra of regras){
                await this.executarRegra(regra).then((response) => {
                    regra.response = response;
                }).catch((error : any) => {
                    regra.error = error;
                });
            }

            this.enviarMensagemTelegram(equipamento, regras);
        }
        console.log('Finalizando execução das regras... ' + new Date());
    }
}