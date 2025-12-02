# Documentación Interna y Protocolos

## Descripción

Sistema completo de gestión de documentación interna y protocolos para gimnasios. Esta herramienta centraliza todos los documentos operativos, de seguridad y cumplimiento necesarios para el funcionamiento del centro.

**Tipo de Usuario:** Solo Gimnasio

## Características Principales

### 📚 Biblioteca de Documentos
- **Repositorio centralizado** de todos los protocolos y documentos operativos
- **Múltiples formatos** soportados: PDF, DOCX, HTML, TXT, imágenes
- **Organización por categorías** personalizables
- **Búsqueda y filtrado** avanzado

### 🔄 Control de Versiones
- **Historial completo** de cambios en cada documento
- **Versionado automático** al actualizar documentos
- **Notas de cambios** para rastrear mejoras

### ✅ Sistema de Acuse de Recibo
- **Confirmación de lectura** para documentos importantes
- **Seguimiento de cumplimiento** por usuario
- **Asignación de documentos obligatorios** por rol
- **Reporte de cumplimiento** en tiempo real

### 📊 Dashboard de Cumplimiento
- **Estadísticas clave**: total documentos, pendientes, desactualizados
- **Seguimiento de compliance** del personal
- **Alertas automáticas** para documentos obsoletos

## Estructura del Módulo

```
documentacion-interna-y-protocolos/
├── api/
│   └── documentsApi.ts          # API con funciones CRUD y mock data
├── components/
│   ├── DocumentLibraryContainer.tsx    # Container principal
│   ├── DocumentList.tsx                # Lista de documentos
│   ├── DocumentViewer.tsx              # Visor de documentos
│   ├── DocumentUploadModal.tsx         # Modal subir/editar
│   └── index.ts                        # Exportaciones
├── pages/
│   └── documentacion-interna-y-protocolosPage.tsx  # Página principal
├── types/
│   └── index.ts                        # Tipos TypeScript
├── index.ts                            # Exportaciones del módulo
└── README.md                           # Este archivo
```

## Uso del Módulo

### Ruta de Acceso
```
/operations/documents
```

### Permisos
- **Gerentes/Admins**: Acceso completo (crear, editar, eliminar documentos)
- **Personal de Gimnasio**: Acceso de lectura y confirmación

### Funcionalidades por Rol

#### Gerentes/Admins
- Crear y editar documentos
- Organizar por categorías
- Marcar documentos como obligatorios
- Asignar documentos a roles específicos
- Ver reportes de cumplimiento
- Archivar documentos obsoletos

#### Personal
- Ver documentos asignados
- Confirmar lectura de documentos obligatorios
- Buscar y filtrar documentos
- Descargar documentos para uso offline

## Componentes Principales

### DocumentLibraryContainer
Container principal que gestiona:
- Estado de la biblioteca de documentos
- Filtros y búsqueda
- Estadísticas y métricas
- Acciones CRUD

### DocumentList
Lista presentacional que muestra:
- Grid de documentos organizados
- Estados visuales (confirmado, pendiente, requerido)
- Información de versión y actualización

### DocumentViewer
Visor de documentos con:
- Previsualización de contenido
- Acciones de descarga y visualización
- Sistema de acuse de recibo
- Información de metadatos

### DocumentUploadModal
Modal para gestión de documentos con:
- Subida de archivos (drag & drop)
- Editor de texto enriquecido
- Configuración de requisitos
- Validaciones

## APIs Implementadas

### GET /api/operations/documents
Obtiene lista de documentos con filtros opcionales.

Parámetros de query:
- `category`: Filtrar por ID de categoría
- `q`: Búsqueda por título o contenido
- `status`: Filtrar por estado

### POST /api/operations/documents
Crea un nuevo documento.

Body (multipart/form-data):
- `title`: Título del documento
- `categoryId`: ID de la categoría
- `file`: Archivo (opcional)
- `content`: Contenido HTML/texto (opcional)
- `isRequired`: Boolean
- `requiredFor`: Array de roles

### PUT /api/operations/documents/{docId}
Actualiza un documento existente.

### DELETE /api/operations/documents/{docId}
Elimina/archiva un documento.

### POST /api/operations/documents/{docId}/acknowledge
Confirma lectura de un documento.

## Componentes Reutilizables Utilizados

- `Card`: Contenedores de documentos
- `Button`: Acciones del sistema
- `Input`: Búsqueda y formularios
- `Select`: Filtros de categoría
- `Textarea`: Editor de contenido
- `Modal`: Diálogos de confirmación
- `Table`: Listas estructuradas
- `Badge`: Estados visuales
- `MetricCards`: Dashboard de estadísticas
- `Tabs`: Navegación por categorías

## Estados y Tipos

### DocumentStatus
- `draft`: Borrador
- `published`: Publicado
- `archived`: Archivado

### DocumentType
- `pdf`: PDF
- `docx`: Word
- `html`: HTML
- `txt`: Texto plano
- `image`: Imágenes

### Document
Interfaz principal con:
- Identificación única
- Metadatos (título, categoría, versión)
- Información de autoría
- Estado de confirmación del usuario
- Requisitos y asignaciones

## Mejoras Futuras

- [ ] Visor de PDF embebido en la plataforma
- [ ] Sistema de comentarios en documentos
- [ ] Notificaciones push para documentos nuevos
- [ ] Exportación de reportes de cumplimiento
- [ ] Traducción automática de documentos
- [ ] Integración con almacenamiento en la nube
- [ ] Editor WYSIWYG mejorado
- [ ] Sistema de plantillas de documentos

## Notas Técnicas

- Los documentos utilizan un sistema de versionado semántico
- El acuse de recibo se vincula a la versión específica del documento
- Los documentos desactualizados (más de 1 año) se marcan automáticamente
- El sistema soporta múltiples categorías personalizables
- Se implementa mock data para desarrollo sin backend

## Integración

El módulo se integra en:
- `src/App.tsx`: Registro de ruta `/operations/documents`
- `src/components/Sidebar.tsx`: Enlace en menú lateral
- Rol: Solo visible para usuarios de gimnasio (gerente, admin, staff)

## Desarrollo

Para probar el módulo:
1. Iniciar sesión como usuario de gimnasio
2. Navegar a "Documentación y Protocolos" en el menú
3. Explorar documentos existentes
4. Crear nuevo documento (requiere rol admin/gerente)
5. Confirmar lectura de documentos obligatorios

