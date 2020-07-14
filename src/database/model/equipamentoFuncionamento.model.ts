import { IEntity, Property, Entity} from "mikro-orm";
import {BaseModel} from './basemodel';

@Entity()
export class EquipamentoFuncionamento extends BaseModel {
    @Property()
    fkEquipamento : string = '';

    @Property()
    horaInicial : string = '';

    @Property()
    horaFinal : string = '';

    @Property()
    diaSemana : number = 0;
}

export interface EquipamentoFuncionamento extends IEntity<number> { };