import { BaseModel } from "./basemodel"
import { IEntity, Property, Entity } from "mikro-orm";

@Entity()
export class EventoDetalhe extends BaseModel{

  @Property()
  fkEvento : string = '';

  @Property()
  valor   : string = '';

  @Property()
  nome    : string = '';
}

export interface EventoDetalhe extends IEntity<number> { };