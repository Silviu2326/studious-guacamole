import { Ejercicio, GrupoMuscular, Equipamiento, Dificultad } from '../types';

export const ejerciciosMock: Ejercicio[] = [
  {
    id: 'ej-001',
    nombre: 'Press de Banca con Barra',
    descripcion: 'Ejercicio fundamental para desarrollar la musculatura del pecho, hombros y tríceps. Ejecuta el movimiento controlado manteniendo los pies firmes en el suelo.',
    grupoMuscular: ['pecho', 'hombros', 'brazos'],
    equipamiento: ['barra', 'máquina'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/0xYrAHRNiQ8',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'Acuéstate en el banco con los pies firmes en el suelo',
      'Agarra la barra con las manos separadas al ancho de los hombros',
      'Baja la barra controladamente hasta tocar el pecho',
      'Empuja la barra hacia arriba hasta extender completamente los brazos',
      'Mantén el core activo durante todo el movimiento'
    ],
    musculosSecundarios: ['tríceps', 'deltoides anterior', 'serrato anterior'],
    advertencias: [
      {
        tipoLesion: 'hombro',
        severidad: 'precaucion',
        descripcion: 'Si tienes lesión previa en el hombro, reduce el rango de movimiento y usa menos peso',
        alternativas: ['ej-002', 'ej-005']
      }
    ],
    variaciones: ['Press de banca con mancuernas', 'Press inclinado', 'Press declinado'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['fuerza', 'hipertrofia', 'pecho'],
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-03-20',
    creadoPor: 'Sistema',
    esFavorito: false,
    vecesUsado: 145
  },
  {
    id: 'ej-002',
    nombre: 'Press de Banca con Mancuernas',
    descripcion: 'Variación del press de banca que permite mayor rango de movimiento y estabilización. Ideal para trabajar el pecho de forma más completa.',
    grupoMuscular: ['pecho', 'hombros'],
    equipamiento: ['mancuernas'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/RyJbvWAh6ec',
    imagenUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
    instrucciones: [
      'Acuéstate en el banco sosteniendo las mancuernas',
      'Posiciona las mancuernas a la altura del pecho',
      'Empuja hacia arriba hasta extender los brazos',
      'Baja controladamente hasta sentir estiramiento en el pecho',
      'Mantén las muñecas firmes durante todo el movimiento'
    ],
    musculosSecundarios: ['tríceps', 'deltoides anterior'],
    variaciones: ['Press inclinado con mancuernas', 'Press declinado con mancuernas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['hipertrofia', 'pecho', 'estabilidad'],
    fechaCreacion: '2024-01-16',
    esFavorito: true,
    vecesUsado: 98
  },
  {
    id: 'ej-003',
    nombre: 'Sentadillas',
    descripcion: 'Ejercicio básico para desarrollar fuerza y musculatura en las piernas. Considerado el rey de los ejercicios para tren inferior.',
    grupoMuscular: ['piernas', 'gluteos', 'core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/Dy28eq2PjcM',
    imagenUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800',
    instrucciones: [
      'Párate con los pies separados al ancho de los hombros',
      'Baja flexionando las rodillas y cadera como si te sentaras',
      'Mantén la espalda recta y el pecho levantado',
      'Baja hasta que los muslos estén paralelos al suelo',
      'Empuja con los talones para volver a la posición inicial'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos', 'isquiotibiales', 'gemelos'],
    advertencias: [
      {
        tipoLesion: 'rodilla',
        severidad: 'precaucion',
        descripcion: 'Si tienes problemas de rodilla, reduce la profundidad de la sentadilla',
        alternativas: ['ej-004', 'ej-012']
      },
      {
        tipoLesion: 'espalda',
        severidad: 'precaucion',
        descripcion: 'Mantén el core activo para proteger la espalda baja',
        alternativas: []
      }
    ],
    variaciones: ['Sentadilla con barra', 'Sentadilla frontal', 'Sentadilla búlgara'],
    seriesRecomendadas: '3-5',
    repeticionesRecomendadas: '12-20',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['fuerza', 'piernas', 'funcional'],
    fechaCreacion: '2024-01-10',
    esFavorito: true,
    vecesUsado: 203
  },
  {
    id: 'ej-004',
    nombre: 'Sentadilla con Barra',
    descripcion: 'Sentadilla cargada con barra para aumentar la resistencia. Ejercicio fundamental para el desarrollo de fuerza en las piernas.',
    grupoMuscular: ['piernas', 'gluteos', 'core'],
    equipamiento: ['barra'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
    imagenUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
    instrucciones: [
      'Coloca la barra en el rack a la altura de los hombros',
      'Posiciona la barra sobre los trapecios superiores',
      'Desengancha la barra y da 2 pasos hacia atrás',
      'Realiza la sentadilla manteniendo la barra en equilibrio',
      'Vuelve a la posición inicial empujando con los talones'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos', 'isquiotibiales', 'core'],
    seriesRecomendadas: '3-5',
    repeticionesRecomendadas: '5-8',
    descansoRecomendado: '120-180 seg',
    rpeRecomendado: 8,
    tags: ['fuerza', 'piernas', 'compuesto'],
    fechaCreacion: '2024-01-18',
    esFavorito: false,
    vecesUsado: 167
  },
  {
    id: 'ej-005',
    nombre: 'Fondos en Paralelas',
    descripcion: 'Ejercicio de peso corporal excelente para desarrollar tríceps, pecho y hombros. Requiere buena fuerza en la parte superior del cuerpo.',
    grupoMuscular: ['brazos', 'pecho', 'hombros'],
    equipamiento: ['ninguno'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/t2y9CDY3NfU',
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    instrucciones: [
      'Sujétate de las barras paralelas con los brazos extendidos',
      'Baja el cuerpo flexionando los codos',
      'Desciende hasta que los brazos formen un ángulo de 90 grados',
      'Empuja hacia arriba hasta extender completamente los brazos',
      'Mantén el cuerpo recto durante todo el movimiento'
    ],
    musculosSecundarios: ['deltoides anterior', 'serrato anterior', 'core'],
    advertencias: [
      {
        tipoLesion: 'hombro',
        severidad: 'precaucion',
        descripcion: 'Evita si tienes problemas en el manguito rotador',
        alternativas: ['ej-006', 'ej-028']
      },
      {
        tipoLesion: 'muñeca',
        severidad: 'precaucion',
        descripcion: 'Usa muñequeras si sientes molestias',
        alternativas: []
      }
    ],
    variaciones: ['Fondos asistidos', 'Fondos con peso', 'Fondos en anillas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-15',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 7,
    tags: ['calistenia', 'brazos', 'peso corporal'],
    fechaCreacion: '2024-01-20',
    esFavorito: true,
    vecesUsado: 112
  },
  {
    id: 'ej-006',
    nombre: 'Curl de Bíceps con Mancuernas',
    descripcion: 'Ejercicio de aislamiento para el desarrollo de los bíceps. Permite trabajar cada brazo de forma independiente.',
    grupoMuscular: ['brazos'],
    equipamiento: ['mancuernas'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/h3xYwR0I0kQ',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie o sentado, sostén una mancuerna en cada mano',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los codos levantando las mancuernas',
      'Contrae los bíceps en la parte superior del movimiento',
      'Baja controladamente hasta extender completamente los brazos'
    ],
    musculosSecundarios: ['braquial anterior', 'músculos del antebrazo'],
    variaciones: ['Curl martillo', 'Curl concentrado', 'Curl alternado'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['hipertrofia', 'brazos', 'aislamiento'],
    fechaCreacion: '2024-01-22',
    esFavorito: false,
    vecesUsado: 189
  },
  {
    id: 'ej-007',
    nombre: 'Peso Muerto',
    descripcion: 'Uno de los ejercicios más completos para desarrollar fuerza en toda la cadena posterior. Trabaja espalda, glúteos y piernas.',
    grupoMuscular: ['espalda', 'piernas', 'gluteos', 'core'],
    equipamiento: ['barra'],
    dificultad: 'avanzado',
    videoUrl: 'https://www.youtube.com/embed/wYREQ8dj-tM',
    imagenUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    instrucciones: [
      'Coloca los pies separados al ancho de los hombros',
      'Agarra la barra con las manos separadas al ancho de los hombros',
      'Mantén la espalda recta y el pecho levantado',
      'Levanta la barra extendiendo cadera y rodillas simultáneamente',
      'Vuelve a bajar la barra manteniendo la técnica correcta'
    ],
    musculosSecundarios: ['isquiotibiales', 'trapecios', 'romboides', 'glúteos'],
    advertencias: [
      {
        tipoLesion: 'espalda',
        severidad: 'consulta-profesional',
        descripcion: 'Ejercicio avanzado. Si tienes problemas de espalda, consulta con un profesional antes de realizarlo',
        alternativas: ['ej-008', 'ej-013']
      }
    ],
    variaciones: ['Peso muerto rumano', 'Peso muerto sumo', 'Peso muerto con mancuernas'],
    seriesRecomendadas: '3-5',
    repeticionesRecomendadas: '3-6',
    descansoRecomendado: '180-240 seg',
    rpeRecomendado: 9,
    tags: ['fuerza', 'compuesto', 'cadena posterior'],
    fechaCreacion: '2024-01-25',
    esFavorito: false,
    vecesUsado: 76
  },
  {
    id: 'ej-008',
    nombre: 'Remo con Barra',
    descripcion: 'Ejercicio fundamental para el desarrollo de la espalda. Trabaja principalmente los músculos del medio y superior de la espalda.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['barra'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ',
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    instrucciones: [
      'Agáchate y agarra la barra con las manos separadas al ancho de los hombros',
      'Mantén la espalda recta y el core activo',
      'Tira de la barra hacia el abdomen',
      'Mantén los codos cerca del cuerpo',
      'Baja controladamente hasta estirar completamente los brazos'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior', 'trapecios'],
    variaciones: ['Remo con mancuernas', 'Remo T', 'Remo invertido'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['fuerza', 'espalda', 'compuesto'],
    fechaCreacion: '2024-01-28',
    esFavorito: false,
    vecesUsado: 134
  },
  {
    id: 'ej-009',
    nombre: 'Plancha',
    descripcion: 'Ejercicio isométrico excelente para fortalecer el core. Mejora la estabilidad y resistencia del tronco.',
    grupoMuscular: ['core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Colócate boca abajo apoyando los antebrazos y las puntas de los pies',
      'Mantén el cuerpo recto desde la cabeza hasta los talones',
      'Contrae el core y los glúteos',
      'Mantén la posición sin arquear la espalda baja',
      'Respira normalmente durante el ejercicio'
    ],
    musculosSecundarios: ['deltoides', 'glúteos', 'cuádriceps'],
    variaciones: ['Plancha lateral', 'Plancha con elevación de pierna', 'Plancha con rodillas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '30-60 seg',
    descansoRecomendado: '30-60 seg',
    rpeRecomendado: 5,
    tags: ['core', 'isométrico', 'peso corporal'],
    fechaCreacion: '2024-02-01',
    esFavorito: true,
    vecesUsado: 256
  },
  {
    id: 'ej-010',
    nombre: 'Press Militar',
    descripcion: 'Ejercicio excelente para desarrollar los hombros y el tríceps. Requiere estabilidad del core y buena técnica.',
    grupoMuscular: ['hombros', 'brazos'],
    equipamiento: ['barra'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    instrucciones: [
      'De pie, sostén la barra a la altura de los hombros',
      'Mantén los pies separados al ancho de los hombros',
      'Empuja la barra hacia arriba hasta extender completamente los brazos',
      'Baja controladamente hasta la altura de los hombros',
      'Mantén el core activo durante todo el movimiento'
    ],
    musculosSecundarios: ['tríceps', 'core', 'trapecios'],
    advertencias: [
      {
        tipoLesion: 'hombro',
        severidad: 'precaucion',
        descripcion: 'Reduce el rango de movimiento si sientes molestias',
        alternativas: ['ej-011', 'ej-025']
      }
    ],
    variaciones: ['Press militar sentado', 'Press con mancuernas', 'Press Arnold'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['fuerza', 'hombros', 'compuesto'],
    fechaCreacion: '2024-02-03',
    esFavorito: false,
    vecesUsado: 91
  },
  {
    id: 'ej-011',
    nombre: 'Elevaciones Laterales',
    descripcion: 'Ejercicio de aislamiento para los deltoides laterales. Ideal para dar forma y volumen a los hombros.',
    grupoMuscular: ['hombros'],
    equipamiento: ['mancuernas'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie, sostén una mancuerna en cada mano',
      'Mantén los brazos ligeramente flexionados',
      'Eleva las mancuernas hasta la altura de los hombros',
      'Baja controladamente hasta la posición inicial',
      'Evita balancear el cuerpo durante el movimiento'
    ],
    musculosSecundarios: ['deltoides anterior', 'trapecios'],
    variaciones: ['Elevaciones frontales', 'Elevaciones inclinadas', 'Elevaciones con cables'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '12-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['hipertrofia', 'hombros', 'aislamiento'],
    fechaCreacion: '2024-02-05',
    esFavorito: false,
    vecesUsado: 167
  },
  {
    id: 'ej-012',
    nombre: 'Prensa de Piernas',
    descripcion: 'Ejercicio de máquina que permite trabajar las piernas con seguridad. Ideal para principiantes o personas con problemas de espalda.',
    grupoMuscular: ['piernas', 'gluteos'],
    equipamiento: ['máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/IZxyjW8MPJQ',
    imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    instrucciones: [
      'Siéntate en la máquina con la espalda apoyada',
      'Coloca los pies separados al ancho de los hombros en la plataforma',
      'Desbloquea la máquina y baja controladamente',
      'Flexiona las rodillas hasta 90 grados',
      'Empuja la plataforma hasta extender las piernas'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos'],
    variaciones: ['Prensa con una pierna', 'Prensa inclinada'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['piernas', 'máquina', 'seguro'],
    fechaCreacion: '2024-02-08',
    esFavorito: false,
    vecesUsado: 143
  },
  {
    id: 'ej-013',
    nombre: 'Puente de Glúteos',
    descripcion: 'Ejercicio excelente para activar y fortalecer los glúteos. También ayuda a mejorar la postura y estabilidad de la cadera.',
    grupoMuscular: ['gluteos', 'core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/8bbE64NuDTU',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Acuéstate boca arriba con las rodillas flexionadas',
      'Coloca los pies separados al ancho de los hombros',
      'Levanta las caderas contrayendo los glúteos',
      'Mantén la posición durante 1-2 segundos',
      'Baja controladamente hasta la posición inicial'
    ],
    musculosSecundarios: ['isquiotibiales', 'core'],
    variaciones: ['Puente con una pierna', 'Puente con peso', 'Puente con bandas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '15-20',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 5,
    tags: ['glúteos', 'activación', 'peso corporal'],
    fechaCreacion: '2024-02-10',
    esFavorito: true,
    vecesUsado: 178
  },
  {
    id: 'ej-014',
    nombre: 'Dominadas',
    descripcion: 'Uno de los mejores ejercicios de peso corporal para desarrollar la espalda y los bíceps. Requiere buena fuerza en la parte superior.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['ninguno'],
    dificultad: 'avanzado',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    imagenUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800',
    instrucciones: [
      'Agárrate de la barra con las palmas mirando hacia adelante',
      'Cuelga con los brazos completamente extendidos',
      'Tira del cuerpo hacia arriba hasta que la barbilla supere la barra',
      'Baja controladamente hasta estirar completamente los brazos',
      'Mantén el core activo durante todo el movimiento'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior', 'romboides'],
    advertencias: [
      {
        tipoLesion: 'hombro',
        severidad: 'precaucion',
        descripcion: 'Asegúrate de calentar bien los hombros antes de realizar este ejercicio',
        alternativas: ['ej-015', 'ej-008']
      }
    ],
    variaciones: ['Dominadas asistidas', 'Dominadas con agarre neutro', 'Dominadas con peso'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '5-10',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 8,
    tags: ['calistenia', 'espalda', 'peso corporal'],
    fechaCreacion: '2024-02-12',
    esFavorito: true,
    vecesUsado: 95
  },
  {
    id: 'ej-015',
    nombre: 'Jalón al Pecho',
    descripcion: 'Ejercicio de máquina que simula las dominadas. Ideal para principiantes o cuando no se tiene acceso a una barra de dominadas.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/KR2S1ut7oGU',
    imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    instrucciones: [
      'Siéntate en la máquina y agarra la barra con las palmas hacia adelante',
      'Tira de la barra hacia el pecho',
      'Mantén el pecho levantado y los hombros hacia atrás',
      'Siente la contracción en la espalda',
      'Vuelve controladamente a la posición inicial'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior'],
    variaciones: ['Jalón con agarre cerrado', 'Jalón tras nuca', 'Jalón con agarre neutro'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-12',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['espalda', 'máquina', 'principiante'],
    fechaCreacion: '2024-02-14',
    esFavorito: false,
    vecesUsado: 156
  },
  {
    id: 'ej-016',
    nombre: 'Burpees',
    descripcion: 'Ejercicio de peso corporal completo que combina fuerza y cardio. Excelente para mejorar la condición física general.',
    grupoMuscular: ['full-body', 'cardio'],
    equipamiento: ['ninguno'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'Comienza de pie',
      'Agáchate y coloca las manos en el suelo',
      'Salta las piernas hacia atrás hasta posición de plancha',
      'Realiza una flexión (opcional)',
      'Salta las piernas hacia adelante y salta con los brazos arriba'
    ],
    musculosSecundarios: ['pecho', 'hombros', 'piernas', 'core'],
    advertencias: [
      {
        tipoLesion: 'rodilla',
        severidad: 'precaucion',
        descripcion: 'Reduce la intensidad si sientes molestias en las rodillas',
        alternativas: ['ej-017', 'ej-003']
      }
    ],
    variaciones: ['Burpees sin flexión', 'Burpees con salto', 'Burpees con mancuernas'],
    seriesRecomendadas: '3-5',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 8,
    tags: ['cardio', 'full-body', 'funcional'],
    fechaCreacion: '2024-02-16',
    esFavorito: false,
    vecesUsado: 67
  },
  {
    id: 'ej-017',
    nombre: 'Mountain Climbers',
    descripcion: 'Ejercicio dinámico que combina cardio y fortalecimiento del core. Excelente para calentamiento o circuitos de alta intensidad.',
    grupoMuscular: ['core', 'cardio'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/cnyTQDSE884',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Comienza en posición de plancha',
      'Mantén el core activo y el cuerpo recto',
      'Alterna llevando las rodillas al pecho rápidamente',
      'Mantén un ritmo constante',
      'Evita levantar las caderas durante el movimiento'
    ],
    musculosSecundarios: ['hombros', 'piernas'],
    variaciones: ['Mountain climbers lentos', 'Mountain climbers cruzados', 'Mountain climbers con rodilla al codo'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '20-30 por lado',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 6,
    tags: ['cardio', 'core', 'peso corporal'],
    fechaCreacion: '2024-02-18',
    esFavorito: false,
    vecesUsado: 124
  },
  {
    id: 'ej-018',
    nombre: 'Zancadas',
    descripcion: 'Ejercicio unilateral excelente para desarrollar fuerza y equilibrio en las piernas. Trabaja cuádriceps, glúteos e isquiotibiales.',
    grupoMuscular: ['piernas', 'gluteos'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    imagenUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800',
    instrucciones: [
      'De pie, da un paso largo hacia adelante',
      'Baja la rodilla trasera hacia el suelo',
      'Mantén el torso recto y el core activo',
      'Empuja con el talón delantero para volver',
      'Alterna las piernas'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos', 'isquiotibiales', 'core'],
    variaciones: ['Zancadas caminando', 'Zancadas con mancuernas', 'Zancadas reversas', 'Zancadas laterales'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '12-15 por pierna',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['piernas', 'unilateral', 'equilibrio'],
    fechaCreacion: '2024-02-20',
    esFavorito: true,
    vecesUsado: 187
  },
  {
    id: 'ej-019',
    nombre: 'Tríceps en Paralelas',
    descripcion: 'Ejercicio de peso corporal para desarrollar los tríceps. Similar a los fondos pero con énfasis en los brazos.',
    grupoMuscular: ['brazos'],
    equipamiento: ['ninguno'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/6kALZikXxLc',
    imagenUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800',
    instrucciones: [
      'Sujétate de las barras paralelas con los brazos extendidos',
      'Mantén el cuerpo vertical',
      'Baja flexionando solo los codos',
      'Desciende hasta un ángulo de 90 grados',
      'Empuja hacia arriba hasta extender completamente'
    ],
    musculosSecundarios: ['deltoides anterior', 'pecho'],
    advertencias: [
      {
        tipoLesion: 'hombro',
        severidad: 'precaucion',
        descripcion: 'Evita si tienes problemas en el hombro',
        alternativas: ['ej-020', 'ej-024']
      }
    ],
    variaciones: ['Tríceps asistido', 'Tríceps con peso', 'Tríceps en banco'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 7,
    tags: ['brazos', 'calistenia', 'tríceps'],
    fechaCreacion: '2024-02-22',
    esFavorito: false,
    vecesUsado: 103
  },
  {
    id: 'ej-020',
    nombre: 'Extensiones de Tríceps',
    descripcion: 'Ejercicio de aislamiento para los tríceps usando mancuernas o barra. Ideal para desarrollar la parte posterior de los brazos.',
    grupoMuscular: ['brazos'],
    equipamiento: ['mancuernas', 'barra'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/X-iV-cN8fI8',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'Acostado en banco, sostén la mancuerna o barra con los brazos extendidos',
      'Mantén los codos fijos',
      'Baja el peso flexionando solo los codos',
      'Extiende los brazos hasta la posición inicial',
      'Mantén los codos apuntando hacia adelante'
    ],
    musculosSecundarios: ['deltoides anterior'],
    variaciones: ['Extensiones sentado', 'Extensiones con polea', 'Extensiones por encima de la cabeza'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['brazos', 'aislamiento', 'tríceps'],
    fechaCreacion: '2024-02-24',
    esFavorito: false,
    vecesUsado: 148
  },
  {
    id: 'ej-021',
    nombre: 'Abdominales Crunch',
    descripcion: 'Ejercicio clásico para fortalecer los músculos abdominales. Ideal para principiantes en el entrenamiento del core.',
    grupoMuscular: ['core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Acuéstate boca arriba con las rodillas flexionadas',
      'Coloca las manos detrás de la cabeza',
      'Eleva el torso contrayendo los abdominales',
      'Baja controladamente hasta la posición inicial',
      'Evita tirar del cuello durante el movimiento'
    ],
    musculosSecundarios: ['oblicuos'],
    advertencias: [
      {
        tipoLesion: 'cuello',
        severidad: 'precaucion',
        descripcion: 'Evita tirar del cuello con las manos',
        alternativas: ['ej-009', 'ej-022']
      },
      {
        tipoLesion: 'espalda',
        severidad: 'precaucion',
        descripcion: 'Si sientes molestias en la espalda baja, reduce el rango de movimiento',
        alternativas: []
      }
    ],
    variaciones: ['Crunch inverso', 'Crunch con piernas elevadas', 'Crunch con giro'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '15-25',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 5,
    tags: ['core', 'abdominales', 'principiante'],
    fechaCreacion: '2024-02-26',
    esFavorito: false,
    vecesUsado: 234
  },
  {
    id: 'ej-022',
    nombre: 'Dead Bug',
    descripcion: 'Ejercicio de estabilización del core que mejora la coordinación y fuerza del tronco. Muy seguro para la espalda.',
    grupoMuscular: ['core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/g_BYB0R-4Ws',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Acuéstate boca arriba con los brazos extendidos hacia el techo',
      'Flexiona las caderas y rodillas a 90 grados',
      'Extiende el brazo derecho y la pierna izquierda simultáneamente',
      'Vuelve a la posición inicial',
      'Alterna con el brazo izquierdo y pierna derecha'
    ],
    musculosSecundarios: ['transverso abdominal', 'glúteos'],
    variaciones: ['Dead bug con peso', 'Dead bug con bandas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-12 por lado',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 5,
    tags: ['core', 'estabilización', 'coordinación'],
    fechaCreacion: '2024-02-28',
    esFavorito: false,
    vecesUsado: 165
  },
  {
    id: 'ej-023',
    nombre: 'Rodillas al Pecho',
    descripcion: 'Ejercicio simple y efectivo para fortalecer el core y mejorar la flexibilidad. Ideal para calentamiento o como parte de una rutina de core.',
    grupoMuscular: ['core'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/x5D2FzaJQ0Y',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Acuéstate boca arriba con las piernas extendidas',
      'Levanta las rodillas hacia el pecho',
      'Abreza las rodillas con las manos',
      'Mantén la posición durante 1-2 segundos',
      'Vuelve a estirar las piernas controladamente'
    ],
    musculosSecundarios: ['flexores de cadera'],
    variaciones: ['Rodillas alternadas', 'Rodillas con giro'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '15-20',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 4,
    tags: ['core', 'flexibilidad', 'principiante'],
    fechaCreacion: '2024-03-01',
    esFavorito: false,
    vecesUsado: 142
  },
  {
    id: 'ej-024',
    nombre: 'Fondos de Tríceps en Banco',
    descripcion: 'Ejercicio efectivo para trabajar los tríceps usando solo un banco o silla. Muy accesible y fácil de realizar.',
    grupoMuscular: ['brazos'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/6kALZikXxLc',
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    instrucciones: [
      'Siéntate en el borde de un banco o silla',
      'Coloca las manos en el borde con los dedos hacia adelante',
      'Desliza hacia adelante hasta que las nalgas queden fuera',
      'Baja flexionando los codos',
      'Empuja hacia arriba hasta extender completamente'
    ],
    musculosSecundarios: ['deltoides anterior'],
    variaciones: ['Fondos con peso', 'Fondos con piernas elevadas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 5,
    tags: ['brazos', 'tríceps', 'peso corporal'],
    fechaCreacion: '2024-03-03',
    esFavorito: false,
    vecesUsado: 118
  },
  {
    id: 'ej-025',
    nombre: 'Elevaciones Frontales',
    descripcion: 'Ejercicio de aislamiento para los deltoides anteriores. Ayuda a desarrollar la parte frontal de los hombros.',
    grupoMuscular: ['hombros'],
    equipamiento: ['mancuernas', 'barra'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/-t7fuZ0KhDA',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie, sostén las mancuernas frente a los muslos',
      'Eleva las mancuernas hasta la altura de los hombros',
      'Mantén los brazos rectos o ligeramente flexionados',
      'Baja controladamente hasta la posición inicial',
      'Evita balancear el cuerpo'
    ],
    musculosSecundarios: ['trapecios'],
    variaciones: ['Elevaciones con barra', 'Elevaciones alternadas', 'Elevaciones con cables'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '12-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 5,
    tags: ['hombros', 'aislamiento', 'deltoides'],
    fechaCreacion: '2024-03-05',
    esFavorito: false,
    vecesUsado: 132
  },
  {
    id: 'ej-026',
    nombre: 'Peso Muerto Rumano',
    descripcion: 'Variación del peso muerto que enfatiza la cadena posterior. Excelente para glúteos e isquiotibiales con menor riesgo para la espalda.',
    grupoMuscular: ['piernas', 'gluteos', 'espalda'],
    equipamiento: ['barra', 'mancuernas'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/1ED09Z5UqQo',
    imagenUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    instrucciones: [
      'De pie, sostén la barra o mancuernas con los brazos extendidos',
      'Mantén las rodillas ligeramente flexionadas',
      'Hinge desde la cadera, bajando el torso',
      'Siente el estiramiento en los isquiotibiales',
      'Vuelve a la posición inicial contrayendo los glúteos'
    ],
    musculosSecundarios: ['isquiotibiales', 'erectores espinales'],
    advertencias: [
      {
        tipoLesion: 'espalda',
        severidad: 'precaucion',
        descripcion: 'Mantén el core activo y la espalda recta durante todo el movimiento',
        alternativas: ['ej-013', 'ej-027']
      }
    ],
    variaciones: ['RDL con una pierna', 'RDL con mancuernas', 'RDL con bandas'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['piernas', 'cadena posterior', 'glúteos'],
    fechaCreacion: '2024-03-07',
    esFavorito: false,
    vecesUsado: 89
  },
  {
    id: 'ej-027',
    nombre: 'Elevación de Talones',
    descripcion: 'Ejercicio específico para desarrollar los gemelos. Puede realizarse de pie o sentado, con o sin peso adicional.',
    grupoMuscular: ['piernas'],
    equipamiento: ['ninguno', 'mancuernas', 'máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/-M4-G8p4fm8',
    imagenUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800',
    instrucciones: [
      'De pie, con los pies separados al ancho de los hombros',
      'Eleva los talones lo más alto posible',
      'Mantén la posición durante 1-2 segundos',
      'Baja controladamente hasta estirar completamente',
      'Repite el movimiento'
    ],
    musculosSecundarios: ['sóleos'],
    variaciones: ['Elevaciones sentado', 'Elevaciones con una pierna', 'Elevaciones con peso'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '15-25',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 6,
    tags: ['piernas', 'gemelos', 'aislamiento'],
    fechaCreacion: '2024-03-09',
    esFavorito: false,
    vecesUsado: 145
  },
  {
    id: 'ej-028',
    nombre: 'Flexiones',
    descripcion: 'Ejercicio fundamental de peso corporal para desarrollar fuerza en pecho, hombros y tríceps. Versátil y accesible.',
    grupoMuscular: ['pecho', 'hombros', 'brazos'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'Colócate en posición de plancha con las manos separadas al ancho de los hombros',
      'Mantén el cuerpo recto desde la cabeza hasta los talones',
      'Baja el cuerpo flexionando los codos',
      'Desciende hasta que el pecho casi toque el suelo',
      'Empuja hacia arriba hasta extender completamente los brazos'
    ],
    musculosSecundarios: ['core', 'deltoides anterior'],
    variaciones: ['Flexiones con rodillas', 'Flexiones inclinadas', 'Flexiones declinadas', 'Flexiones con palmada'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-20',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['calistenia', 'pecho', 'peso corporal'],
    fechaCreacion: '2024-03-11',
    esFavorito: true,
    vecesUsado: 278
  },
  {
    id: 'ej-029',
    nombre: 'Jumping Jacks',
    descripcion: 'Ejercicio cardiovascular de bajo impacto que mejora la coordinación y la condición física general. Ideal para calentamiento.',
    grupoMuscular: ['cardio', 'full-body'],
    equipamiento: ['ninguno'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/UpH7rm0cYbM',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'De pie con los pies juntos y los brazos a los lados',
      'Salta abriendo las piernas y levantando los brazos',
      'Aterriza con los pies separados y los brazos arriba',
      'Salta de nuevo cerrando las piernas y bajando los brazos',
      'Mantén un ritmo constante'
    ],
    musculosSecundarios: ['hombros', 'piernas', 'core'],
    variaciones: ['Jumping jacks lentos', 'Jumping jacks con sentadilla'],
    seriesRecomendadas: '3-5',
    repeticionesRecomendadas: '20-30',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 5,
    tags: ['cardio', 'calentamiento', 'peso corporal'],
    fechaCreacion: '2024-03-13',
    esFavorito: false,
    vecesUsado: 98
  },
  {
    id: 'ej-030',
    nombre: 'Remo con Mancuerna',
    descripcion: 'Ejercicio unilateral para desarrollar la espalda. Permite corregir desequilibrios y trabajar cada lado de forma independiente.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['mancuernas'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'Apoya una mano y una rodilla en un banco',
      'Sostén la mancuerna con la mano libre',
      'Tira de la mancuerna hacia el torso',
      'Mantén el codo cerca del cuerpo',
      'Baja controladamente hasta estirar el brazo'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior', 'romboides'],
    variaciones: ['Remo con dos mancuernas', 'Remo inclinado', 'Remo con agarre neutro'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-12 por brazo',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 7,
    tags: ['espalda', 'unilateral', 'fuerza'],
    fechaCreacion: '2024-03-15',
    esFavorito: false,
    vecesUsado: 123
  },
  {
    id: 'ej-031',
    nombre: 'Pull-ups con Agarre Supino',
    descripcion: 'Variación de las dominadas con agarre supino que enfatiza más los bíceps. Ligeramente más fácil que las dominadas tradicionales.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['ninguno'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/Ko9kY_lsitg',
    imagenUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800',
    instrucciones: [
      'Agárrate de la barra con las palmas mirando hacia ti',
      'Cuelga con los brazos completamente extendidos',
      'Tira del cuerpo hacia arriba hasta que la barbilla supere la barra',
      'Baja controladamente hasta estirar completamente',
      'Mantén el core activo'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior'],
    variaciones: ['Pull-ups asistidos', 'Pull-ups con peso', 'Pull-ups con agarre cerrado'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['calistenia', 'espalda', 'bíceps'],
    fechaCreacion: '2024-03-17',
    esFavorito: false,
    vecesUsado: 87
  },
  {
    id: 'ej-032',
    nombre: 'Aperturas con Mancuernas',
    descripcion: 'Ejercicio de aislamiento para el pecho que enfatiza los pectorales mayores. Excelente para desarrollar la forma del pecho.',
    grupoMuscular: ['pecho'],
    equipamiento: ['mancuernas'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/8iPEnov-lmU',
    imagenUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    instrucciones: [
      'Acuéstate en un banco con las mancuernas extendidas sobre el pecho',
      'Baja las mancuernas en un arco hasta sentir estiramiento',
      'Mantén los codos ligeramente flexionados',
      'Vuelve a la posición inicial contrayendo el pecho',
      'Controla el movimiento durante toda la repetición'
    ],
    musculosSecundarios: ['deltoides anterior', 'serrato anterior'],
    variaciones: ['Aperturas inclinadas', 'Aperturas declinadas', 'Aperturas en banco plano'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '12-15',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['pecho', 'aislamiento', 'hipertrofia'],
    fechaCreacion: '2024-03-19',
    esFavorito: false,
    vecesUsado: 112
  },
  {
    id: 'ej-033',
    nombre: 'Curl Martillo',
    descripcion: 'Variación del curl que trabaja los bíceps y el braquial anterior. El agarre neutro reduce la tensión en las muñecas.',
    grupoMuscular: ['brazos'],
    equipamiento: ['mancuernas'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/tw1h5Xk25tE',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie o sentado, sostén las mancuernas con agarre neutro',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los codos levantando las mancuernas',
      'Mantén las palmas mirándose entre sí',
      'Baja controladamente hasta estirar los brazos'
    ],
    musculosSecundarios: ['braquial anterior', 'antebrazos'],
    variaciones: ['Curl martillo alternado', 'Curl martillo con barra'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-15',
    descansoRecomendado: '45-60 seg',
    rpeRecomendado: 6,
    tags: ['brazos', 'bíceps', 'aislamiento'],
    fechaCreacion: '2024-03-21',
    esFavorito: false,
    vecesUsado: 134
  },
  {
    id: 'ej-034',
    nombre: 'Plancha Lateral',
    descripcion: 'Variación de la plancha que enfatiza los oblicuos y mejora la estabilidad lateral del core. Excelente para fortalecer el tronco.',
    grupoMuscular: ['core'],
    equipamiento: ['ninguno'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/_Rgp0_02vRM',
    imagenUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    instrucciones: [
      'Acuéstate de lado apoyando el antebrazo y el pie',
      'Levanta las caderas manteniendo el cuerpo recto',
      'Forma una línea recta desde la cabeza hasta los pies',
      'Mantén la posición contrayendo el core',
      'Alterna ambos lados'
    ],
    musculosSecundarios: ['oblicuos', 'glúteos', 'deltoides'],
    variaciones: ['Plancha lateral con elevación de pierna', 'Plancha lateral con rotación', 'Plancha lateral con peso'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '30-60 seg por lado',
    descansoRecomendado: '30-45 seg',
    rpeRecomendado: 6,
    tags: ['core', 'oblicuos', 'isométrico'],
    fechaCreacion: '2024-03-23',
    esFavorito: false,
    vecesUsado: 156
  },
  {
    id: 'ej-035',
    nombre: 'Sentadilla Búlgara',
    descripcion: 'Ejercicio unilateral avanzado para las piernas. Mejora el equilibrio y trabaja intensamente cuádriceps y glúteos.',
    grupoMuscular: ['piernas', 'gluteos'],
    equipamiento: ['ninguno', 'mancuernas'],
    dificultad: 'avanzado',
    videoUrl: 'https://www.youtube.com/embed/2C-uNgwPLE4',
    imagenUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800',
    instrucciones: [
      'Coloca el pie trasero en un banco o superficie elevada',
      'Da un paso largo hacia adelante con la pierna delantera',
      'Baja la rodilla trasera hacia el suelo',
      'Empuja con el talón delantero para volver',
      'Mantén el torso recto durante todo el movimiento'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos', 'isquiotibiales', 'core'],
    advertencias: [
      {
        tipoLesion: 'rodilla',
        severidad: 'precaucion',
        descripcion: 'Reduce la profundidad si sientes molestias en la rodilla',
        alternativas: ['ej-018', 'ej-012']
      }
    ],
    variaciones: ['Sentadilla búlgara con mancuernas', 'Sentadilla búlgara con barra'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-12 por pierna',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 7,
    tags: ['piernas', 'unilateral', 'avanzado'],
    fechaCreacion: '2024-03-25',
    esFavorito: false,
    vecesUsado: 76
  },
  {
    id: 'ej-036',
    nombre: 'Press de Hombro con Mancuernas',
    descripcion: 'Ejercicio para desarrollar los hombros usando mancuernas. Permite mayor rango de movimiento que la barra.',
    grupoMuscular: ['hombros'],
    equipamiento: ['mancuernas'],
    dificultad: 'intermedio',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie o sentado, sostén las mancuernas a la altura de los hombros',
      'Mantén los codos ligeramente adelante',
      'Empuja las mancuernas hacia arriba',
      'Extiende completamente los brazos',
      'Baja controladamente hasta la posición inicial'
    ],
    musculosSecundarios: ['tríceps', 'core', 'trapecios'],
    variaciones: ['Press sentado', 'Press alternado', 'Press Arnold'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '90-120 seg',
    rpeRecomendado: 7,
    tags: ['hombros', 'fuerza', 'compuesto'],
    fechaCreacion: '2024-03-27',
    esFavorito: false,
    vecesUsado: 98
  },
  {
    id: 'ej-037',
    nombre: 'Caminadora',
    descripcion: 'Ejercicio cardiovascular básico en máquina. Excelente para mejorar la condición física y quemar calorías.',
    grupoMuscular: ['cardio'],
    equipamiento: ['máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/alw2B1C2hYc',
    imagenUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
    instrucciones: [
      'Sube a la caminadora y ajusta la velocidad',
      'Comienza caminando lentamente para calentar',
      'Aumenta gradualmente la velocidad o inclinación',
      'Mantén una postura erguida',
      'Enfría caminando lentamente al final'
    ],
    musculosSecundarios: ['piernas', 'glúteos', 'core'],
    variaciones: ['Caminata rápida', 'Trote', 'Caminata inclinada'],
    seriesRecomendadas: '1',
    repeticionesRecomendadas: '20-30 min',
    descansoRecomendado: 'N/A',
    rpeRecomendado: 5,
    tags: ['cardio', 'resistencia', 'máquina'],
    fechaCreacion: '2024-03-29',
    esFavorito: false,
    vecesUsado: 234
  },
  {
    id: 'ej-038',
    nombre: 'Bicicleta Estática',
    descripcion: 'Ejercicio cardiovascular de bajo impacto. Ideal para mejorar la condición cardiovascular sin estresar las articulaciones.',
    grupoMuscular: ['cardio', 'piernas'],
    equipamiento: ['máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/Z_5EDyX6F_A',
    imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    instrucciones: [
      'Ajusta el asiento a la altura adecuada',
      'Comienza pedaleando a un ritmo cómodo',
      'Ajusta la resistencia según tu nivel',
      'Mantén una postura erguida',
      'Enfría reduciendo la intensidad gradualmente'
    ],
    musculosSecundarios: ['cuádriceps', 'glúteos', 'isquiotibiales'],
    variaciones: ['Intervalos', 'Resistencia constante', 'Spinning'],
    seriesRecomendadas: '1',
    repeticionesRecomendadas: '20-45 min',
    descansoRecomendado: 'N/A',
    rpeRecomendado: 5,
    tags: ['cardio', 'bajo impacto', 'resistencia'],
    fechaCreacion: '2024-03-31',
    esFavorito: false,
    vecesUsado: 198
  },
  {
    id: 'ej-039',
    nombre: 'Remo en Máquina',
    descripcion: 'Ejercicio de máquina que simula el remo. Excelente para desarrollar la espalda con mayor seguridad y control.',
    grupoMuscular: ['espalda', 'brazos'],
    equipamiento: ['máquina'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/GZbfZ8fKkQA',
    imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    instrucciones: [
      'Siéntate en la máquina con los pies en los soportes',
      'Agarra el mango con las manos separadas',
      'Tira del mango hacia el torso',
      'Mantén el pecho levantado y los hombros hacia atrás',
      'Vuelve controladamente a la posición inicial'
    ],
    musculosSecundarios: ['bíceps', 'deltoides posterior', 'romboides'],
    variaciones: ['Remo con agarre cerrado', 'Remo con agarre ancho', 'Remo con agarre neutro'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '10-12',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['espalda', 'máquina', 'fuerza'],
    fechaCreacion: '2024-04-02',
    esFavorito: false,
    vecesUsado: 145
  },
  {
    id: 'ej-040',
    nombre: 'Curl de Bíceps con Barra',
    descripcion: 'Ejercicio clásico para desarrollar los bíceps usando barra. Permite usar más peso que con mancuernas individuales.',
    grupoMuscular: ['brazos'],
    equipamiento: ['barra'],
    dificultad: 'principiante',
    videoUrl: 'https://www.youtube.com/embed/JB8TyzGUSBs',
    imagenUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    instrucciones: [
      'De pie, agarra la barra con las palmas hacia arriba',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los codos levantando la barra',
      'Contrae los bíceps en la parte superior',
      'Baja controladamente hasta estirar los brazos'
    ],
    musculosSecundarios: ['braquial anterior', 'antebrazos'],
    variaciones: ['Curl con barra EZ', 'Curl con barra recta', 'Curl 21s'],
    seriesRecomendadas: '3-4',
    repeticionesRecomendadas: '8-12',
    descansoRecomendado: '60-90 seg',
    rpeRecomendado: 6,
    tags: ['brazos', 'bíceps', 'hipertrofia'],
    fechaCreacion: '2024-04-04',
    esFavorito: false,
    vecesUsado: 167
  }
];

// Función auxiliar para obtener ejercicios filtrados
export function filtrarEjercicios(ejercicios: Ejercicio[], filtros?: {
  busqueda?: string;
  gruposMusculares?: GrupoMuscular[];
  equipamiento?: Equipamiento[];
  dificultad?: Dificultad[];
  excluirLesiones?: string[];
  soloFavoritos?: boolean;
  ordenarPor?: 'nombre' | 'popularidad' | 'fecha' | 'grupo';
  orden?: 'asc' | 'desc';
}): Ejercicio[] {
  let resultado = [...ejercicios];

  // Filtro de búsqueda
  if (filtros?.busqueda) {
    const busqueda = filtros.busqueda.toLowerCase();
    resultado = resultado.filter(ej => 
      ej.nombre.toLowerCase().includes(busqueda) ||
      ej.descripcion.toLowerCase().includes(busqueda) ||
      ej.tags?.some(tag => tag.toLowerCase().includes(busqueda)) ||
      ej.grupoMuscular.some(grupo => grupo.toLowerCase().includes(busqueda))
    );
  }

  // Filtro por grupos musculares
  if (filtros?.gruposMusculares && filtros.gruposMusculares.length > 0) {
    resultado = resultado.filter(ej =>
      ej.grupoMuscular.some(grupo => filtros.gruposMusculares!.includes(grupo))
    );
  }

  // Filtro por equipamiento
  if (filtros?.equipamiento && filtros.equipamiento.length > 0) {
    resultado = resultado.filter(ej =>
      ej.equipamiento.some(equipo => filtros.equipamiento!.includes(equipo))
    );
  }

  // Filtro por dificultad
  if (filtros?.dificultad && filtros.dificultad.length > 0) {
    resultado = resultado.filter(ej =>
      filtros.dificultad!.includes(ej.dificultad)
    );
  }

  // Filtro por lesiones (excluir ejercicios con advertencias para esas lesiones)
  if (filtros?.excluirLesiones && filtros.excluirLesiones.length > 0) {
    resultado = resultado.filter(ej =>
      !ej.advertencias?.some(adv => 
        filtros.excluirLesiones!.includes(adv.tipoLesion)
      )
    );
  }

  // Filtro de favoritos
  if (filtros?.soloFavoritos) {
    resultado = resultado.filter(ej => ej.esFavorito === true);
  }

  // Ordenamiento
  if (filtros?.ordenarPor) {
    resultado.sort((a, b) => {
      let comparacion = 0;
      
      switch (filtros.ordenarPor) {
        case 'nombre':
          comparacion = a.nombre.localeCompare(b.nombre);
          break;
        case 'popularidad':
          comparacion = (b.vecesUsado || 0) - (a.vecesUsado || 0);
          break;
        case 'fecha':
          comparacion = new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
          break;
        case 'grupo':
          comparacion = a.grupoMuscular[0].localeCompare(b.grupoMuscular[0]);
          break;
      }

      return filtros.orden === 'desc' ? -comparacion : comparacion;
    });
  }

  return resultado;
}












