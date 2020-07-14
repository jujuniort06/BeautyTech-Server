import { PrimaryKey, Property, IEntity } from "mikro-orm";

export abstract class BaseModel {
    @PrimaryKey()
    key : string = '';

    @Property()
    createdAt = new Date();

    @Property( {onUpdate : () => (new Date())})
    updatedAt = new Date();

    @Property()
    status : number = 1;
}

export interface BaseModel extends IEntity<number> { }