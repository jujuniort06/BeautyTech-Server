import { IEntity, Entity, Property } from "mikro-orm";
import {BaseModel} from './basemodel';

@Entity()
export class Grupo extends BaseModel {
    @Property()
    nome : string = '';
}

export interface Grupo extends IEntity<number> { };