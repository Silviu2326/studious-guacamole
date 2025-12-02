import { 
  Ejercicio, 
  GrupoMuscular, 
  Equipamiento, 
  CategoriaEquipamiento, 
  Dificultad 
} from '../types';

// Grupos musculares
export const gruposMusculares: GrupoMuscular[] = [
  { id: '1', nombre: 'Pecho', descripcion: 'Músculos pectorales', color: '#EF4444' },
  { id: '2', nombre: 'Espalda', descripcion: 'Músculos dorsales y trapecio', color: '#10B981' },
  { id: '3', nombre: 'Hombros', descripcion: 'Deltoides y músculos del hombro', color: '#F59E0B' },
  { id: '4', nombre: 'Brazos', descripcion: 'Bíceps y tríceps', color: '#3B82F6' },
  { id: '5', nombre: 'Piernas', descripcion: 'Cuádriceps, isquiotibiales y glúteos', color: '#8B5CF6' },
  { id: '6', nombre: 'Core', descripcion: 'Músculos abdominales y core', color: '#06B6D4' },
  { id: '7', nombre: 'Cardio', descripcion: 'Ejercicios cardiovasculares', color: '#F97316' },
];

// Equipamientos
export const equipamientos: Equipamiento[] = [
  { id: '1', nombre: 'Mancuernas', descripcion: 'Pesas libres', categoria: CategoriaEquipamiento.PESO_LIBRE },
  { id: '2', nombre: 'Barra', descripcion: 'Barra olímpica', categoria: CategoriaEquipamiento.PESO_LIBRE },
  { id: '3', nombre: 'Máquina de poleas', descripcion: 'Sistema de poleas ajustables', categoria: CategoriaEquipamiento.MAQUINA },
  { id: '4', nombre: 'Banco', descripcion: 'Banco ajustable', categoria: CategoriaEquipamiento.FUNCIONAL },
  { id: '5', nombre: 'Sin equipamiento', descripcion: 'Ejercicios con peso corporal', categoria: CategoriaEquipamiento.SIN_EQUIPAMIENTO },
  { id: '6', nombre: 'Kettlebell', descripcion: 'Pesa rusa', categoria: CategoriaEquipamiento.PESO_LIBRE },
  { id: '7', nombre: 'Cinta de correr', descripcion: 'Máquina de cardio', categoria: CategoriaEquipamiento.CARDIO },
  { id: '8', nombre: 'Elíptica', descripcion: 'Máquina elíptica', categoria: CategoriaEquipamiento.CARDIO },
];

// Ejercicios mock
export const ejerciciosMock: Ejercicio[] = [
  {
    id: '1',
    nombre: 'Press de Banca',
    descripcion: 'Ejercicio fundamental para el desarrollo del pecho, hombros y tríceps.',
    videoUrl: 'https://example.com/videos/press-banca.mp4',
    imagenUrl: 'https://example.com/images/press-banca.jpg',
    instrucciones: [
      'Acuéstate en el banco con los pies firmemente apoyados en el suelo',
      'Agarra la barra con las manos ligeramente más anchas que los hombros',
      'Baja la barra controladamente hasta tocar el pecho',
      'Empuja la barra hacia arriba hasta extender completamente los brazos',
      'Mantén la espalda pegada al banco durante todo el movimiento'
    ],
    advertencias: [
      'Siempre usa un spotter para cargas pesadas',
      'No rebotes la barra en el pecho',
      'Mantén los pies en el suelo en todo momento'
    ],
    grupoMuscular: [gruposMusculares[0], gruposMusculares[2]], // Pecho, Hombros
    equipamiento: [equipamientos[1], equipamientos[3]], // Barra, Banco
    dificultad: Dificultad.INTERMEDIO,
    duracion: 15,
    calorias: 120,
    contraindicaciones: [
      'Lesiones en el hombro',
      'Problemas en las muñecas',
      'Lesiones en el pecho'
    ],
    variaciones: [
      'Press inclinado',
      'Press declinado',
      'Press con mancuernas'
    ],
    tags: ['fuerza', 'pecho', 'básico', 'compuesto'],
    fechaCreacion: new Date('2024-01-01'),
    fechaActualizacion: new Date('2024-01-15'),
    activo: true
  },
  {
    id: '2',
    nombre: 'Sentadillas',
    descripcion: 'Ejercicio compuesto para el desarrollo de piernas y glúteos.',
    videoUrl: 'https://example.com/videos/sentadillas.mp4',
    imagenUrl: 'https://example.com/images/sentadillas.jpg',
    instrucciones: [
      'Colócate de pie con los pies separados al ancho de los hombros',
      'Baja flexionando las rodillas y caderas como si te fueras a sentar',
      'Mantén el pecho erguido y la espalda recta',
      'Baja hasta que los muslos estén paralelos al suelo',
      'Empuja con los talones para volver a la posición inicial'
    ],
    advertencias: [
      'No dejes que las rodillas se vayan hacia adentro',
      'Mantén el peso en los talones',
      'No redondees la espalda'
    ],
    grupoMuscular: [gruposMusculares[4]], // Piernas
    equipamiento: [equipamientos[4]], // Sin equipamiento
    dificultad: Dificultad.PRINCIPIANTE,
    duracion: 10,
    calorias: 80,
    contraindicaciones: [
      'Lesiones en las rodillas',
      'Problemas en la espalda baja',
      'Lesiones en los tobillos'
    ],
    variaciones: [
      'Sentadillas con salto',
      'Sentadillas búlgaras',
      'Sentadillas sumo'
    ],
    tags: ['fuerza', 'piernas', 'básico', 'funcional'],
    fechaCreacion: new Date('2024-01-02'),
    fechaActualizacion: new Date('2024-01-16'),
    activo: true
  },
  {
    id: '3',
    nombre: 'Dominadas',
    descripcion: 'Ejercicio de tracción para el desarrollo de la espalda y bíceps.',
    videoUrl: 'https://example.com/videos/dominadas.mp4',
    imagenUrl: 'https://example.com/images/dominadas.jpg',
    instrucciones: [
      'Cuelga de la barra con las palmas hacia adelante',
      'Separa las manos ligeramente más que el ancho de los hombros',
      'Tira hacia arriba hasta que la barbilla pase la barra',
      'Baja controladamente hasta la posición inicial',
      'Mantén el core activado durante todo el movimiento'
    ],
    advertencias: [
      'No uses impulso para subir',
      'Controla la bajada',
      'No cuelgues con los brazos completamente relajados'
    ],
    grupoMuscular: [gruposMusculares[1], gruposMusculares[3]], // Espalda, Brazos
    equipamiento: [equipamientos[4]], // Sin equipamiento (barra fija)
    dificultad: Dificultad.AVANZADO,
    duracion: 12,
    calorias: 100,
    contraindicaciones: [
      'Lesiones en los hombros',
      'Problemas en las muñecas',
      'Lesiones en los codos'
    ],
    variaciones: [
      'Dominadas asistidas',
      'Dominadas con agarre neutro',
      'Dominadas con peso adicional'
    ],
    tags: ['fuerza', 'espalda', 'avanzado', 'tracción'],
    fechaCreacion: new Date('2024-01-03'),
    fechaActualizacion: new Date('2024-01-17'),
    activo: true
  },
  {
    id: '4',
    nombre: 'Plancha',
    descripcion: 'Ejercicio isométrico para fortalecer el core y estabilidad.',
    videoUrl: 'https://example.com/videos/plancha.mp4',
    imagenUrl: 'https://example.com/images/plancha.jpg',
    instrucciones: [
      'Colócate en posición de flexión con los antebrazos apoyados',
      'Mantén el cuerpo en línea recta desde la cabeza hasta los talones',
      'Activa el core y los glúteos',
      'Respira normalmente mientras mantienes la posición',
      'Mantén la posición el tiempo indicado'
    ],
    advertencias: [
      'No levantes las caderas',
      'No dejes caer las caderas',
      'Mantén la cabeza en posición neutra'
    ],
    grupoMuscular: [gruposMusculares[5]], // Core
    equipamiento: [equipamientos[4]], // Sin equipamiento
    dificultad: Dificultad.PRINCIPIANTE,
    duracion: 5,
    calorias: 40,
    contraindicaciones: [
      'Lesiones en la espalda baja',
      'Problemas en las muñecas',
      'Hernias abdominales'
    ],
    variaciones: [
      'Plancha lateral',
      'Plancha con elevación de piernas',
      'Plancha con movimiento de brazos'
    ],
    tags: ['core', 'isométrico', 'estabilidad', 'básico'],
    fechaCreacion: new Date('2024-01-04'),
    fechaActualizacion: new Date('2024-01-18'),
    activo: true
  },
  {
    id: '5',
    nombre: 'Curl de Bíceps',
    descripcion: 'Ejercicio de aislamiento para el desarrollo de los bíceps.',
    videoUrl: 'https://example.com/videos/curl-biceps.mp4',
    imagenUrl: 'https://example.com/images/curl-biceps.jpg',
    instrucciones: [
      'De pie con una mancuerna en cada mano',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los brazos llevando las mancuernas hacia los hombros',
      'Contrae los bíceps en la parte superior del movimiento',
      'Baja controladamente a la posición inicial'
    ],
    advertencias: [
      'No uses impulso para levantar el peso',
      'Mantén los codos estables',
      'Controla la fase excéntrica'
    ],
    grupoMuscular: [gruposMusculares[3]], // Brazos
    equipamiento: [equipamientos[0]], // Mancuernas
    dificultad: Dificultad.PRINCIPIANTE,
    duracion: 8,
    calorias: 60,
    contraindicaciones: [
      'Lesiones en los codos',
      'Problemas en las muñecas',
      'Tendinitis en los bíceps'
    ],
    variaciones: [
      'Curl martillo',
      'Curl concentrado',
      'Curl en banco inclinado'
    ],
    tags: ['fuerza', 'brazos', 'aislamiento', 'bíceps'],
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2024-01-19'),
    activo: true
  },
  {
    id: '6',
    nombre: 'Burpees',
    descripcion: 'Ejercicio de cuerpo completo que combina fuerza y cardio.',
    videoUrl: 'https://example.com/videos/burpees.mp4',
    imagenUrl: 'https://example.com/images/burpees.jpg',
    instrucciones: [
      'Comienza de pie con los pies separados al ancho de los hombros',
      'Baja a posición de cuclillas y coloca las manos en el suelo',
      'Salta hacia atrás para quedar en posición de plancha',
      'Haz una flexión (opcional)',
      'Salta hacia adelante volviendo a cuclillas',
      'Salta hacia arriba con los brazos extendidos'
    ],
    advertencias: [
      'Mantén buena forma en cada repetición',
      'No sacrifiques técnica por velocidad',
      'Modifica si tienes problemas en las rodillas'
    ],
    grupoMuscular: [gruposMusculares[6], gruposMusculares[5]], // Cardio, Core
    equipamiento: [equipamientos[4]], // Sin equipamiento
    dificultad: Dificultad.INTERMEDIO,
    duracion: 10,
    calorias: 150,
    contraindicaciones: [
      'Problemas cardíacos',
      'Lesiones en las rodillas',
      'Problemas en la espalda'
    ],
    variaciones: [
      'Burpees sin salto',
      'Burpees con flexión',
      'Burpees laterales'
    ],
    tags: ['cardio', 'cuerpo completo', 'HIIT', 'funcional'],
    fechaCreacion: new Date('2024-01-06'),
    fechaActualizacion: new Date('2024-01-20'),
    activo: true
  }
];

// Favoritos mock (IDs de ejercicios)
export const favoritosMock: string[] = ['1', '3', '4'];