import {PublicAction } from '../../base/kernel/publicAction';
import {Get, Post, Put, Patch} from '../../base/decorators';
import { Equipamento } from '../../database/model/equipamento.model';
import { KernelUtils } from '../../base/kernel/kernel-utils';
import { VPUIID } from '../../base/kernel/vpuuid';
import { VPStringUtils } from '../../base/kernel/VPStringUtils';
import { Variavel } from '../../database/model/variavel.model';
import { Evento } from '../../database/model/evento.model';
import { EquipamentoFuncionamento } from '../../database/model/equipamentoFuncionamento.model';
import { EquipamentoRegras } from '../../database/model/equipamentoRegras.model';
import { Execute } from '../eval/execute';

export class EquipamentoAction extends PublicAction {

    @Get('equipamento')
    public async getAll() {
        
        // let funcao = "console.log(await this.lerVariavel('teste2'));this.estaCrescendo('quee-size', 3, 10); this.isOK = true;"

        // const vpEval = new VPEval('41C75610DD074D12913DCFBB6D2C2890');
        // vpEval.evaluate(funcao, () => {
        //     console.log(vpEval.isOK);
        // });
        
        return await this.getRepository(Equipamento).find({status : 1});
    }

    @Get('equipamento/:id')
    public async getById(){
        new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(this.request.params.id));
        
        let equipamento : any = await this.getRepository(Equipamento).findOne(this.request.params.id);
        let equipamentoData = JSON.parse(JSON.stringify(equipamento));

        equipamentoData.funcionamento = [];
        equipamentoData.funcionamento = await this.getRepository(EquipamentoFuncionamento).find({fkEquipamento : this.request.params.id});        

        equipamentoData.regras = [];
        equipamentoData.regras = await this.getRepository(EquipamentoRegras).find({fkEquipamento : this.request.params.id});

        return equipamentoData;
    }

    @Post('equipamento')
    public async post(param : any){
        try{
            new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(param));
        
            let equipamento          = new Equipamento() ;
            equipamento.key          = VPUIID.generate() ;
            equipamento.nome         = param.nome        ;
            equipamento.descricao    = param.descricao   ;
            equipamento.idIntegracao = param.idIntegracao;
            
            await this.getRepository(Equipamento).persistAndFlush(equipamento);           
    
            if (!KernelUtils.isArray(param.funcionamento)){
                return;
            }

            for (const equipFuncionamento of param.funcionamento){
                let equipamentoFuncionamento = new EquipamentoFuncionamento();

                equipamentoFuncionamento.key           = VPUIID.generate();
                equipamentoFuncionamento.fkEquipamento = equipamento.key;
                equipamentoFuncionamento.horaInicial   = equipFuncionamento.horaInicial;
                equipamentoFuncionamento.horaFinal     = equipFuncionamento.horaFinal;
                equipamentoFuncionamento.diaSemana     = equipFuncionamento.diaSemana;
             
                await this.getRepository(EquipamentoFuncionamento).persistAndFlush(equipamentoFuncionamento);
            }

            if (!KernelUtils.isArray(param.regras)){
                return;
            }

            for (const equipRegras of param.regras){
                let equipamentoRegras = new EquipamentoRegras();

                equipamentoRegras.key           = VPUIID.generate();
                equipamentoRegras.fkEquipamento = equipamento.key;
                equipamentoRegras.nome          = equipRegras.nome;
                equipamentoRegras.src           = equipRegras.src;
                equipamentoRegras.ativo         = equipRegras.ativo;                
             
                await this.getRepository(EquipamentoRegras).persistAndFlush(equipamentoRegras);
            }
            
        } catch (e) {
            console.log(e);
        }        
    }

    @Put('equipamento')
    public async put(param : any){
            new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(param));
            new KernelUtils().createExceptionApiError('0003', '', VPStringUtils.isEmpty(param.key));

            let equipamentoData = await this.getRepository(Equipamento).find({key : param.key, status : 1});

            let equipamento = new Equipamento();

            if (!equipamento){
                return;
            }

            equipamento              = equipamentoData[0];
            equipamento.nome         = param.nome;
            equipamento.descricao    = param.descricao;
            equipamento.idIntegracao = param.idIntegracao;

            await this.getRepository(Equipamento).persistAndFlush(equipamento);

            if (!KernelUtils.isArray(param.funcionamento)){
                return;
            }
            
            await this.getRepository(EquipamentoFuncionamento).remove({fkEquipamento : equipamento.key}, true);

            for (let i = 0; i < param.funcionamento.length; i++) {
                const element = param.funcionamento[i];
                
                let equipamentoFuncionamento = new EquipamentoFuncionamento();

                if (!VPStringUtils.isEmpty(element.key)){
                    equipamentoFuncionamento.key  = element.key;
                } else {
                    equipamentoFuncionamento.key  = VPUIID.generate();
                }                
                
                equipamentoFuncionamento.fkEquipamento = equipamento.key;
                equipamentoFuncionamento.horaInicial   = element.horaInicial;
                equipamentoFuncionamento.horaFinal     = element.horaFinal;
                equipamentoFuncionamento.diaSemana     = element.diaSemana;
                equipamentoFuncionamento.status        = 1;

                await this.getRepository(EquipamentoFuncionamento).persistAndFlush(equipamentoFuncionamento);
                
            }
            
            await this.getRepository(EquipamentoRegras).remove({fkEquipamento : equipamento.key}, true);

            for (let i = 0; i < param.regras.length; i++){
                const element = param.regras[i];

                let equipamentoRegras = new EquipamentoRegras();
                
                if (!VPStringUtils.isEmpty(element.key)){                
                    equipamentoRegras.key = element.key;
                } else {
                    equipamentoRegras.key = VPUIID.generate();
                }

                equipamentoRegras.fkEquipamento = equipamento.key;
                equipamentoRegras.nome          = element.nome;
                equipamentoRegras.src           = element.src;
                equipamentoRegras.ativo         = element.ativo;
                equipamentoRegras.status        = 1;

                await this.getRepository(EquipamentoRegras).persistAndFlush(equipamentoRegras);
            }           
    }

    @Patch('equipamento')
    public async patch(obj : any){
        try{
            new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(obj.key));
            
            let sql = ' delete from evento_detalhe ' +
                      ' where (select evento.fk_equipamento ' +
                      '        from evento where evento.key = evento_detalhe.fk_evento)= "' + obj.key + '" ';

            await this.getEM().getConnection().execute(sql.toLowerCase());

            await this.getRepository(Variavel).nativeDelete({fkEquipamento : obj.key});
            await this.getRepository(Evento).nativeDelete({fkEquipamento : obj.key});
            await this.getRepository(Equipamento).nativeDelete({key : obj.key});
            await this.getRepository(EquipamentoFuncionamento).nativeDelete({fkEquipamento : obj.key});
            await this.getRepository(EquipamentoRegras).nativeDelete({fkEquipamento : obj.key});
        } catch (e){
            console.error(e);
        }
    }
}