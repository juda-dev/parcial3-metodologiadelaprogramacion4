import { createApp } from './app.js';
import { config } from './config/env.js';
import { getDatabase, getCurrentEngine } from './db/database.js';

async function bootstrap() {
  try {
    console.log('--------------------------------------------------');
    console.log('API REST - Catálogo de Videojuegos');
    console.log('Metodología de la Programación IV - UCP');
    console.log('Autores: Juan David Arboleda Vallecilla & Diego Diaz');
    console.log('--------------------------------------------------');

    // Inicializar base de datos
    await getDatabase();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`\nServidor iniciado en http://localhost:${config.port}`);
      console.log(`Base de datos activa: [${getCurrentEngine().toUpperCase()}]`);
      console.log(`Swagger Docs: http://localhost:${config.port}/api/docs\n`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Cerrando servidor de forma ordenada...');
      server.close(async () => {
        const db = await getDatabase();
        await db.close();
        console.log('👋 Servidor y base de datos desconectados. ¡Hasta pronto!');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
