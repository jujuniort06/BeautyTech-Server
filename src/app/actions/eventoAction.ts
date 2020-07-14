import {PublicAction } from '../../base/kernel/publicAction';
import {Get, Post, Put} from '../../base/decorators';
import { Equipamento } from '../../database/model/equipamento.model';
import { KernelUtils } from '../../base/kernel/kernel-utils';
import { EventoDetalhe } from '../../database/model/eventoDetalhe';
import { VpDate } from '../utils/vpdate';
import {VPRedis} from '../redis/vpredis';
import { WebSocketServer } from '../../base/kernel/vpwebsocket';
import { VPRedisNames } from '../redis/vpredis-names';
import { EventoBO } from '../bo/evento-bo';

export class EventoAction extends PublicAction{

    @Post('equipamento/:idintegracao/evento')
    public async post(param : any){
        try{
            let data        = await this.getRepository(Equipamento).find({
                                                        idIntegracao : this.request.params.idintegracao, 
                                                        status : 1
                                                    });

            if (data.length == 0){
                return;
            }

            for (const element of param.List){
                this.dispatch(data[0], element);
                
                element.equipamentoData = data[0];
                
                await VPRedis.getInstance().rpush(VPRedisNames.getFilaEventos(), element);                
            }

            new EventoBO().salvarEventos();
        }
        catch (e){
            console.log(e);
        }
    }

    @Get('equipamento/evento/:id')
    public async get(){
        new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(this.request.params.id));

        const detalhes = await this.getRepository(EventoDetalhe).find({fkEvento : this.request.params.id},  { orderBy: {nome : "ASC"}});

        return detalhes;
    }
    
         
    @Get('equipamento/:keyequipamento/eventos')
    public async getHistorico(){
        new KernelUtils().createExceptionApiError('0003', '', KernelUtils.isNullOrUndefined(this.request.params.keyequipamento));
        new KernelUtils().createExceptionApiError('0003', 'Data Inicial informada inválida, formato válido yyyy.mm.dd', this.request.query.dataInicialEvento == undefined || this.request.query.dataInicialEvento == null || this.request.query.dataInicialEvento.length != 10);
        new KernelUtils().createExceptionApiError('0003', 'Data Final informada inválida, formato válido yyyy.mm.dd', this.request.query.dataFinalEvento == undefined || this.request.query.dataFinalEvento == null || this.request.query.dataFinalEvento.length != 10);

        let sql = 'SELECT * FROM EVENTO ' +
                  ' WHERE FK_EQUIPAMENTO = "' + this.request.params.keyequipamento + '" ' +
                  ' AND   DATA_EVENTO BETWEEN "' + this.request.query.dataInicialEvento + '" AND "' + this.request.query.dataFinalEvento + '"';        

        if (this.request.query.horaInicial){
            sql = sql + ' AND   HORA_EVENTO >= "' + this.request.query.horaInicial + '"';
        }

        if (this.request.query.horaFinal){
            sql = sql + ' AND   HORA_EVENTO <= "' + this.request.query.horaFinal + '"';
        }
        
        if (this.request.query.nomeEvento){
            if (this.request.query.operatorNomeEvento){
                sql = sql + ' AND   NOME = "' + this.request.query.nomeEvento + '"';
            } else {
                sql = sql + ' AND   NOME LIKE "%' + this.request.query.nomeEvento + '%"';
            }
        }
        
        if (this.request.query.valorEvento){
            if (this.request.query.operatorValorEvento){
                sql = sql + ' AND   VALOR = "' + this.request.query.valorEvento + '"';
            } else {
                sql = sql + ' AND   VALOR LIKE "%' + this.request.query.valorEvento + '%"';
            }            
        }
        
        if (this.request.query.nomeDetalhe){
            if (this.request.query.operatorNomeEventoDetalhe){
                sql = sql + ' AND  EXISTS (                                             ' +                                             
                            '               SELECT                                      ' +                                               
                            '               EVENTO_DETALHE.KEY                          ' +
                            '               FROM EVENTO_DETALHE                         ' +
                            '               WHERE EVENTO_DETALHE.FK_EVENTO = EVENTO.KEY ' +
                            '               AND   EVENTO_DETALHE.STATUS    = 1          ' +
                            '               AND   EVENTO_DETALHE.NOME = "' + this.request.query.nomeDetalhe + '")';
            } else {
                sql = sql + ' AND  EXISTS (                                             ' +                                             
                            '               SELECT                                      ' +                                               
                            '               EVENTO_DETALHE.KEY                          ' +
                            '               FROM EVENTO_DETALHE                         ' +
                            '               WHERE EVENTO_DETALHE.FK_EVENTO = EVENTO.KEY ' +
                            '               AND   EVENTO_DETALHE.STATUS    = 1          ' +
                            '               AND   EVENTO_DETALHE.NOME LIKE "%' + this.request.query.nomeDetalhe + '%")';
            }
        }

        if (this.request.query.valorDetalhe){
            if (this.request.query.operatorValorEventoDetalhe){
                sql = sql + ' AND  EXISTS (                                             ' +                                             
                            '               SELECT                                      ' +                                               
                            '               EVENTO_DETALHE.KEY                          ' +
                            '               FROM EVENTO_DETALHE                         ' +
                            '               WHERE EVENTO_DETALHE.FK_EVENTO = EVENTO.KEY ' +
                            '               AND   EVENTO_DETALHE.STATUS    = 1          ' +
                            '               AND   EVENTO_DETALHE.VALOR = "' + this.request.query.valorDetalhe + '")';
            } else {
                sql = sql + ' AND  EXISTS (                                             ' +                                             
                            '               SELECT                                      ' +                                               
                            '               EVENTO_DETALHE.KEY                          ' +
                            '               FROM EVENTO_DETALHE                         ' +
                            '               WHERE EVENTO_DETALHE.FK_EVENTO = EVENTO.KEY ' +
                            '               AND   EVENTO_DETALHE.STATUS    = 1          ' +
                            '               AND   EVENTO_DETALHE.VALOR LIKE "%' + this.request.query.valorDetalhe + '%")';
            }
        }

        sql = sql + ' ORDER BY EVENTO.DATA_EVENTO DESC, EVENTO.HORA_EVENTO DESC';

        try{
            return await this.getEM().getConnection().execute(sql.toLowerCase());
        }catch(e){
            console.log(e);
        }
    }

    @Get('processevents')
    public async processRedis(){
        new EventoBO().salvarEventos();
    }

    private dispatch(equipament : any, event : any){
        if (equipament == null || equipament == undefined || event == null || event == undefined){
            return;
        }
        
        if (!event.detalhe){
            event.detalhe = [];
        }

        let obj = {
            key: '',
            fk_equipamento: equipament.key,
            data_evento: event.dataEvento,
            hora_evento: event.horaEvento,
            nome: event.nome,
            valor: event.valor,
            created_at: new Date(),
            updated_at: new Date(),
            detalhe: event.detalhe
        }       

        WebSocketServer.getInstance().publish(equipament.key + '-NEW-EVENT', obj);

        if (event.variavel == undefined || event.variavel == 0 || event.variavel == 2){
            return;                        
        }

        let variavel = {
            key: '',
            dataEvento: new VpDate().makeDateTimeFromString(event.dataEvento, event.horaEvento),
            fkEquipamento: equipament.key,
            nome: event.nome,
            valor: event.valor,
            created_at: new Date(),
            updated_at: new Date()
        }

        WebSocketServer.getInstance().publish(equipament.key + '-VARIAVEL', variavel);
    }
}