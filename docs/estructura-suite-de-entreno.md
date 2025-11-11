# Estructura de "Suite de Entreno" Unificada

## 📋 Resumen de Cambios

**Antes:** 3 páginas separadas
- `/programas-de-entreno` (Programas de Entreno)
- `/editor-de-entreno` (Editor de Entreno)
- `/plantillas-de-entrenamiento` (Plantillas de Entrenamiento)

**Ahora:** 1 página unificada con tabs
- `/suite-de-entreno` (Suite de Entreno)

**Mantenidas:**
- `/biblioteca-de-ejercicios` (Biblioteca de Ejercicios)
- `/check-ins-de-entreno` (Check-ins de Entreno) - Solo entrenador
- `/adherencia` (Adherencia & Cumplimiento)

## 🎯 Estructura de la Página

### Ruta Principal
```
/suite-de-entreno
```

### Tabs / Sub-vistas

#### 1. **Plantillas** (Repositorio)
- **Vista de Grid/Lista** de plantillas disponibles
- **Filtros**:
  - Por tipo (Fuerza, Cardio, HIIT, Yoga, etc.)
  - Por nivel (Principiante, Intermedio, Avanzado)
  - Por objetivo (Pérdida de peso, Ganancia muscular, Resistencia, etc.)
  - Por duración
  - Buscar por nombre
- **Acciones**:
  - Ver detalle de plantilla
  - Duplicar plantilla
  - Crear nueva plantilla
  - Asignar a cliente
  - Exportar/Compartir
- **Información mostrada**:
  - Nombre de la plantilla
  - Duración (semanas/días)
  - Frecuencia (sesiones por semana)
  - Nivel
  - Objetivo
  - Ejercicios incluidos (preview)
  - Uso (cuántas veces asignada)

#### 2. **Programas Asignados** (Por Cliente)
- **Vista de Lista/Tabla** de programas activos
- **Filtros**:
  - Por cliente
  - Por estado (Activo, Completado, Pausado)
  - Por fecha de inicio
  - Por plantilla base
- **Columnas**:
  - Cliente
  - Programa (nombre/plantilla)
  - Fecha inicio
  - Progreso (% completado)
  - Sesiones completadas / Total
  - Adherencia (%)
  - Estado
  - Acciones
- **Acciones**:
  - Ver detalle del programa
  - Editar programa asignado
  - Pausar/Reanudar
  - Completar programa
  - Ver analítica de adherencia
  - Duplicar programa a otro cliente
- **Vista de Detalle** (al hacer clic):
  - Información del cliente
  - Calendario del programa
  - Sesiones completadas vs. pendientes
  - Gráfico de adherencia
  - Notas del entrenador
  - Modificar programa (entra al editor)

#### 3. **Editor** (Modo Edición)
El mismo módulo que antes, pero integrado:
- **Modos de trabajo**:
  - Crear nueva plantilla
  - Editar plantilla existente
  - Editar programa asignado a cliente
- **Vista de Editor**:
  - **Sidebar izquierdo**: Biblioteca de ejercicios (drag & drop)
  - **Área central**: Builder de rutina
    - Días/Semanas (timeline)
    - Agregar ejercicios por día
    - Configurar series, repeticiones, peso, descanso
    - Notas y observaciones
  - **Sidebar derecho**: 
    - Propiedades del programa
    - Configuración (duración, frecuencia, nivel)
    - Preview/previsualización
- **Funcionalidades**:
  - Drag & drop de ejercicios
  - Copiar/pegar sesiones
  - Validación de ejercicios
  - Guardar como plantilla
  - Asignar directamente a cliente
  - Vista previa en móvil

#### 4. **Analítica de Adherencia** (Por Programa)
- **Vista de Dashboard**:
  - **Métricas globales**:
    - Adherencia promedio por programa
    - Programas más efectivos
    - Tasa de completación
  - **Filtros**:
    - Por programa/plantilla
    - Por cliente
    - Por rango de fechas
  - **Gráficos**:
    - Adherencia por programa (barras)
    - Adherencia por cliente (ranking)
    - Tendencias de adherencia (línea temporal)
    - Distribución de sesiones completadas
  - **Tabla detallada**:
    - Programa
    - Cliente
    - Sesiones programadas
    - Sesiones completadas
    - % Adherencia
    - Fecha inicio
    - Fecha fin (o estimada)
  - **Insights**:
    - Programas con baja adherencia (< 70%)
    - Clientes con mejor adherencia
    - Momentos del día/semana con más actividad
    - Ejercicios más completados

## 🎨 Componentes UI Sugeridos

### Header de la Página
```
[Buscar...] [Filtros] [Nueva Plantilla] [Nuevo Programa] [Vista ▼]
```

### Barra de Tabs
```
[Plantillas] [Programas Asignados] [Editor] [Analítica]
```

### Vista de Plantillas
```
┌─────────────────────────────────────────┐
│ Filtros: [Tipo ▼] [Nivel ▼] [Buscar]  │
├─────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │Cardio│ │Fuerza│ │HIIT  │ │Yoga  │    │
│ │ 4 sem│ │ 8 sem│ │ 2 sem│ │ 6 sem│    │
│ └──────┘ └──────┘ └──────┘ └──────┘    │
└─────────────────────────────────────────┘
```

### Vista de Programas Asignados
```
┌─────────────────────────────────────────────────────────┐
│ Cliente        │ Programa │ Progreso │ Adherencia │ ... │
├─────────────────────────────────────────────────────────┤
│ Juan Pérez     │ Fuerza   │  45%     │   78%      │ ... │
│ María García   │ Cardio   │  60%     │   92%      │ ... │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Uso

### Crear y Asignar Programa
1. **Tab Plantillas**: Seleccionar plantilla base
2. **Acción**: "Asignar a cliente" o "Editar antes de asignar"
3. **Editor**: Se abre en modo edición con la plantilla cargada
4. **Personalización**: Ajustar ejercicios, series, repeticiones para el cliente
5. **Guardar**: Guardar como programa asignado (o también como nueva plantilla)
6. **Asignación**: Seleccionar cliente y fecha de inicio
7. **Confirmación**: Programa asignado aparece en tab "Programas Asignados"

### Editar Programa Existente
1. **Tab Programas Asignados**: Buscar programa
2. **Acción**: "Editar programa"
3. **Editor**: Se abre con el programa cargado
4. **Modificaciones**: Realizar cambios
5. **Guardar**: Guarda cambios en el programa asignado

### Ver Analítica
1. **Tab Analítica**: Vista general de adherencia
2. **Filtros**: Aplicar filtros según necesidad
3. **Detalle**: Hacer clic en programa/cliente para ver detalle
4. **Acciones**: Exportar reporte, generar insights

## 📊 Beneficios

✅ **Menos páginas**: 3 páginas → 1 unificada  
✅ **Contexto completo**: Plantillas, programas y análisis en un lugar  
✅ **Flujo optimizado**: Crear → Asignar → Analizar en la misma interfaz  
✅ **Editor integrado**: Mismo módulo para crear/editar  
✅ **Analítica incorporada**: Métricas de adherencia por programa visibles

## 🔧 Implementación Técnica

### Estado de la Aplicación
```typescript
interface SuiteEntrenoState {
  vistaActiva: 'plantillas' | 'programas' | 'editor' | 'analitica';
  plantillas: Plantilla[];
  programasAsignados: ProgramaAsignado[];
  plantillaSeleccionada: Plantilla | null;
  programaEditando: ProgramaAsignado | null;
  modoEditor: 'nueva-plantilla' | 'editar-plantilla' | 'editar-programa';
  filtros: FiltrosSuiteEntreno;
}
```

### Rutas y Query Parameters
```
/suite-de-entreno?tab=plantillas
/suite-de-entreno?tab=programas&cliente=123
/suite-de-entreno?tab=editor&plantilla=456
/suite-de-entreno?tab=editor&programa=789&modo=editar
/suite-de-entreno?tab=analitica&programa=789
```

### Componentes Principales
```
SuiteEntrenoTabs
├─ PlantillasTab
│  ├─ PlantillasGrid
│  ├─ FiltrosPlantillas
│  └─ AccionesPlantilla
├─ ProgramasAsignadosTab
│  ├─ ProgramasLista
│  ├─ FiltrosProgramas
│  └─ DetallePrograma
├─ EditorTab
│  ├─ EditorBuilder
│  ├─ SidebarBiblioteca
│  └─ PropiedadesPrograma
└─ AnaliticaTab
   ├─ MetricasAdherencia
   ├─ GraficosAdherencia
   └─ TablaDetallada
```

## 🚀 Próximos Pasos

1. ✅ **Eliminadas páginas redundantes** del Sidebar
2. ⏳ **Implementar** la página unificada `/suite-de-entreno`
3. ⏳ **Crear tabs** de Plantillas, Programas, Editor y Analítica
4. ⏳ **Integrar editor** en modo edición dentro del tab
5. ⏳ **Implementar analítica** de adherencia por programa
6. ⏳ **Conectar** con Biblioteca de Ejercicios (drag & drop)
7. ⏳ **Vincular** con Check-ins para calcular adherencia

## 📝 Notas Importantes

- El **Editor** es el mismo módulo que antes, pero ahora está integrado como un tab
- Las **Plantillas** son el repositorio base, se pueden asignar directamente o editar antes
- Los **Programas Asignados** son instancias de plantillas personalizadas para clientes específicos
- La **Analítica** se calcula basándose en los check-ins de entrenamiento completados
- Se mantiene compatibilidad con las rutas antiguas mediante redirección a `/suite-de-entreno`












