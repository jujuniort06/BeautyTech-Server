import {MikroORM, NullCacheAdapter} from 'mikro-orm';
import {Grupo} from './model/grupo.model';
import {Equipamento} from './model/equipamento.model';
import { BaseModel } from './model/basemodel';
import { Variavel } from './model/variavel.model';
import { Evento } from './model/evento.model';
import { EventoDetalhe } from './model/eventoDetalhe';
import { EquipamentoFuncionamento } from './model/equipamentoFuncionamento.model';
import { DataBaseConfig } from './data-base-config';
import { EquipamentoRegras } from './model/equipamentoRegras.model';

export class ORM {
    private static instance : ORM;
    private orm : any;

    private constructor(){
        this.createORM();
    }

    private async createORM() {
        this.orm = await MikroORM.init({
            entities : [BaseModel, Variavel, Equipamento, Evento, EventoDetalhe, EquipamentoFuncionamento, EquipamentoRegras],
            dbName : DataBaseConfig.getDataBase(),
            type :  'mysql',
            user : DataBaseConfig.getUserName(),
            password : DataBaseConfig.getPassword(),
            autoFlush : false,
            debug : false,
            logger : (message : string) => {console.log(message)}
        });
    }

    public static getInstance() : ORM {
        if (!ORM.instance) {
            ORM.instance = new ORM();
        }

        return ORM.instance;
    }

    public getORM() : MikroORM {
        return this.orm;
    }
}