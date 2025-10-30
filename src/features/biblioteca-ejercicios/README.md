# Biblioteca de Ejercicios

## Descripción

La **Biblioteca de Ejercicios** es una funcionalidad completa que proporciona un catálogo de ejercicios con vídeos, instrucciones detalladas, advertencias de seguridad y sistema de categorización. Está diseñada para ser utilizada tanto por entrenadores personales como por gimnasios y centros de fitness.

## Características Principales

### 🔍 Búsqueda y Filtrado Avanzado
- Búsqueda por nombre, descripción y tags
- Filtros por grupo muscular
- Filtros por equipamiento necesario
- Filtros por nivel de dificultad
- Filtro de solo favoritos

### 📚 Catálogo Completo
- Información detallada de cada ejercicio
- Instrucciones paso a paso
- Advertencias y contraindicaciones
- Variaciones del ejercicio
- Grupos musculares trabajados
- Equipamiento necesario

### ⭐ Sistema de Favoritos
- Marcar ejercicios como favoritos
- Vista rápida de ejercicios favoritos
- Gestión personalizada por usuario

### 🎯 Categorización Inteligente
- Organización por grupos musculares
- Clasificación por tipo de equipamiento
- Niveles de dificultad (Principiante, Intermedio, Avanzado, Experto)
- Sistema de tags para búsqueda rápida

### 🛡️ Información de Seguridad
- Advertencias específicas por ejercicio
- Contraindicaciones médicas
- Precauciones de seguridad
- Técnica correcta de ejecución

## Estructura del Proyecto

```
src/features/biblioteca-ejercicios/
├── components/
│   ├── BibliotecaEjercicios.tsx    # Componente principal
│   ├── VisorEjercicio.tsx          # Visor detallado de ejercicios
│   └── index.ts                    # Exportaciones de componentes
├── data/
│   └── mockData.ts                 # Datos de ejemplo
├── hooks/
│   └── useBiblioteca.ts           # Hook personalizado
├── services/
│   └── bibliotecaService.ts       # Servicios de API
├── types/
│   └── index.ts                   # Definiciones de tipos
├── page.tsx                       # Página principal
├── index.ts                       # Exportaciones principales
└── README.md                      # Esta documentación
```

## Componentes

### BibliotecaEjercicios
Componente principal que muestra el catálogo completo con:
- Grid de ejercicios con información resumida
- Barra de búsqueda
- Filtros por categorías
- Sistema de favoritos
- Paginación (preparado para implementación futura)

**Props:**
- `modo`: 'visualizacion' | 'seleccion' - Modo de operación
- `onSeleccionarEjercicio`: Callback para selección de ejercicios
- `ejerciciosSeleccionados`: Array de IDs de ejercicios seleccionados
- `mostrarFavoritos`: Mostrar u ocultar funcionalidad de favoritos

### VisorEjercicio
Modal detallado que muestra información completa del ejercicio:
- Video/imagen de demostración
- Instrucciones paso a paso
- Advertencias y contraindicaciones
- Variaciones del ejercicio
- Información técnica (duración, calorías, etc.)

**Props:**
- `ejercicio`: Objeto con datos del ejercicio
- `onCerrar`: Callback para cerrar el modal
- `onAgregarFavorito`: Callback para agregar a favoritos
- `onRemoverFavorito`: Callback para remover de favoritos
- `esFavorito`: Indica si el ejercicio es favorito
- `onAgregarAPrograma`: Callback para agregar a programa de entrenamiento

## Hooks

### useBiblioteca
Hook principal que maneja el estado de la biblioteca:
- Carga de ejercicios y datos iniciales
- Gestión de filtros y búsqueda
- Manejo de favoritos
- Estado de carga y errores

### useEjercicio
Hook para obtener un ejercicio específico por ID.

### useEjerciciosRecomendados
Hook para obtener ejercicios recomendados basados en el historial del usuario.

### useEjerciciosSimilares
Hook para obtener ejercicios similares a uno dado.

## Servicios

### bibliotecaService
Servicio que simula las operaciones de API:
- `obtenerEjercicios()`: Obtiene todos los ejercicios
- `buscarEjercicios()`: Búsqueda con filtros y paginación
- `obtenerEjercicioPorId()`: Obtiene ejercicio específico
- `agregarFavorito()` / `removerFavorito()`: Gestión de favoritos
- `obtenerGruposMusculares()`: Obtiene categorías de grupos musculares
- `obtenerEquipamientos()`: Obtiene tipos de equipamiento

## Tipos de Datos

### Ejercicio
```typescript
interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  videoUrl: string;
  imagenUrl?: string;
  instrucciones: string[];
  advertencias: string[];
  grupoMuscular: GrupoMuscular[];
  equipamiento: Equipamiento[];
  dificultad: Dificultad;
  duracion?: number;
  calorias?: number;
  contraindicaciones: string[];
  variaciones?: string[];
  tags: string[];
  // ... más campos
}
```

### Filtros
```typescript
interface FiltrosEjercicio {
  busqueda?: string;
  gruposMusculares?: string[];
  equipamiento?: string[];
  dificultad?: Dificultad[];
  duracionMin?: number;
  duracionMax?: number;
  soloFavoritos?: boolean;
}
```

## Uso

### Integración Básica
```tsx
import { BibliotecaEjercicios } from '../features/biblioteca-ejercicios';

function MiComponente() {
  return (
    <BibliotecaEjercicios 
      modo="visualizacion"
      mostrarFavoritos={true}
    />
  );
}
```

### Modo Selección
```tsx
import { BibliotecaEjercicios } from '../features/biblioteca-ejercicios';

function SelectorEjercicios() {
  const handleSeleccionar = (ejercicio) => {
    console.log('Ejercicio seleccionado:', ejercicio);
  };

  return (
    <BibliotecaEjercicios 
      modo="seleccion"
      onSeleccionarEjercicio={handleSeleccionar}
      ejerciciosSeleccionados={['1', '2']}
    />
  );
}
```

### Uso del Hook
```tsx
import { useBiblioteca } from '../features/biblioteca-ejercicios';

function MiComponente() {
  const {
    ejercicios,
    ejerciciosFiltrados,
    favoritos,
    cargando,
    actualizarFiltros,
    toggleFavorito
  } = useBiblioteca();

  // Usar el estado y las funciones...
}
```

## Navegación

La biblioteca está integrada en el sistema de navegación principal:
- **Ruta**: `/biblioteca-ejercicios`
- **Icono**: Dumbbell (mancuerna)
- **Disponible para**: Entrenadores y Gimnasios

## Datos Mock

El sistema incluye datos de ejemplo con:
- 6 ejercicios variados (Press de Banca, Sentadillas, Dominadas, etc.)
- 7 grupos musculares
- 8 tipos de equipamiento
- Diferentes niveles de dificultad
- Información completa de seguridad

## Extensibilidad

La arquitectura está preparada para:
- Integración con APIs reales
- Subida de videos e imágenes
- Sistema de calificaciones
- Estadísticas de uso
- Recomendaciones inteligentes
- Creación de ejercicios personalizados
- Integración con programas de entrenamiento

## Consideraciones de Diseño

- **Responsive**: Funciona en dispositivos móviles y desktop
- **Accesibilidad**: Uso de iconos SVG y navegación por teclado
- **Performance**: Filtrado memoizado y carga lazy
- **UX**: Transiciones suaves y feedback visual
- **Consistencia**: Uso del sistema de diseño existente

## Próximas Mejoras

1. **Integración con API real**
2. **Reproductor de video integrado**
3. **Sistema de calificaciones y comentarios**
4. **Ejercicios personalizados por usuario**
5. **Integración directa con programas de entrenamiento**
6. **Estadísticas de uso y analytics**
7. **Modo offline con sincronización**
8. **Exportación de ejercicios a PDF**