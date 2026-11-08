import { CreateGameDTO } from '../models/game.model.js';

export const initialGames: CreateGameDTO[] = [
  {
    titulo: 'The Legend of Zelda: Tears of the Kingdom',
    desarrollador: 'Nintendo EPD',
    genero: 'Aventura',
    plataforma: 'Nintendo Switch',
    anioLanzamiento: 2023,
    calificacion: 9.8,
    precio: 69.99,
    descripcion: 'Una aventura épica a través de la tierra y los cielos de Hyrule. Link debe dominar nuevas habilidades creativas para enfrentar el cataclismo desatado.',
    imagenUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Elden Ring',
    desarrollador: 'FromSoftware',
    genero: 'RPG de Acción',
    plataforma: 'PC / PS5 / Xbox Series X',
    anioLanzamiento: 2022,
    calificacion: 9.6,
    precio: 59.99,
    descripcion: 'Álzate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden y convertirte en el Señor de las Tierras Intermedias.',
    imagenUrl: 'https://images.unsplash.com/photo-1612287233261-2ef3e162d04a?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Cyberpunk 2077: Phantom Liberty',
    desarrollador: 'CD Projekt Red',
    genero: 'RPG / Cyberpunk',
    plataforma: 'PC / PS5 / Xbox Series X',
    anioLanzamiento: 2023,
    calificacion: 9.1,
    precio: 29.99,
    descripcion: 'Un trepidante thriller de espionaje en el peligroso distrito de Dogtown. Sumérgete como V en una red de lealtades rotas y conspiraciones políticas.',
    imagenUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'God of War Ragnarök',
    desarrollador: 'Santa Monica Studio',
    genero: 'Acción / Aventura',
    plataforma: 'PlayStation 5 / PC',
    anioLanzamiento: 2022,
    calificacion: 9.4,
    precio: 69.99,
    descripcion: 'Kratos y Atreus emprenden un viaje mítico en busca de respuestas y aliados antes del vaticinado Ragnarök en los Nueve Reinos.',
    imagenUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Baldur\'s Gate 3',
    desarrollador: 'Larian Studios',
    genero: 'RPG por Turnos',
    plataforma: 'PC / PS5 / Xbox Series X',
    anioLanzamiento: 2023,
    calificacion: 9.9,
    precio: 59.99,
    descripcion: 'Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la atracción de un poder absoluto.',
    imagenUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Red Dead Redemption 2',
    desarrollador: 'Rockstar Games',
    genero: 'Mundo Abierto',
    plataforma: 'PC / PS4 / Xbox One',
    anioLanzamiento: 2018,
    calificacion: 9.7,
    precio: 59.99,
    descripcion: 'Arthur Morgan y la banda de Van der Linde son fugitivos que intentan sobrevivir en el implacable corazón de los Estados Unidos a finales del siglo XIX.',
    imagenUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Hollow Knight',
    desarrollador: 'Team Cherry',
    genero: 'Metroidvania',
    plataforma: 'Multiplataforma',
    anioLanzamiento: 2017,
    calificacion: 9.5,
    precio: 14.99,
    descripcion: 'Desciende al reino subterráneo de Hallownest, combate criaturas corrompidas y forja tu propio camino a través de un vasto mundo interconectado.',
    imagenUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    enStock: true
  },
  {
    titulo: 'Forza Horizon 5',
    desarrollador: 'Playground Games',
    genero: 'Carreras / Deportes',
    plataforma: 'PC / Xbox Series X',
    anioLanzamiento: 2021,
    calificacion: 9.2,
    precio: 59.99,
    descripcion: 'Tu expedición definitiva por el horizonte te espera. Explora los paisajes dinámicos y en constante evolución del mundo abierto de México.',
    imagenUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    enStock: true
  }
];
