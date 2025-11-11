# Estructura de "Mis Clientes" Unificada

## 📋 Resumen de Cambios

**Antes:** 3 páginas separadas
- `/gestión-de-clientes` (Clientes Activos)
- `/crm/clientes-en-riesgo` (Clientes en Riesgo)
- `/crm/clientes/bajas` (Clientes Perdidos)

**Ahora:** 1 página unificada con segmentos inteligentes
- `/gestión-de-clientes` (Mis Clientes / Clientes)

## 🎯 Estructura de la Página

### Ruta Principal
```
/gestión-de-clientes
```

### Tabs / Sub-vistas

#### 1. **Lista & Filtros** (Vista Principal)
- **Búsqueda avanzada**: Por nombre, email, teléfono, etiquetas
- **Filtros**:
  - Estado (Activo, Inactivo, Pausado, Cancelado)
  - Etiquetas personalizadas
  - Fechas (última actividad, último pago, etc.)
  - Segmentos inteligentes (dropdown)
- **Vista de tabla** con columnas configurables:
  - Nombre
  - Email / Teléfono
  - Estado
  - Última actividad
  - Próximo pago
  - Etiquetas
  - Acciones rápidas

#### 2. **Segmentos Inteligentes** (Filtros predefinidos)
- **Activos**: Clientes con membresía activa y pagos al día
- **Riesgo**: 
  - Clientes con pagos atrasados
  - Baja adherencia (último entrenamiento > 14 días)
  - Sin actividad reciente
- **Perdidos**: 
  - Membresías canceladas
  - Sin respuesta a seguimiento > 30 días
- **Nuevos**: Clientes registrados en últimos 30 días
- **Inactivos**: 
  - 14 días sin actividad
  - 30 días sin actividad
  - 60 días sin actividad
- **Deudores**: Clientes con pagos pendientes o morosos

#### 3. **Pipeline** (Vista Kanban)
- Columnas configurables:
  - Nuevo Lead
  - Contactado
  - Evaluación
  - Negociación
  - Cerrado (Activo)
- Cards con información básica del cliente
- Drag & drop entre columnas
- Filtros por etapa, responsable, fecha

#### 4. **Inbox** (Opcional - Centralizado)
Solo si se implementa centralización de comunicación:
- **WhatsApp**: Mensajes no leídos, conversaciones
- **SMS**: Mensajes recibidos
- **Email**: Emails del cliente
- Vista unificada por cliente
- Respuestas rápidas
- Notificaciones de mensajes no leídos

#### 5. **Perfil 360 del Cliente** (Modal o Vista Detallada)
Al hacer clic en un cliente, mostrar:

**Pestañas del Perfil:**
- **Resumen**: Información básica, estado, suscripción actual
- **Entrenos**: 
  - Historial de entrenamientos
  - Programas asignados
  - Adherencia (% cumplimiento)
  - Próximas sesiones
- **Dietas**:
  - Dietas asignadas
  - Historial nutricional
  - Restricciones alimentarias
  - Check-ins nutricionales
- **Check-ins**:
  - Check-ins de entrenamiento
  - Check-ins nutricionales
  - Fotos de progreso
  - Medidas corporales
- **Pagos**:
  - Historial de pagos
  - Próximos pagos
  - Métodos de pago
  - Facturas
- **Suscripción**:
  - Plan actual
  - Fecha de inicio/fin
  - Renovaciones
  - Historial de planes
- **Notas**:
  - Notas del entrenador/gimnasio
  - Observaciones
  - Objetivos
- **Tareas**:
  - Tareas pendientes relacionadas
  - Seguimientos programados
  - Recordatorios
- **Riesgos**:
  - Indicadores de riesgo
  - Alertas (pagos, adherencia, etc.)
  - Acciones de retención
- **Objetivos**:
  - Objetivos establecidos
  - Progreso
  - Métricas clave

## 🎨 Componentes UI Sugeridos

### Header de la Página
```
[Buscar cliente...] [Filtros] [Segmentos ▼] [Nueva Vista] [Exportar]
```

### Barra de Tabs
```
[Lista & Filtros] [Pipeline] [Inbox] [Segmentos]
```

### Sidebar de Segmentos (Opcional)
```
Segmentos Inteligentes
├─ Activos (125)
├─ Riesgo (8)
├─ Perdidos (12)
├─ Nuevos (5)
├─ Inactivos
│  ├─ 14 días (3)
│  ├─ 30 días (7)
│  └─ 60 días (15)
└─ Deudores (4)
```

## 🔄 Flujo de Uso

1. **Acceso**: Usuario entra a "Mis Clientes"
2. **Vista por defecto**: Lista de clientes activos con filtros básicos
3. **Segmentación**: Usuario selecciona un segmento (ej: "Riesgo")
4. **Filtrado**: La lista se actualiza automáticamente
5. **Detalle**: Clic en cliente → Abre Perfil 360
6. **Acciones**: Desde el perfil, puede:
   - Editar información
   - Agregar notas
   - Programar seguimiento
   - Ver historial completo
   - Marcar como perdido/recuperado

## 📊 Beneficios

✅ **Menos clics**: Todo en una sola página  
✅ **Más contexto**: Información completa del cliente visible  
✅ **Segmentación inteligente**: Filtros predefinidos útiles  
✅ **Vista unificada**: Pipeline, lista e inbox en un lugar  
✅ **Perfil 360**: Toda la información del cliente accesible

## 🔧 Implementación Técnica

### Estado de la Aplicación
```typescript
interface ClienteState {
  clientes: Cliente[];
  segmentoActivo: Segmento;
  vistaActiva: 'lista' | 'pipeline' | 'inbox' | 'segmentos';
  clienteSeleccionado: Cliente | null;
  filtros: FiltrosCliente;
}
```

### Segmentos Inteligentes
```typescript
type Segmento = 
  | 'activos'
  | 'riesgo'
  | 'perdidos'
  | 'nuevos'
  | 'inactivos-14'
  | 'inactivos-30'
  | 'inactivos-60'
  | 'deudores';
```

### Query Parameters
```
/gestión-de-clientes?segmento=riesgo&vista=pipeline&cliente=123
```

## 🚀 Próximos Pasos

1. ✅ **Eliminadas páginas redundantes** del Sidebar
2. ⏳ **Implementar** la página unificada `/gestión-de-clientes`
3. ⏳ **Crear componentes** de segmentos inteligentes
4. ⏳ **Implementar** Perfil 360 del cliente
5. ⏳ **Integrar** Pipeline Kanban (si aplica)
6. ⏳ **Integrar** Inbox unificado (opcional)











