import sql from 'mssql';
import { config } from './configdb';

class Database{
    private static instance: Database;
    private pool: sql.ConnectionPool | null = null;

    private constructor() {}

    public static getInstance(): Database {
        // SINGLETON
        // Aqui esta el prmer patron en el cual estamos creando una sola instancia de la base de datos
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<sql.ConnectionPool> {
        if (!this.pool) {
            this.pool = await sql.connect(config);
            console.log('Conectado a la base de datos SQL Server');
        }
        return this.pool;
    }

}
export async function connectDB(): Promise<sql.ConnectionPool> {
    return Database.getInstance().connect();
}

export { sql };