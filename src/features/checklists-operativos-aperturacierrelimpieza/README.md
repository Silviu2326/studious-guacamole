# Checklists Operativos (Apertura/Cierre/Limpieza)

## Descripción

Sistema completo de gestión de checklists operativos para gimnasios. Permite estandarizar y digitalizar procesos internos críticos como la apertura, el cierre, la limpieza y el mantenimiento de equipos.

## Características Principales

### 📋 Gestión de Plantillas
- Creación de plantillas de checklist reutilizables
- Configuración de tareas críticas y no críticas
- Edición y eliminación de plantillas
- Organización por tipo de operación

### ✅ Ejecución de Checklists
- Asignación de checklists al personal
- Ejecución desde cualquier dispositivo
- Seguimiento de progreso en tiempo real
- Marcado de tareas como completadas, omitidas o con incidencias

### ⚠️ Reporte de Incidencias
- Marcar tareas con problemas
- Agregar notas descriptivas
- Adjuntar fotos de evidencias
- Notificación inmediata a gerencia

### 📊 Dashboard y Monitoreo
- Vista de estado de todos los checklists
- Métricas de cumplimiento
- Identificación de checklists retrasados
- Historial completo de operaciones

## Estructura del Módulo

```
checklists-operativos-aperturacierrelimpieza/
├── components/                    # Componentes React
│   ├── ChecklistDashboard.tsx     # Dashboard principal
│   ├── ChecklistTemplateBuilder.tsx # Constructor de plantillas
│   ├── ChecklistInstanceView.tsx  # Vista de instancia de checklist
│   ├── ChecklistItem.tsx          # Componente de tarea individual
│   └── index.ts                   # Exportaciones
├── pages/                         # Páginas
│   └── checklists-operativos-aperturacierrelimpiezaPage.tsx
├── api/                           # APIs mock
│   └── checklistsApi.ts           # Endpoints de API
├── services/                      # Servicios
│   └── checklistsService.ts       # Lógica de negocio
├── types/                         # Tipos TypeScript
│   └── index.ts                   # Definiciones de tipos
├── index.ts                       # Exportaciones principales
└── README.md                      # Esta documentación
```

## Componentes Principales

### ChecklistDashboard
Componente principal que renderiza la vista general de los checklists. Obtiene los datos, maneja los filtros y muestra un resumen del estado de todos los checklists.

**Props:**
- `userRole: 'manager' | 'staff'` - Determina la vista y las acciones disponibles

### ChecklistTemplateBuilder
Formulario completo para crear y editar plantillas de checklist. Permite añadir, eliminar y reordenar tareas de forma dinámica.

**Props:**
- `templateId?: string | null` - ID de la plantilla a editar (opcional)
- `onSave: (template: ChecklistTemplate) => void` - Callback al guardar
- `onCancel?: () => void` - Callback al cancelar

### ChecklistInstanceView
Muestra una instancia específica de un checklist para ser completada por el personal. Maneja el estado de cada tarea individualmente.

**Props:**
- `instanceId: string` - ID de la instancia del checklist

### ChecklistItem
Componente de UI que renderiza una única tarea dentro de un checklist. Incluye checkbox, campo de notas y botón para adjuntar archivos.

**Props:**
- `taskText: string` - El texto de la tarea
- `status: TaskStatus` - El estado actual
- `onStatusChange: (newStatus: TaskStatus, notes?: string) => void` - Callback de cambio
- `notes?: string` - Notas asociadas
- `isCritical?: boolean` - Si la tarea es crítica

## APIs Implementadas

### Templates
- `GET /api/operations/checklists/templates` - Obtener todas las plantillas
- `POST /api/operations/checklists/templates` - Crear nueva plantilla
- `PUT /api/operations/checklists/templates/{id}` - Actualizar plantilla
- `DELETE /api/operations/checklists/templates/{id}` - Eliminar plantilla

### Instances
- `GET /api/operations/checklists/instances` - Obtener instancias con filtros
- `GET /api/operations/checklists/instances/{id}` - Obtener detalles de instancia
- `PATCH /api/operations/checklists/instances/{id}/items/{itemId}` - Actualizar estado de tarea
- `POST /api/operations/checklists/instances` - Crear nueva instancia

## Tipos de Datos

### ChecklistTemplate
```typescript
{
  id: string;
  name: string;
  description: string;
  taskCount: number;
  tasks: ChecklistTemplateTask[];
  createdAt: string;
}
```

### ChecklistInstance
```typescript
{
  id: string;
  templateId: string;
  templateName: string;
  assignedTo: { id: string; name: string };
  dueDate: string;
  status: ChecklistStatus;
  completionPercentage: number;
  items?: ChecklistItem[];
  startedAt?: string;
  completedAt?: string;
}
```

### ChecklistItem
```typescript
{
  id: string;
  text: string;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
}
```

## Uso

La funcionalidad está disponible para usuarios con rol de gimnasio (gerente o admin) en la ruta `/operations/checklists`.

### Para Gerentes
- Crear y gestionar plantillas de checklist
- Asignar checklists al personal
- Monitorear el estado de todos los checklists
- Ver reportes de incidencias
- Revisar historial de cumplimiento

### Para Personal
- Ver checklists asignados
- Marcar tareas como completadas
- Reportar incidencias con notas y fotos
- Ver progreso en tiempo real

## Flujo de Uso Típico

1. **Gerente crea plantilla**: Define tareas para apertura, cierre o limpieza
2. **Gerente asigna checklist**: Asigna instancia al personal para una fecha
3. **Personal ejecuta**: Marca tareas completadas, reporta incidencias
4. **Gerente monitorea**: Ve dashboard con estado en tiempo real
5. **Reportes**: Sistema genera métricas de cumplimiento

## Notas Técnicas

- Usa componentes reutilizables de `src/components/componentsreutilizables`
- Implementa sistema de diseño consistente (ds)
- APIs mock implementadas para desarrollo
- Sin dependencias de librerías externas especializadas
- Completamente responsive

