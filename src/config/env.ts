import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dbDialect: (process.env.DB_DIALECT || 'sqlite').toLowerCase() as 'sqlite' | 'mysql',
  sqlitePath: process.env.SQLITE_PATH || path.resolve(process.cwd(), 'data', 'videojuegos.sqlite'),
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'ucp_parcial3_videojuegos'
  },
  authors: [
    'Juan David Arboleda Vallecilla',
    'Diego Diaz'
  ],
  subject: 'Metodología de la Programación IV - Parcial 3',
  institution: 'Universidad Católica de Pereira (UCP)',
  teacher: 'Carlos Andrés Cortés'
};
