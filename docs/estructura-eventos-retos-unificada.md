# Estructura de "Eventos & Retos" Unificada

## 📋 Resumen de Cambios

**Antes:** 3 páginas separadas
- `/eventos-retos-especiales` (Mis Retos / Eventos & Retos)
- `/dashboard/experiencias/eventos` (Eventos & Retos Avanzado)
- `/dashboard/experiences/virtual-events` (Webinars & Eventos Virtuales)

**Ahora:** 1 página unificada con 3 tipos
- `/eventos-retos` (Eventos & Retos)

**Mantenidas:**
- `/agenda` (Agenda / Calendario)
- `/reservas-online` (Reservas Online)

## 🎯 Estructura de la Página

### Ruta Principal
```
/eventos-retos
```

### Vista Simple con 3 Tipos

#### Filtros/Tabs por Tipo
- **Presencial**: Eventos físicos en el gimnasio/centro
- **Reto**: Retos de entrenamiento (duración, desafíos)
- **Virtual**: Webinars y eventos online

### Componentes Principales

#### 1. **Header con Filtros**
```
[Agregar Evento] [Filtros: Todos | Presencial | Reto | Virtual] [Buscar...]
```

#### 2. **Vista de Lista/Grid** (Vista Simple)
- **Tarjetas de eventos** con información básica:
  - Tipo (badge: Presencial/Reto/Virtual)
  - Nombre del evento
  - Fecha y hora
  - Ubicación (presencial) / Plataforma (virtual)
  - Participantes inscritos / Máximo
  - Estado (Programado, En curso, Finalizado)
  - Acciones rápidas (Ver, Editar, Eliminar)

#### 3. **Formulario de Creación/Edición**
- **Campos comunes**:
  - Tipo (Presencial / Reto / Virtual) - selector
  - Nombre del evento
  - Descripción
  - Fecha y hora de inicio
  - Duración
  - Capacidad máxima
  - Imagen/thumbnail
  
- **Campos específicos por tipo**:
  - **Presencial**:
    - Ubicación (sala/espacio)
    - Requisitos físicos
    - Material necesario
  - **Reto**:
    - Duración del reto (días/semanas)
    - Objetivo del reto
    - Métricas a seguir
    - Premios/incentivos
  - **Virtual**:
    - Plataforma (Zoom, Teams, etc.)
    - Link de acceso
    - Requisitos técnicos
    - Grabación (sí/no)

#### 4. **Vista de Detalle**
Al hacer clic en un evento:
- Información completa
- Lista de participantes
- Calendario/agenda
- Estadísticas (inscripciones, asistencia)
- Acciones:
  - Editar evento
  - Gestionar participantes
  - Enviar recordatorios
  - Cancelar evento

## 🎨 Componentes UI Sugeridos

### Vista Principal
```
┌─────────────────────────────────────────────────┐
│ Eventos & Retos              [➕ Nuevo Evento]   │
├─────────────────────────────────────────────────┤
│ [Todos] [Presencial] [Reto] [Virtual]  [🔍]     │
├─────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ Presencial│ │ Reto     │ │ Virtual  │          │
│ │ Maratón   │ │ 30 días  │ │ Webinar  │          │
│ │ 15 Ene    │ │ 1-31 Ene │ │ 20 Ene   │          │
│ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────┘
```

### Tabla/Lista Alternativa
```
┌─────────────────────────────────────────────────────────────┐
│ Tipo      │ Nombre        │ Fecha      │ Participantes │ ... │
├─────────────────────────────────────────────────────────────┤
│ Presencial│ Maratón       │ 15 Ene     │ 45/50         │ ... │
│ Reto      │ 30 días       │ 1-31 Ene   │ 120           │ ... │
│ Virtual   │ Webinar       │ 20 Ene     │ 80/100        │ ... │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Uso

### Crear Evento
1. Click en "Nuevo Evento"
2. Seleccionar tipo (Presencial/Reto/Virtual)
3. Completar formulario (campos comunes + específicos del tipo)
4. Guardar
5. Evento aparece en la lista filtrada por tipo

### Ver Eventos
1. Usar filtros para ver por tipo
2. Click en evento para ver detalle
3. Desde el detalle, editar o gestionar participantes

### Filtrar y Buscar
- Filtro por tipo: todos, presencial, reto, virtual
- Búsqueda por nombre, fecha, ubicación
- Filtros adicionales: fecha, estado, capacidad

## 📊 Beneficios

✅ **Menos páginas**: 3 páginas → 1 unificada  
✅ **Vista simple**: Todo en un lugar, fácil de navegar  
✅ **3 tipos claros**: Presencial, Reto, Virtual con filtros  
✅ **Menos clics**: Crear, ver, editar todo en la misma interfaz  
✅ **Contexto unificado**: Todos los eventos visibles con filtros

## 🔧 Implementación Técnica

### Estado de la Aplicación
```typescript
interface EventosState {
  eventos: Evento[];
  tipoFiltro: 'todos' | 'presencial' | 'reto' | 'virtual';
  eventoSeleccionado: Evento | null;
  mostrarFormulario: boolean;
  eventoEditando: Evento | null;
}

type TipoEvento = 'presencial' | 'reto' | 'virtual';

interface Evento {
  id: string;
  tipo: TipoEvento;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  capacidad: number;
  participantes: string[];
  estado: 'programado' | 'en-curso' | 'finalizado' | 'cancelado';
  // Campos específicos por tipo
  ubicacion?: string; // presencial
  plataforma?: string; // virtual
  linkAcceso?: string; // virtual
  duracionDias?: number; // reto
  objetivo?: string; // reto
}
```

### Query Parameters
```
/eventos-retos?tipo=presencial
/eventos-retos?tipo=reto
/eventos-retos?tipo=virtual
/eventos-retos?evento=123
```

## 🚀 Próximos Pasos

1. ✅ **Eliminadas páginas redundantes** del Sidebar
2. ⏳ **Implementar** la página unificada `/eventos-retos`
3. ⏳ **Crear componentes** de filtros por tipo
4. ⏳ **Unificar formularios** de los 3 tipos
5. ⏳ **Implementar vista** simple de lista/grid
6. ⏳ **Mantener compatibilidad** con rutas antiguas (redirección)

## 📝 Notas Importantes

- La página unificada debe ser **simple** y **fácil de usar**
- Los 3 tipos deben estar claramente diferenciados con badges/iconos
- El formulario debe mostrar campos dinámicos según el tipo seleccionado
- Las rutas antiguas deben redirigir a `/eventos-retos` con el tipo correspondiente
- Para entrenadores: mostrar solo "Mis Retos" (filtro por defecto)
- Para gimnasios: mostrar todos los tipos disponibles









