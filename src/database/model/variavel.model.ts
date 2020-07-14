import { IEntity, Entity, Property, ManyToOne } from "mikro-orm";
import {BaseModel} from './basemodel';
import { Equipamento } from "./equipamento.model";

@Entity()
export class Variavel extends BaseModel{

    @Property()
    fkEquipamento : string = '';

    @Property()
    nome : string = '';

    @Property()
    valor : string = '';

    @Property()
    dataEvento = new Date();
}

export interface Variavel extends IEntity<number> { };