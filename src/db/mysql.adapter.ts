import mysql, { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { IDatabaseAdapter } from './database.interface.js';
import {
  Game,
  CreateGameDTO,
  UpdateGameDTO,
  PatchGameDTO,
  GameFilters,
  GameStats
} from '../models/game.model.js';
import { initialGames } from './seed-data.js';

export interface MySqlConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export class MySqlAdapter implements IDatabaseAdapter {
  private pool!: Pool;
  private config: MySqlConfig;

  constructor(config: MySqlConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    // Primero nos conectamos sin base de datos para asegurar que la BD exista
    const rootConn = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${this.config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // Ahora creamos el Pool hacia la base de datos de la aplicación
    this.pool = mysql.createPool({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Crear la tabla si no existe (con los 12 campos estructurados)
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS videojuegos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        desarrollador VARCHAR(120) NOT NULL,
        genero VARCHAR(60) NOT NULL,
        plataforma VARCHAR(100) NOT NULL,
        anioLanzamiento INT NOT NULL,
        calificacion DECIMAL(3,1) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        descripcion TEXT NOT NULL,
        imagenUrl VARCHAR(500) NOT NULL,
        enStock TINYINT(1) NOT NULL DEFAULT 1,
        creadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_genero (genero),
        INDEX idx_plataforma (plataforma),
        INDEX idx_calificacion (calificacion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Comprobar si tiene registros
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM videojuegos');
    const total = rows[0]?.total || 0;
    if (total === 0) {
      await this.resetSeed();
    }
  }

  private mapRow(row: any): Game {
    return {
      id: Number(row.id),
      titulo: String(row.titulo),
      desarrollador: String(row.desarrollador),
      genero: String(row.genero),
      plataforma: String(row.plataforma),
      anioLanzamiento: Number(row.anioLanzamiento),
      calificacion: Number(row.calificacion),
      precio: Number(row.precio),
      descripcion: String(row.descripcion),
      imagenUrl: String(row.imagenUrl),
      enStock: Boolean(row.enStock),
      creadoEn: row.creadoEn ? new Date(row.creadoEn).toISOString() : undefined
    };
  }

  public async findAll(filters: GameFilters = {}): Promise<Game[]> {
    let sql = 'SELECT * FROM videojuegos WHERE 1=1';
    const params: any[] = [];

    if (filters.genero) {
      sql += ' AND LOWER(genero) LIKE ?';
      params.push(`%${filters.genero.toLowerCase()}%`);
    }

    if (filters.plataforma) {
      sql += ' AND LOWER(plataforma) LIKE ?';
      params.push(`%${filters.plataforma.toLowerCase()}%`);
    }

    if (filters.search) {
      sql += ' AND (LOWER(titulo) LIKE ? OR LOWER(desarrollador) LIKE ? OR LOWER(descripcion) LIKE ?)';
      const s = `%${filters.search.toLowerCase()}%`;
      params.push(s, s, s);
    }

    if (typeof filters.minCalificacion === 'number') {
      sql += ' AND calificacion >= ?';
      params.push(filters.minCalificacion);
    }

    if (typeof filters.maxPrecio === 'number') {
      sql += ' AND precio <= ?';
      params.push(filters.maxPrecio);
    }

    const validSortFields: Record<string, string> = {
      id: 'id',
      titulo: 'titulo',
      calificacion: 'calificacion',
      precio: 'precio',
      anioLanzamiento: 'anioLanzamiento',
      creadoEn: 'creadoEn'
    };

    const sortBy = validSortFields[filters.sortBy || 'id'] || 'id';
    const order = filters.order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${sortBy} ${order}`;

    const [rows] = await this.pool.query<RowDataPacket[]>(sql, params);
    return rows.map((r) => this.mapRow(r));
  }

  public async findById(id: number): Promise<Game | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM videojuegos WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  public async create(data: CreateGameDTO): Promise<Game> {
    const sql = `
      INSERT INTO videojuegos (
        titulo, desarrollador, genero, plataforma,
        anioLanzamiento, calificacion, precio, descripcion,
        imagenUrl, enStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await this.pool.query<ResultSetHeader>(sql, [
      data.titulo,
      data.desarrollador,
      data.genero,
      data.plataforma,
      data.anioLanzamiento,
      data.calificacion,
      data.precio,
      data.descripcion,
      data.imagenUrl,
      data.enStock ? 1 : 0
    ]);

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Error al recuperar el videojuego creado en MySQL');
    }
    return created;
  }

  public async update(id: number, data: UpdateGameDTO): Promise<Game | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const sql = `
      UPDATE videojuegos SET
        titulo = ?,
        desarrollador = ?,
        genero = ?,
        plataforma = ?,
        anioLanzamiento = ?,
        calificacion = ?,
        precio = ?,
        descripcion = ?,
        imagenUrl = ?,
        enStock = ?
      WHERE id = ?
    `;

    await this.pool.query(sql, [
      data.titulo,
      data.desarrollador,
      data.genero,
      data.plataforma,
      data.anioLanzamiento,
      data.calificacion,
      data.precio,
      data.descripcion,
      data.imagenUrl,
      data.enStock ? 1 : 0,
      id
    ]);

    return this.findById(id);
  }

  public async patch(id: number, data: PatchGameDTO): Promise<Game | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const params: any[] = [];

    const fields: (keyof PatchGameDTO)[] = [
      'titulo',
      'desarrollador',
      'genero',
      'plataforma',
      'anioLanzamiento',
      'calificacion',
      'precio',
      'descripcion',
      'imagenUrl',
      'enStock'
    ];

    for (const field of fields) {
      if (data[field] !== undefined) {
        updates.push(`\`${field}\` = ?`);
        if (field === 'enStock') {
          params.push(data.enStock ? 1 : 0);
        } else {
          params.push(data[field]);
        }
      }
    }

    if (updates.length === 0) return existing;

    params.push(id);
    const sql = `UPDATE videojuegos SET ${updates.join(', ')} WHERE id = ?`;
    await this.pool.query(sql, params);

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>('DELETE FROM videojuegos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  public async getStats(): Promise<GameStats> {
    const [countRows] = await this.pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM videojuegos');
    const total = Number(countRows[0]?.total || 0);

    if (total === 0) {
      return {
        total: 0,
        promedioCalificacion: 0,
        precioPromedio: 0,
        precioMinimo: 0,
        precioMaximo: 0,
        generosDisponibles: 0,
        totalEnStock: 0,
        conteoPorGenero: []
      };
    }

    const [aggRows] = await this.pool.query<RowDataPacket[]>(`
      SELECT
        AVG(calificacion) as avgRating,
        AVG(precio) as avgPrice,
        MIN(precio) as minPrice,
        MAX(precio) as maxPrice,
        SUM(CASE WHEN enStock = 1 THEN 1 ELSE 0 END) as inStockCount
      FROM videojuegos
    `);

    const [genreRows] = await this.pool.query<RowDataPacket[]>(`
      SELECT genero, COUNT(*) as cantidad
      FROM videojuegos
      GROUP BY genero
      ORDER BY cantidad DESC
    `);

    const [bestRows] = await this.pool.query<RowDataPacket[]>(`
      SELECT * FROM videojuegos
      ORDER BY calificacion DESC, id DESC
      LIMIT 1
    `);

    const agg = aggRows[0] || {};

    return {
      total,
      promedioCalificacion: Math.round(Number(agg.avgRating || 0) * 10) / 10,
      precioPromedio: Math.round(Number(agg.avgPrice || 0) * 100) / 100,
      precioMinimo: Math.round(Number(agg.minPrice || 0) * 100) / 100,
      precioMaximo: Math.round(Number(agg.maxPrice || 0) * 100) / 100,
      generosDisponibles: genreRows.length,
      totalEnStock: Number(agg.inStockCount || 0),
      conteoPorGenero: genreRows.map((g: any) => ({
        genero: String(g.genero),
        cantidad: Number(g.cantidad)
      })),
      juegoMejorCalificado: bestRows[0] ? this.mapRow(bestRows[0]) : undefined
    };
  }

  public async resetSeed(): Promise<void> {
    await this.pool.query('TRUNCATE TABLE videojuegos');

    const sql = `
      INSERT INTO videojuegos (
        titulo, desarrollador, genero, plataforma,
        anioLanzamiento, calificacion, precio, descripcion,
        imagenUrl, enStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const game of initialGames) {
      await this.pool.query(sql, [
        game.titulo,
        game.desarrollador,
        game.genero,
        game.plataforma,
        game.anioLanzamiento,
        game.calificacion,
        game.precio,
        game.descripcion,
        game.imagenUrl,
        game.enStock ? 1 : 0
      ]);
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
