import { config } from '../config/env.js';
import { IDatabaseAdapter } from './database.interface.js';
import { SqliteAdapter } from './sqlite.adapter.js';
import { MySqlAdapter } from './mysql.adapter.js';

let dbInstance: IDatabaseAdapter | null = null;
let currentEngine: 'sqlite' | 'mysql' = 'sqlite';

export async function getDatabase(): Promise<IDatabaseAdapter> {
  if (dbInstance) {
    return dbInstance;
  }

  if (config.dbDialect === 'mysql') {
    try {
      console.log(`Conectando a MySQL en ${config.mysql.host}:${config.mysql.port}...`);
      const mysqlAdapter = new MySqlAdapter(config.mysql);
      await mysqlAdapter.init();
      dbInstance = mysqlAdapter;
      currentEngine = 'mysql';
      console.log('Base de datos MySQL conectada.');
      return dbInstance;
    } catch (error) {
      console.warn('No se pudo conectar a MySQL:', (error as Error).message);
      console.warn('Usando SQLite como base de datos de respaldo.');
    }
  }

  // SQLite
  console.log(`Inicializando SQLite en ${config.sqlitePath}...`);
  const sqliteAdapter = new SqliteAdapter(config.sqlitePath);
  await sqliteAdapter.init();
  dbInstance = sqliteAdapter;
  currentEngine = 'sqlite';
  console.log('Base de datos SQLite inicializada.');
  return dbInstance;
}

export function getCurrentEngine(): 'sqlite' | 'mysql' {
  return currentEngine;
}
