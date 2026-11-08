-- ==============================================================================
-- UNIVERSIDAD CATÓLICA DE PEREIRA
-- FACULTAD DE CIENCIAS BÁSICAS E INGENIERÍA
-- METODOLOGÍA DE LA PROGRAMACIÓN IV - PARCIAL 3
-- 
-- DOCENTE : Carlos Andrés Cortés
-- AUTORES : Juan David Arboleda Vallecilla & Diego Diaz
-- TEMÁTICA: Catálogo de Videojuegos (Gaming Hub API)
-- ==============================================================================

-- 1. Creación de la base de datos (para MySQL / MariaDB)
CREATE DATABASE IF NOT EXISTS ucp_parcial3_videojuegos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ucp_parcial3_videojuegos;

-- 2. Eliminar tabla si ya existiera para reinicio limpio
DROP TABLE IF EXISTS videojuegos;

-- 3. Creación de la tabla principal 'videojuegos'
CREATE TABLE videojuegos (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único autoincremental',
  titulo VARCHAR(150) NOT NULL COMMENT 'Nombre o título comercial del videojuego',
  desarrollador VARCHAR(120) NOT NULL COMMENT 'Estudio o empresa desarrolladora',
  genero VARCHAR(60) NOT NULL COMMENT 'Género principal (ej. RPG, Acción, Aventura, Shooter)',
  plataforma VARCHAR(100) NOT NULL COMMENT 'Plataforma disponible (PC, PS5, Xbox Series X, Switch, etc.)',
  anioLanzamiento INT NOT NULL COMMENT 'Año de publicación original',
  calificacion DECIMAL(3,1) NOT NULL COMMENT 'Puntuación de 0.0 a 10.0 (ej. 9.5)',
  precio DECIMAL(10,2) NOT NULL COMMENT 'Precio sugerido de venta en USD',
  descripcion TEXT NOT NULL COMMENT 'Sinopsis argumental y características del juego',
  imagenUrl VARCHAR(500) NOT NULL COMMENT 'URL de la carátula o arte oficial',
  enStock TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Disponibilidad en inventario (1: Disponible, 0: Agotado)',
  creadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro en el sistema',
  
  -- Índices para optimizar búsquedas frecuentes
  INDEX idx_genero (genero),
  INDEX idx_plataforma (plataforma),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
