import { DataBaseConfig } from "./database.config";

export class DatabaseConnection {
  private static INSTANCE : DatabaseConnection = new DatabaseConnection();
  private connection : any;

  constructor(){
  }

  public static getInstance() : DatabaseConnection{
    return this.INSTANCE;
  }

  public getConnection() {
    return this.connection;
  }

  public async connect(){
    if (this.connection && this.connection.state !== 'disconnected'){
      return;
    }


    const mysql = require('mysql2/promise');
    this.connection = await mysql.createConnection('mysql://' + DataBaseConfig.getUserName() + ':@' + DataBaseConfig.getHost() + ':3306/' + DataBaseConfig.getDataBase());    
  }
}