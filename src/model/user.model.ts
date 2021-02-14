import { Column, Model, PrimaryKey, Table, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(100))
  Name: string;

  @Column
  Status: number;

  @Column
  Type: number;

  @Column
  Id: number;

  @Column(DataType.STRING(20))
  Password: string;

  @Column(DataType.STRING(20))
  Phone: string;

  @Column(DataType.STRING(45))
  Email: string;

}

// export interface UserTesteI{
//   id: string
//   first_name: string
//   last_name : string
//   email: string
// }

// @Table(
//   {
//     tableName: 'userteste',
//     timestamps: true
//   }
// )

// export class UserTeste extends Model implements UserTesteI {
//   @PrimaryKey
//   @Column
//   id: string
  
//   @Column
//   first_name: string

//   @Column
//   last_name : string

//   @Column
//   email: string
// }

// import { BaseModel } from "./base.model";

// @Entity()
// export class User extends BaseModel {
//   @Property()
//   name: string;

//   @Enum()
//   type: UserType;

//   @Property()
//   id: string;

//   @Property()
//   password : string;

//   @Property()
//   phone: string;

//   @Property()
//   email: string;
// }

// export enum UserType {
//   ADMIN = 'admin',
//   USER  = 'user',
// }