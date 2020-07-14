import { VPRedis } from "../redis/vpredis";
import { VPRedisNames } from "../redis/vpredis-names";
import { Evento } from "../../database/model/evento.model";
import { VPUIID } from "../../base/kernel/vpuuid";
import { VpDate } from "../utils/vpdate";
import { KernelUtils } from "../../base/kernel/kernel-utils";
import { DataBaseConfig } from "../../database/data-base-config";
import { IsSaving } from "../utils/isSaving";
import { VPStringUtils } from "../../base/kernel/VPStringUtils";

const mysql = require('mysql2/promise');
const { Client } = require('@elastic/elasticsearch')

export class EventoBO {
    private elasticSearchClient = new Client({ node: 'http://localhost:9200' });


    private async buscarEventos(){
        const eventos = [];

        for (let i = 0; i < 1000; i++){
            const evento = await VPRedis.getInstance().lpop(VPRedisNames.getFilaEventos());

            if (evento == null && evento == undefined){
                break;                    
            }

            eventos.push(evento);
        }

        return eventos;
    }

    private prepararArrayEventos(eventos : Array<any>) : Array<any>{
        const result : Array<any> = [];

        for(const element of eventos){
            const evento :  Array<any> = [];

            element.key = VPUIID.generate();

            evento.push(element.key);  // key
            evento.push(element.equipamentoData.key); //fk_equipamento
            evento.push(new VpDate().makeDateFromString(element.dataEvento)); //data_evento
            evento.push(element.valor); // valor            
            evento.push(1);
            evento.push(new Date()); // created_at            
            evento.push(new Date()); // updated_at            
            evento.push(element.nome);  // nome
            evento.push(new VpDate().makeTimeFromString(element.horaEvento)); // hora_evento            
            
            if (KernelUtils.isNullOrUndefined(element.variavel) || element.variavel != 1){
                evento.push(2);
            } else {
                evento.push(1);
            }
        
            result.push(evento);
        }

        return result;
    }

    private prepararArrayDetalhes(eventos : Array<any>) : Array<any>{
        const result : Array<any> = [];

        for (const element of eventos) {             
            if (!KernelUtils.isArray(element.detalhe)){            
                continue;
            }

            for (const element_detalhe of element.detalhe){
                const detalhe = [];

                element_detalhe.key = VPUIID.generate();

                detalhe.push(element_detalhe.key);
                detalhe.push(element.key);
                detalhe.push(element_detalhe.nome);
                detalhe.push(element_detalhe.valor);
                detalhe.push(1);
                detalhe.push(new Date());
                detalhe.push(new Date());

                result.push(detalhe);
            }
        }
        return result;
    }


    private gerarEventoInsert() : string{
        return " INSERT INTO `evento` ( `key`, `fk_equipamento`, `data_evento`, `valor`, `status`, `created_at`, `updated_at`, `nome`, `hora_evento`, `variavel`) values ? ";
    }

    private gerarDetalheInsert() : string{
        return " INSERT INTO `evento_detalhe` (`key`, `fk_evento`, `nome`, `valor`, `status`, `created_at`, `updated_at`) VALUES ? ";
    }

    private async salvarDetailsElasticSearch(evento : any){
        try{
            if (!KernelUtils.isArray(evento.detalhe)){
                return;
            }

            for (const element_detalhe of evento.detalhe){
                const detalhe : any = {
                    key : VPUIID.generate(),
                    fkEvento : evento.key,
                    nome : element_detalhe.nome,
                    valor : element_detalhe.valor,
                    createdAt : new Date()
                }

                await this.elasticSearchClient.index({
                    index : 'vp-monitor-detail',
                    body : detalhe
                });
                console.log('Salvando details on elastic search');
            }
        } catch(e){
            console.error('Error on saving detils in elastic search', e);
        }
    }

    private async salvarElasticSearch(eventos : Array<Evento>){
        try{
            for (const evento of eventos){
                const obj : any = {
                    key             : evento.key,
                    dataEvento      : evento.dataEvento,
                    horaEvento      : evento.horaEvento,
                    nome            : evento.nome,
                    variavel        : evento.variavel,
                    createdAt       : new Date(),
                    equipamentoName : (<any>evento).equipamentoData.idIntegracao
                };

                if (!VPStringUtils.isEmpty(evento.valor)){
                    obj.valor = evento.valor;
                }

                if (obj.variavel != 1){
                    obj.variavel = 2;
                } else {
                    obj.variavel = 1;
                }

                await this.elasticSearchClient.index({
                    index : 'vp-monitor',
                    body : obj
                });

                await this.salvarDetailsElasticSearch(evento);
            }
        }catch(e){
            console.log('Error on saving data on elastic search ' + e);
        }
    }

    private async salvarArrayEventos(eventos : Array<Evento>){
        const eventos_array = this.prepararArrayEventos(eventos);
        const detalhes_array = this.prepararArrayDetalhes(eventos);

        const connection = await mysql.createConnection({
            host: DataBaseConfig.getHost(),
            user: DataBaseConfig.getUserName(),
            database: DataBaseConfig.getDataBase(),
            password : DataBaseConfig.getPassword()
        });

        try{
            await connection.beginTransaction();

            await connection.query(this.gerarEventoInsert(), [eventos_array]);

            if (detalhes_array.length > 0){
                await connection.query(this.gerarDetalheInsert(), [detalhes_array]);
            }
            
            await connection.commit();
        } catch(e){
            console.log(e);
            await connection.rollback();
        } finally{
            await connection.end();
        }
    }

    private async save(count: number = 0){
        if (count > 500){
            return;
        }

        const eventos = await this.buscarEventos();

        if (eventos.length <= 0){
            return;
        }

        await this.salvarArrayEventos(eventos);
        await this.salvarElasticSearch(eventos);
        
        await this.save(count + 1);
    }    

    public async salvarEventos(){
        
        if (IsSaving.getInstance().isSaving()){
            return;
        }
        
        console.log('Comecou a salvar no banco de dados ' + new Date());
        IsSaving.getInstance().start();
        try{
            await this.save();
        }catch(e){
            console.log("Error on save data in database " + e);
        } finally{
            IsSaving.getInstance().stop();
        }

        console.log('Acabou de salvar no banco de dados ' + new Date());
    }
}