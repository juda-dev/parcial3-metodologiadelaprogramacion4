import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
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

export class SqliteAdapter implements IDatabaseAdapter {
  private db!: DatabaseSync;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public async init(): Promise<void> {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(this.dbPath);

    // Crear la tabla 'videojuegos' con los 12 campos
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS videojuegos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        desarrollador TEXT NOT NULL,
        genero TEXT NOT NULL,
        plataforma TEXT NOT NULL,
        anioLanzamiento INTEGER NOT NULL,
        calificacion REAL NOT NULL,
        precio REAL NOT NULL,
        descripcion TEXT NOT NULL,
        imagenUrl TEXT NOT NULL,
        enStock INTEGER NOT NULL DEFAULT 1,
        creadoEn TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);

    // Comprobar si está vacía para poblar semillas iniciales
    const countRow = this.db.prepare('SELECT COUNT(*) as total FROM videojuegos').get() as { total: number };
    if (countRow.total === 0) {
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
      creadoEn: row.creadoEn ? String(row.creadoEn) : undefined
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

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];
    return rows.map((r) => this.mapRow(r));
  }

  public async findById(id: number): Promise<Game | null> {
    const stmt = this.db.prepare('SELECT * FROM videojuegos WHERE id = ?');
    const row = stmt.get(id) as any;
    return row ? this.mapRow(row) : null;
  }

  public async create(data: CreateGameDTO): Promise<Game> {
    const stmt = this.db.prepare(`
      INSERT INTO videojuegos (
        titulo, desarrollador, genero, plataforma,
        anioLanzamiento, calificacion, precio, descripcion,
        imagenUrl, enStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
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
    );

    const insertedId = Number(result.lastInsertRowid);
    const created = await this.findById(insertedId);
    if (!created) {
      throw new Error('Error al recuperar el videojuego recién creado');
    }
    return created;
  }

  public async update(id: number, data: UpdateGameDTO): Promise<Game | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const stmt = this.db.prepare(`
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
    `);

    stmt.run(
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
    );

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
        updates.push(`${field} = ?`);
        if (field === 'enStock') {
          params.push(data.enStock ? 1 : 0);
        } else {
          params.push(data[field]);
        }
      }
    }

    if (updates.length === 0) {
      return existing;
    }

    params.push(id);
    const sql = `UPDATE videojuegos SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = this.db.prepare(sql);
    stmt.run(...params);

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM videojuegos WHERE id = ?');
    const result = stmt.run(id);
    return Number(result.changes) > 0;
  }

  public async getStats(): Promise<GameStats> {
    const totalRow = this.db.prepare('SELECT COUNT(*) as total FROM videojuegos').get() as { total: number };
    const total = totalRow.total;

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

    const aggRow = this.db.prepare(`
      SELECT
        AVG(calificacion) as avgRating,
        AVG(precio) as avgPrice,
        MIN(precio) as minPrice,
        MAX(precio) as maxPrice,
        SUM(CASE WHEN enStock = 1 THEN 1 ELSE 0 END) as inStockCount
      FROM videojuegos
    `).get() as any;

    const genresRows = this.db.prepare(`
      SELECT genero, COUNT(*) as cantidad
      FROM videojuegos
      GROUP BY genero
      ORDER BY cantidad DESC
    `).all() as any[];

    const bestRow = this.db.prepare(`
      SELECT * FROM videojuegos
      ORDER BY calificacion DESC, id DESC
      LIMIT 1
    `).get() as any;

    return {
      total,
      promedioCalificacion: Math.round(Number(aggRow.avgRating || 0) * 10) / 10,
      precioPromedio: Math.round(Number(aggRow.avgPrice || 0) * 100) / 100,
      precioMinimo: Math.round(Number(aggRow.minPrice || 0) * 100) / 100,
      precioMaximo: Math.round(Number(aggRow.maxPrice || 0) * 100) / 100,
      generosDisponibles: genresRows.length,
      totalEnStock: Number(aggRow.inStockCount || 0),
      conteoPorGenero: genresRows.map((g) => ({
        genero: String(g.genero),
        cantidad: Number(g.cantidad)
      })),
      juegoMejorCalificado: bestRow ? this.mapRow(bestRow) : undefined
    };
  }

  public async resetSeed(): Promise<void> {
    this.db.exec('DELETE FROM videojuegos;');
    this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'videojuegos';");

    const insertStmt = this.db.prepare(`
      INSERT INTO videojuegos (
        titulo, desarrollador, genero, plataforma,
        anioLanzamiento, calificacion, precio, descripcion,
        imagenUrl, enStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const game of initialGames) {
      insertStmt.run(
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
      );
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
  }
}
