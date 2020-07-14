import { EntityManager } from 'mikro-orm';
import { Variavel } from '../../database/model/variavel.model';
import { VPStringUtils } from '../../base/kernel/VPStringUtils';

export class VariavelBO {
    constructor(private em : EntityManager){
        
    }

    public async ler(fkEquipamento : string){
        let variaveis = await this.em.getConnection().execute(' select '+
                                                                ' `key`, '+
                                                                ' `fk_equipamento` as fkEquipamento, '+
                                                                ' `nome`, '+
                                                                ' `status`, '+
                                                                ' `valor`, '+
                                                                ' `created_at` as createdAt, '+
                                                                ' `updated_at` as updatedAt, '+
                                                                ' `data_evento` as dataEvento '+
                                                                ' from `variavel`  '+
                                                                ' where `variavel`.`fk_equipamento` = ? '+
                                                                ' and   `variavel`.`status` = 1 '+
                                                                ' order by `variavel`.`nome`                ', [fkEquipamento]);

        return variaveis;
    }

    public async delete(variavelKey : string, fkEquipamento : string, nome : string = ''){
        if (!VPStringUtils.isEmpty(variavelKey) && !VPStringUtils.isEmpty(fkEquipamento)){
            this.em.getRepository(Variavel).nativeDelete({key : VPStringUtils.trim(variavelKey)});
            //VPRedis.getInstance().del(VPRedisNames.getEquipamentoVariaveis(fkEquipamento));
            return;
        }

        if (!VPStringUtils.isEmpty(fkEquipamento) && !VPStringUtils.isEmpty(nome)){
            this.em.getRepository(Variavel).nativeDelete({fkEquipamento : fkEquipamento, nome : nome});
            //VPRedis.getInstance().del(VPRedisNames.getEquipamentoVariaveis(fkEquipamento));
        }
    }
}