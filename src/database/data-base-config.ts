export class DataBaseConfig {
    private static userName = 'root';
    private static password = '';
    private static database = 'beautytech';
    private static host     = 'localhost';

    public static getUserName() : string{
        return DataBaseConfig.userName;
    }

    public static getPassword() : string {
        return DataBaseConfig.password;
    }

    public static getDataBase() : string {
        return DataBaseConfig.database;
    }

    public static getHost() : string {
        return DataBaseConfig.host;
    }
}