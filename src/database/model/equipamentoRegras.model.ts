import { BaseModel } from "./basemodel";
import { Entity, Property, IEntity } from "mikro-orm";

@Entity()
export class EquipamentoRegras extends BaseModel {
    @Property()
    nome : string = '';

    @Property()
    src : string = '';

    @Property()
    ativo : number = 0;    

    @Property()
    fkEquipamento : string = '';
}

export interface EquipamentoRegras extends IEntity<number> { };