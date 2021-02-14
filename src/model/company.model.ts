import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table
export class Company extends Model{

  @PrimaryKey
  @Column(DataType.STRING(45))
  Key: string;

  @Column(DataType.STRING(100))
  Fantasy_Name: string;

  @Column(DataType.STRING(100))
  Company_Name: string;

  @Column(DataType.STRING(45))
  Phone: string;

  @Column(DataType.STRING(100))
  Address: string;

  @Column(DataType.STRING(100))
  City: string;

  @Column(DataType.STRING(100))
  District: string;

  @Column
  Is_Open: number;

  @Column
  Status: number;

  @Column(DataType.STRING(45))
  Zipcode: string;
}