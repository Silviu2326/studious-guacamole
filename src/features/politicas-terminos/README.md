# Módulo de Políticas & Términos

Sistema de gestión de políticas y términos para gimnasios. Permite crear, editar y versionar los documentos legales y normativos que rigen la relación con los socios.

## Descripción

Este módulo permite a los administradores de gimnasios gestionar toda la documentación legal y normativa, incluyendo:

- **Políticas de Cancelación**: Reglas para cancelación de membresías, clases y servicios
- **Términos de Privacidad (RGPD)**: Políticas de protección de datos y cumplimiento normativo
- **Normas de Uso**: Código de conducta y reglas de uso de instalaciones

## Funcionalidades

### Gestión de Políticas
- Crear nuevas políticas por tipo
- Editar contenido con editor WYSIWYG básico
- Sistema de versionado inmutable
- Historial completo de versiones

### Versionado
- Cada cambio crea una nueva versión
- Fechas y autores registrados
- Posibilidad de requerir re-aceptación de los socios

### Vista Previa
- Vista previa del contenido HTML
- Formato responsive
- Compatibilidad con dark mode

## Estructura de Archivos

```
src/features/politicas-terminos/
├── api/
│   ├── policiesAPI.ts          # Llamadas a API
│   └── usePoliciesAPI.ts       # Hook personalizado
├── components/
│   ├── PolicyCard.tsx          # Tarjeta de política
│   ├── PolicyEditor.tsx        # Editor de políticas
│   ├── VersionHistory.tsx      # Historial de versiones
│   ├── PoliciesManagerContainer.tsx # Contenedor principal
│   └── index.ts
├── pages/
│   └── politicas-terminosPage.tsx
├── types/
│   └── index.ts                # Tipos TypeScript
├── index.ts
└── README.md
```

## Uso

### Rutas

- **URL**: `/settings/policies`
- **Permisos**: Solo administradores de gimnasio (no entrenadores)

### Componentes Principales

#### PoliciesManagerContainer
Contenedor principal que gestiona el estado de las políticas y coordina las acciones CRUD.

#### PolicyCard
Tarjeta que muestra información resumida de cada política:
- Tipo y título
- Versión activa
- Fecha de última actualización
- Acciones: Editar, Ver Historial

#### PolicyEditor
Editor de políticas con:
- Textarea para contenido HTML
- Vista previa del contenido
- Opción de requerir re-aceptación

#### VersionHistory
Modal que muestra:
- Historial completo de versiones
- Vista detallada de cada versión
- Fechas y autores

## APIs

### GET /api/v1/settings/policies
Obtiene todas las políticas del gimnasio.

### POST /api/v1/settings/policies
Crea una nueva política.

### GET /api/v1/settings/policies/{policyId}/versions
Obtiene el historial de versiones de una política.

### POST /api/v1/settings/policies/{policyId}/versions
Crea una nueva versión de una política existente.

## Tipos de Datos

### PolicyType
```typescript
type PolicyType = 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES';
```

### Policy
```typescript
interface Policy {
  id: string;
  type: PolicyType;
  title: string;
  activeVersion: PolicyVersion;
  createdAt?: string;
  updatedAt?: string;
}
```

### PolicyVersion
```typescript
interface PolicyVersion {
  id: string;
  policyId: string;
  versionNumber: number;
  content: string;
  effectiveDate: string;
  author?: string;
  requireReAcceptance?: boolean;
}
```

## Integración

El módulo está integrado en:
- `src/App.tsx`: Ruta `/settings/policies`
- `src/components/Sidebar.tsx`: Navegación (solo gimnasios)

## Componentes Reutilizables Usados

- `Card` - Tarjetas de políticas
- `Button` - Botones de acción
- `Input` - Búsqueda
- `Modal` - Historial de versiones
- `ConfirmModal` - Confirmaciones
- `Textarea` - Editor de contenido

## Diseño

El módulo sigue el design system del proyecto:
- Colores del gimnasio (purple)
- Tipografía moderna
- Responsive design
- Dark mode compatible
- Iconos de lucide-react

## Notas

- Solo visible para administradores de gimnasio
- El contenido se guarda en HTML
- Cada versión es inmutable
- Soporta requerir aceptación de socios

