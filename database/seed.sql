-- ==============================================================================
-- UNIVERSIDAD CATÓLICA DE PEREIRA
-- METODOLOGÍA DE LA PROGRAMACIÓN IV - PARCIAL 3
-- DATOS SEMILLA (SEEDS) PARA LA TABLA 'videojuegos'
-- AUTORES: Juan David Arboleda Vallecilla & Diego Diaz
-- ==============================================================================

USE ucp_parcial3_videojuegos;

INSERT INTO videojuegos (titulo, desarrollador, genero, plataforma, anioLanzamiento, calificacion, precio, descripcion, imagenUrl, enStock) VALUES
(
  'The Legend of Zelda: Tears of the Kingdom',
  'Nintendo EPD',
  'Aventura',
  'Nintendo Switch',
  2023,
  9.8,
  69.99,
  'Una aventura épica a través de la tierra y los cielos de Hyrule. Link debe dominar nuevas habilidades creativas para enfrentar el cataclismo desatado.',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Elden Ring',
  'FromSoftware',
  'RPG de Acción',
  'PC / PS5 / Xbox Series X',
  2022,
  9.6,
  59.99,
  'Álzate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden y convertirte en el Señor de las Tierras Intermedias.',
  'https://images.unsplash.com/photo-1612287233261-2ef3e162d04a?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Cyberpunk 2077: Phantom Liberty',
  'CD Projekt Red',
  'RPG / Cyberpunk',
  'PC / PS5 / Xbox Series X',
  2023,
  9.1,
  29.99,
  'Un trepidante thriller de espionaje en el peligroso distrito de Dogtown. Sumérgete como V en una red de lealtades rotas y conspiraciones políticas.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'God of War Ragnarök',
  'Santa Monica Studio',
  'Acción / Aventura',
  'PlayStation 5 / PC',
  2022,
  9.4,
  69.99,
  'Kratos y Atreus emprenden un viaje mítico en busca de respuestas y aliados antes del vaticinado Ragnarök en los Nueve Reinos.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Baldur\'s Gate 3',
  'Larian Studios',
  'RPG por Turnos',
  'PC / PS5 / Xbox Series X',
  2023,
  9.9,
  59.99,
  'Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la atracción de un poder absoluto.',
  'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Red Dead Redemption 2',
  'Rockstar Games',
  'Mundo Abierto',
  'PC / PS4 / Xbox One',
  2018,
  9.7,
  59.99,
  'Arthur Morgan y la banda de Van der Linde son fugitivos que intentan sobrevivir en el implacable corazón de los Estados Unidos a finales del siglo XIX.',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Hollow Knight',
  'Team Cherry',
  'Metroidvania',
  'Multiplataforma',
  2017,
  9.5,
  14.99,
  'Desciende al reino subterráneo de Hallownest, combate criaturas corrompidas y forja tu propio camino a través de un vasto mundo interconectado.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Forza Horizon 5',
  'Playground Games',
  'Carreras / Deportes',
  'PC / Xbox Series X',
  2021,
  9.2,
  59.99,
  'Tu expedición definitiva por el horizonte te espera. Explora los paisajes dinámicos y en constante evolución del mundo abierto de México.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  1
);
