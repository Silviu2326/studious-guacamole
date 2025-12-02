# Plantillas de Mensajes y Contratos

## Descripción

Sistema completo de gestión de plantillas de comunicación automatizada para gimnasios y entrenadores personales. Permite crear, editar y gestionar plantillas de Email, SMS y Contratos digitales con variables dinámicas personalizables.

## Características Principales

### Tipos de Plantillas
- **Email**: Plantillas de correo electrónico con asunto personalizable
- **SMS**: Plantillas de mensajes de texto cortos
- **Contratos**: Plantillas de documentos legales con soporte para firma digital

### Funcionalidades
- ✅ Crear, editar y eliminar plantillas
- ✅ Duplicar plantillas existentes
- ✅ Variables dinámicas ({{client_name}}, {{membership_plan}}, etc.)
- ✅ Previsualización de plantillas
- ✅ Filtrado por tipo y búsqueda
- ✅ Estadísticas rápidas (totales, activas, por tipo)
- ✅ Activación/desactivación de plantillas
- ✅ Soporte para firma digital en contratos

## Estructura del Módulo

```
plantillas-de-mensajes-y-contratos/
├── api/                           # Lógica de API
│   ├── templatesAPI.ts           # Cliente API para llamadas HTTP
│   └── useTemplateAPI.ts         # Hook personalizado para estado y operaciones
├── components/                    # Componentes React
│   ├── TemplateList.tsx          # Lista de plantillas con tabla
│   ├── TemplateEditor.tsx        # Editor modal para crear/editar
│   ├── TemplateManagerContainer.tsx # Contenedor principal
│   └── index.ts                  # Exportaciones
├── pages/                         # Páginas
│   └── plantillas-de-mensajes-y-contratosPage.tsx
├── types/                         # TypeScript
│   └── index.ts                  # Interfaces y tipos
├── index.ts                       # Exportaciones del módulo
└── README.md                      # Esta documentación
```

## Uso

### Ruta
`/settings/templates`

### Ejemplo de Uso

```tsx
import { PlantillasDeMensajesYContratosPage } from '@/features/plantillas-de-mensajes-y-contratos';

// En tu router
<Route path="/settings/templates" element={<PlantillasDeMensajesYContratosPage />} />
```

## Variables Dinámicas Disponibles

Las siguientes variables están disponibles para personalizar automáticamente las plantillas:

- `{{client_name}}` - Nombre completo del cliente
- `{{client_first_name}}` - Primer nombre del cliente
- `{{client_last_name}}` - Apellido del cliente
- `{{client_email}}` - Email del cliente
- `{{client_phone}}` - Teléfono del cliente
- `{{join_date}}` - Fecha de registro
- `{{membership_plan}}` / `{{plan_name}}` - Plan de membresía
- `{{next_session_date}}` - Próxima sesión agendada
- `{{gym_name}}` - Nombre del gimnasio
- `{{gym_address}}` - Dirección del gimnasio
- `{{gym_phone}}` - Teléfono del gimnasio
- `{{today_date}}` - Fecha actual

## APIs Requeridas

### GET `/api/settings/templates`
Obtiene todas las plantillas con paginación.

**Query params**: `page`, `limit`, `type`

### POST `/api/settings/templates`
Crea una nueva plantilla.

**Body**: `CreateTemplateRequest`

### PUT `/api/settings/templates/:id`
Actualiza una plantilla existente.

**Body**: `UpdateTemplateRequest`

### DELETE `/api/settings/templates/:id`
Elimina una plantilla.

## Componentes Reutilizables Utilizados

- `Table` - Para mostrar lista de plantillas
- `Modal` - Para el editor de plantillas
- `ConfirmModal` - Para confirmar eliminación
- `Input` - Campos de formulario
- `Textarea` - Editor de contenido
- `Select` - Tipo de plantilla
- `Button` - Acciones
- `Card` - Contenedores
- `Badge` - Estados y tipos

## Notas Técnicas

- La página es idéntica para entrenadores y gimnasios
- Las plantillas se pueden vincular a automatizaciones
- Los contratos con `requiresSignature: true` habilitan la firma digital
- Las variables se sustituyen automáticamente al enviar

