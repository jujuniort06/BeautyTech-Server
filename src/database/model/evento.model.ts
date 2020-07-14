import {BaseModel} from './basemodel';
import { OneToOne, Property, OneToMany, IEntity, Entity } from 'mikro-orm';
import {Equipamento} from './equipamento.model';
import {Variavel} from './variavel.model';
import { EventoDetalhe } from './eventoDetalhe';

@Entity()
export class Evento extends BaseModel {
    @Property()
    fkEquipamento : string = '';

    @Property()
    dataEvento = new Date();

    @Property()
    horaEvento = new Date();

    @Property()
    valor   : string = '';

    @Property()
    nome    : string = '';

    variavel : number = 0;

    // @OneToMany()
     //eventoDetalhe = [];
}
export interface Evento extends IEntity<number> { };