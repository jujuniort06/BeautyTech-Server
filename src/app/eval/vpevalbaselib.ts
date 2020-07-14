import { VPStringUtils } from "../../base/kernel/VPStringUtils";
import { VariavelBO } from "../bo/variavel-bo";
import { ORM } from "../../database/orm";
import { KernelUtils } from "../../base/kernel/kernel-utils";
import moment = require("moment");
import { EntityManager } from "mikro-orm";

export class VPEvalBaseLib {

    private entityManager : EntityManager = ORM.getInstance().getORM().em.fork();

    constructor(private fkEquipamento : string){
        
    }

    private async estaCrescendo(nome : string, periodos : number, tempo : number){
        if (VPStringUtils.isEmpty(nome) || KernelUtils.isNullOrUndefined(periodos) || KernelUtils.isNullOrUndefined(tempo)){
            return false;
        }

        if (periodos < 1 || tempo < 1 || periodos > 50){
            return false;
        }

        let sql = ' select  '+
                  ' evento.valor, '+
                  ' evento.data_evento, '+
                  ' evento.updated_at, '+
                  ' evento.hora_evento '+
                  ' from evento '+
                  ' where evento.fk_equipamento = ? '+
                  ' and   upper(evento.nome) = upper(?) '+
                  ' and   status = 1 '+
                  ' order by evento.updated_at desc '+
                  ' limit ? ';

        let dataset = await this.entityManager.getConnection().execute(sql, [this.fkEquipamento, nome, periodos]);

        if (!KernelUtils.isArray(dataset)){
            return false;
        }

        if (dataset.length < periodos){
            return false;
        }

        let result = true;
        let anterior = null;
        for (let i = 0; i < periodos; i++){
            if (await this.difMinutos(dataset[i].updated_at) > tempo){
                return false;
            }

            if (anterior == null){
                anterior = dataset[i].valor;
                continue;
            }

            if (anterior >= dataset[i].valor && dataset[i].valor > 0){
                anterior = dataset[i].valor;
                continue;
            }

            result = false;
            break;
        }

        return result;
    }

    private async buscarVarNomeInicia(nome : string){
        if (VPStringUtils.isEmpty(nome)){
            return [];
        }

        let sql = " select " + 
                  " variavel.nome " +
                  " from variavel " +
                  " where variavel.fk_equipamento = ? " +
                  " and   upper(variavel.nome) like upper('" + nome +"%') " +
                  " and   status = 1 ";

        let dataset = await this.entityManager.getConnection().execute(sql, [this.fkEquipamento]);

        if (KernelUtils.isEmptyArray(dataset)){
            return [];
        }
                
        return dataset;
    }

    private async difMinutos(value1 : any, value2 : any = new Date()){
        const m1 = moment(value1);
        const m2 = moment(value2);

        const duration = moment.duration(m2.diff(m1));

        const result = duration.asMinutes();

        return result;
    }

    private async lerVariavel(nome : string){
        let variaveis = await new VariavelBO(this.entityManager).ler(this.fkEquipamento);
        
        if (!KernelUtils.isArray(variaveis)){
            return null;
        }

        for (const element of variaveis){
            if (VPStringUtils.equals(element.nome, nome)){
                return element;
            }
        }

        return null;
    }
}