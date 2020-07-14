import { IEntity, Property, Entity} from "mikro-orm";
import {BaseModel} from './basemodel';

@Entity()
export class Equipamento extends BaseModel {
    @Property()
    nome : string = '';

    @Property()
    descricao : string = '';

    @Property()
    idIntegracao : string = '';
}

export interface Equipamento extends IEntity<number> { };