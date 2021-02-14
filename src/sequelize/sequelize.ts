import { Sequelize } from "sequelize-typescript";
import { DataBaseConfig } from "../database/database.config";
import { Company } from "../model/company.model";
import { User } from "../model/user.model";

export class SequelizeORM {
  private static instance : SequelizeORM;
  private sequelize : Sequelize;

  public async createORM() {
    this.sequelize = new Sequelize(DataBaseConfig.getDataBase(), DataBaseConfig.getUserName(), DataBaseConfig.getPassword(), {
      host: DataBaseConfig.getHost(),
      dialect: 'mysql',
      models: [User, Company],
      define:{
        freezeTableName: true
      }
    });
    
    this.sequelize.authenticate().then(async () => {
      try {
        await this.sequelize.sync({force: false});
      } catch (error) {
        console.log(error.message);
      }
    }).catch((error) => {
      console.error('Deu erro ao criar a ORM!', error);
    });
  }

  public static getInstance() : SequelizeORM {
    if (!SequelizeORM.instance) {
      SequelizeORM.instance = new SequelizeORM();
    }

    return SequelizeORM.instance;
  }

  public getSequelizeORM() : Sequelize {
      return this.sequelize;
  }
}