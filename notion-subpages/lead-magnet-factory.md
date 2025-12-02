# Lead Magnet Factory

**Página padre:** Hola

---

# Lead Magnet Factory
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad es una herramienta de creación y gestión diseñada exclusivamente para los roles de 'Entrenador Personal' y 'Entrenador Asociado'. Son ellos quienes diseñan, configuran y analizan el rendimiento de los imanes de plomo. El rol 'Lead/Potencial Cliente' no accede a esta interfaz, sino que interactúa con el resultado final: los formularios y las páginas de descarga generadas por esta 'fábrica'.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/lead-magnets
## Descripción Funcional
La 'Lead Magnet Factory' es el motor central de captación de clientes de TrainerERP. Es una suite de herramientas integrada que permite a los entrenadores personales diseñar, crear, publicar y gestionar imanes de plomo (lead magnets) de alta conversión sin necesidad de conocimientos técnicos o de diseño. Más allá de un simple gestor de archivos, esta funcionalidad ofrece plantillas prediseñadas y específicas para el nicho del fitness, como 'Guías de Nutrición en PDF', 'Planes de Entrenamiento de 7 días', 'Checklists de Hábitos Saludables' o 'Calculadoras Interactivas' (macros, IMC, gasto calórico). El entrenador puede personalizar estas plantillas con su marca, contenido y estilo. Cada lead magnet se asocia automáticamente a un formulario de captura de datos personalizable y se conecta con el módulo de automatización de email marketing. De esta forma, cuando un potencial cliente descarga una guía, no solo se registra como lead en el CRM de TrainerERP, sino que también puede iniciar una secuencia de correos de seguimiento predefinida, nutriéndolo desde el interés inicial hasta la conversión en cliente de pago. El sistema incluye un panel de análisis para medir el rendimiento de cada lead magnet, mostrando métricas clave como visualizaciones, descargas, tasa de conversión y cuántos clientes de pago ha generado cada uno.
## Valor de Negocio
El valor de negocio de la 'Lead Magnet Factory' es fundamental y directo, ya que ataca el principal desafío de cualquier entrenador personal: la generación constante y predecible de clientes potenciales cualificados. Esta herramienta transforma el marketing de un esfuerzo manual y esporádico a un sistema automatizado y escalable. Al proporcionar plantillas y herramientas específicas del sector fitness, elimina la barrera técnica y creativa, permitiendo que los entrenadores se centren en lo que mejor saben hacer: crear contenido de valor sobre entrenamiento y nutrición. Esto posiciona al entrenador como una autoridad en su nicho, generando confianza desde el primer contacto. Al integrar la captura de leads directamente con el CRM y las automatizaciones de marketing de TrainerERP, se cierra el ciclo de conversión, acortando el tiempo entre el primer contacto y la venta. Aumenta el valor del ciclo de vida del cliente al iniciar la relación con una base de confianza y valor aportado. En resumen, esta funcionalidad es un motor de crecimiento que alimenta todo el embudo de ventas del entrenador, reduciendo la dependencia de métodos de captación menos eficientes y proporcionando datos claros sobre qué estrategias de marketing funcionan mejor.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: MVP
## User Stories
- Como entrenador personal, quiero elegir entre una variedad de plantillas profesionales (guías, checklists, planes) para crear un lead magnet en menos de 15 minutos sin necesitar un diseñador gráfico.
- Como coach online, quiero crear una 'Calculadora de Macronutrientes' interactiva que pida el email del usuario para enviarle sus resultados personalizados, capturando así un lead altamente cualificado.
- Como dueño de un estudio de entrenamiento, quiero visualizar un dashboard que compare el rendimiento de todos mis lead magnets, para saber cuál me genera más clientes y así poder invertir más en promocionarlo.
- Como entrenador que vende programas online, quiero que cada vez que alguien descargue mi 'Guía de 30 días para empezar tu transformación', se le asigne la etiqueta 'Interesado en Transformación' y se inicie automáticamente una secuencia de 5 emails que le presente mi programa de pago.
- Como entrenador personal, quiero obtener un enlace único y un código para incrustar el formulario de mi nuevo 'Plan de entrenamiento en casa gratis' directamente en mi página web externa construida en WordPress.
## Acciones Clave
- Crear un nuevo lead magnet seleccionando un tipo (PDF, Calculadora, Checklist, Quiz).
- Personalizar una plantilla de lead magnet con mi propio texto, imágenes y branding.
- Configurar los campos del formulario de captura de datos asociado al lead magnet.
- Conectar un lead magnet a una automatización de email o a una etiqueta de segmentación específica.
- Analizar las métricas de rendimiento: visualizaciones, tasa de conversión de formulario, leads generados y conversión a cliente.
- Publicar el lead magnet y obtener el enlace para compartirlo en redes sociales o el código para incrustarlo en una web.
- Editar o desactivar un lead magnet existente.
## 🧩 Componentes React Sugeridos
### 1. LeadMagnetDashboard
Tipo: container | Componente principal que renderiza la lista de lead magnets existentes y las estadísticas generales. Gestiona la carga de datos y las acciones de alto nivel como 'Crear Nuevo Lead Magnet'.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para filtrar los lead magnets.
Estados: isLoading: boolean, leadMagnets: LeadMagnet[], error: string | null, stats: GlobalStats
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<LeadMagnetDashboard trainerId='trainer-123' />
```

### 2. LeadMagnetCard
Tipo: presentational | Muestra la información resumida de un único lead magnet en una tarjeta, incluyendo su nombre, tipo, una miniatura, y KPIs clave como descargas y tasa de conversión. Ofrece acciones rápidas (editar, ver estadísticas, eliminar).
Props:
- magnet: 
- LeadMagnet (requerido) - Objeto con los datos del lead magnet a mostrar.
- onEdit: 
- () => void (requerido) - Callback que se ejecuta al hacer clic en el botón de editar.
- onDelete: 
- () => void (requerido) - Callback para el evento de eliminación.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<LeadMagnetCard magnet={magnetData} onEdit={() => handleEdit(magnet.id)} onDelete={() => handleDelete(magnet.id)} />
```

### 3. LeadMagnetBuilder
Tipo: container | Un componente complejo que contiene el flujo de creación/edición de un lead magnet. Renderiza condicionalmente diferentes interfaces según el tipo de lead magnet seleccionado (editor de PDF, configurador de calculadora, etc.).
Props:
- magnetId: 
- string | null (opcional) - ID del lead magnet a editar. Si es null, se abre en modo creación.
- onSave: 
- (magnet: LeadMagnet) => void (requerido) - Callback que se ejecuta cuando el lead magnet se guarda con éxito.
Estados: magnetType: 'PDF' | 'CALCULATOR' | 'CHECKLIST', magnetData: Partial<LeadMagnet>, currentStep: number, isSaving: boolean
Dependencias: react-hook-form, quilljs (para editor de texto)
Ejemplo de uso:
```typescript
<LeadMagnetBuilder magnetId='lm-456' onSave={handleSaveSuccess} />
```

### 4. useLeadMagnetAnalytics
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y procesamiento de los datos analíticos de uno o varios lead magnets.
Props:
- magnetId: 
- string | null (opcional) - ID del magnet específico, o null para obtener estadísticas globales.
- dateRange: 
- { startDate: Date, endDate: Date } (requerido) - Rango de fechas para filtrar las analíticas.
Dependencias: react-query
Ejemplo de uso:
```typescript
const { data, isLoading } = useLeadMagnetAnalytics({ magnetId: 'lm-456', dateRange });
```
## 🔌 APIs Requeridas
### 1. POST /api/marketing/lead-magnets
Crea un nuevo lead magnet para el entrenador autenticado.
Parámetros:
- body (
- object, body, requerido): Objeto con la configuración del nuevo lead magnet.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto completo del lead magnet recién creado, incluyendo su ID.
```json
{
  "id": "lm-abc789",
  "trainerId": "trainer-123",
  "name": "Guía de Nutrición Keto",
  "type": "PDF_EDITOR",
  "status": "DRAFT",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos inválidos en el body, como un tipo de lead magnet no soportado.
- 403: 
- Forbidden - El plan del usuario no permite crear más lead magnets.

### 2. GET /api/marketing/lead-magnets
Obtiene la lista de todos los lead magnets creados por el entrenador autenticado.
Parámetros:
- status (
- string, query, opcional): Filtra por estado ('DRAFT', 'PUBLISHED', 'ARCHIVED').
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto es un lead magnet con sus datos principales y estadísticas resumidas.
```json
[
  {
    "id": "lm-abc789",
    "name": "Guía de Nutrición Keto",
    "type": "PDF_EDITOR",
    "status": "PUBLISHED",
    "stats": {
      "views": 1204,
      "leads": 350,
      "conversionRate": 0.29
    }
  }
]
```
Autenticación: Requerida

### 3. PUT /api/marketing/lead-magnets/{id}
Actualiza la configuración de un lead magnet existente.
Parámetros:
- id (
- string, path, requerido): ID del lead magnet a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto completo del lead magnet actualizado.
```json
{
  "id": "lm-abc789",
  "name": "Guía Definitiva de Nutrición Keto",
  "status": "PUBLISHED",
  "...": "..."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El lead magnet con el ID especificado no existe o no pertenece al entrenador.

### 4. GET /api/marketing/lead-magnets/{id}/analytics
Obtiene las estadísticas detalladas de rendimiento para un lead magnet específico.
Parámetros:
- id (
- string, path, requerido): ID del lead magnet.
- startDate (
- string (ISO 8601), query, requerido): Fecha de inicio del rango de análisis.
- endDate (
- string (ISO 8601), query, requerido): Fecha de fin del rango de análisis.
Respuesta:
Tipo: object
Estructura: Un objeto con KPIs detallados y datos para gráficos.
```json
{
  "totalViews": 5230,
  "totalLeads": 1250,
  "conversionRate": 0.239,
  "convertedToClient": 85,
  "clientConversionRate": 0.068,
  "leadsOverTime": [
    {
      "date": "2023-10-01",
      "count": 45
    },
    {
      "date": "2023-10-02",
      "count": 51
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El lead magnet con el ID especificado no existe.

### 5. POST /api/public/leads
Endpoint público para la captura de un nuevo lead desde un formulario. No requiere autenticación de entrenador.
Parámetros:
- submissionData (
- object, body, requerido): Contiene los datos del formulario (email, nombre, etc.) y el ID del lead magnet de origen.
Respuesta:
Tipo: object
Estructura: Devuelve un mensaje de éxito.
```json
{
  "status": "success",
  "message": "Lead captured successfully."
}
```
Autenticación: No requerida
Errores posibles:
- 400: 
- Bad Request - Falta el email o el ID del lead magnet.
- 422: 
- Unprocessable Entity - El email ya existe en la base de datos de leads para este entrenador.
## Notas Técnicas
Colecciones backend: leadMagnets (id, trainerId, name, type, status, config, assetUrl, stats), leads (id, email, name, sourceLeadMagnetId, status, tags, submissionData), assets (id, trainerId, originalFilename, storageUrl, mimeType, size), leadMagnetTemplates (id, name, type, previewUrl, initialConfig), automations (id, trainerId, name, triggerType, steps)
KPIs visibles: Total de Leads Generados (por lead magnet y global)., Tasa de Conversión de la Página (leads / visitantes únicos)., Tasa de Conversión a Cliente (clientes / leads generados por este magnet)., Coste por Lead (CPL) (si se integra con el módulo de publicidad)., Rendimiento del Lead Magnet (tabla comparativa de los mejores y peores)., Leads generados en los últimos 30 días (gráfico de tendencia).
## Documentación Completa
## Resumen
La 'Lead Magnet Factory' es el componente estratégico de TrainerERP dentro del área de 'CAPTURA & CONVERSIÓN'. Su propósito es empoderar a los entrenadores personales para que construyan un embudo de marketing de atracción robusto y automatizado. Esta herramienta permite la creación, gestión y análisis de 'imanes de plomo', recursos de valor (guías, planes, calculadoras) que se ofrecen gratuitamente a cambio de los datos de contacto de un cliente potencial. Al integrar plantillas específicas del nicho fitness, un editor intuitivo y una conexión nativa con el CRM y las automatizaciones de email, la Factory elimina las barreras técnicas y de diseño, convirtiendo la generación de leads en un proceso sistemático. El objetivo final es alimentar de forma constante el pipeline de ventas del entrenador con prospectos cualificados, estableciendo su autoridad y nutriendo la relación desde el primer momento.
## Flujo paso a paso de uso real
Un entrenador personal, llamémosle Alex, quiere captar más clientes para su programa online de 'Transformación de 90 días'.
1. **Acceso y Selección**: Alex inicia sesión en TrainerERP y navega a `Marketing > Lead Magnet Factory`. Ve su dashboard con estadísticas y un botón grande que dice 'Crear Nuevo Lead Magnet'.
2. **Elección de Plantilla**: Al hacer clic, se le presenta una galería de tipos de lead magnet. Alex elige 'Calculadora Interactiva' y, dentro de esta, la plantilla 'Calculadora de Macronutrientes Personalizada'.
3. **Personalización**: La interfaz de la calculadora se carga. Alex:
* Sube su logo para que aparezca en la parte superior.
* Ajusta los textos introductorios con su tono de voz, explicando la importancia de los macros.
* Revisa las fórmulas (Mifflin-St Jeor para TMB) y confirma que son correctas. Decide no modificarlas.
* Añade un descargo de responsabilidad legal al final.
4. **Configuración del Formulario**: En el siguiente paso, configura el formulario que el usuario deberá rellenar para obtener sus resultados:
* Campos por defecto: Nombre (requerido), Email (requerido).
* Añade un campo personalizado: una lista desplegable con la pregunta '¿Cuál es tu principal objetivo?' con opciones como 'Perder grasa', 'Ganar músculo', 'Mejorar rendimiento'.
5. **Acción Post-Captura**: Alex define qué sucederá después de que un usuario envíe el formulario:
* **Página de Agradecimiento**: Configura el mensaje que verá el usuario, que incluye sus macros calculados y un pequeño CTA (Call to Action) para seguirlo en Instagram.
* **Automatización**: Conecta este lead magnet a una automatización que ha creado previamente llamada 'Nutrición de Leads de Macros'. Esta automatización hará lo siguiente:
* Inmediatamente: Envía un email con los resultados de los macros en un formato PDF bonito.
* 2 días después: Envía un email con '3 errores comunes al contar macros'.
* 4 días después: Envía un email presentando su programa de 'Transformación de 90 días'.
6. **Publicación**: Alex hace clic en 'Publicar'. El sistema le proporciona:
* Un enlace directo (ej: `alexfitness.trainererp.com/macros-calculator`).
* Un código `<iframe>` para incrustarlo en su blog personal.
7. **Promoción y Análisis**: Alex comparte el enlace en su biografía de Instagram y en sus historias. Después de una semana, vuelve al dashboard de la Lead Magnet Factory y ve que 150 personas han usado la calculadora, de las cuales 120 han dejado su email (tasa de conversión del 80%). Ve que 3 de esos leads ya han comprado su programa, lo que le da un ROI claro de su esfuerzo.
## Riesgos operativos y edge cases
* **Precisión de las Calculadoras**: Las calculadoras de salud deben ser precisas. Un error en la fórmula podría dar información incorrecta a los usuarios. Se debe incluir un descargo de responsabilidad visible que indique que los resultados son una estimación y se debe consultar a un profesional.
* **Cumplimiento Legal (GDPR/CCPA)**: La captura de datos es un punto sensible. Los formularios deben tener un checkbox de consentimiento explícito (no pre-marcado) para recibir comunicaciones de marketing y un enlace claro a la política de privacidad del entrenador. El sistema debe registrar este consentimiento.
* **Gestión del Almacenamiento**: Si se permiten subidas de PDFs, los planes de suscripción de TrainerERP deben tener cuotas de almacenamiento claras para evitar abusos y costes imprevistos. Se necesitará un sistema de limpieza o archivado de assets no utilizados.
* **Fallo en la Entrega del Lead Magnet**: Si la automatización de email falla, el usuario no recibe su guía o sus resultados, creando una mala experiencia. Debe haber un sistema de reintentos y notificaciones al entrenador si un email crítico no se puede entregar.
* **Actualización de Contenido**: Si Alex actualiza su 'Guía de Nutrición', los nuevos leads recibirán la nueva versión. ¿Qué pasa con los antiguos? Se podría implementar un sistema de versionado, pero lo más simple es asumir que la descarga es un evento puntual. Si la actualización es crítica, se podría usar el CRM para enviar un email a todos los que descargaron la versión anterior.
## KPIs y qué significan
* **Total de Leads Generados**: El número bruto de contactos capturados. Es la medida principal del volumen y la salud del embudo.
* **Tasa de Conversión de la Página (leads / visitantes)**: Mide la efectividad de la oferta y la página de captura. Un 5-10% es bueno, un 20%+ es excelente. Si es baja, el entrenador debe revisar el título, el copy o la oferta en sí.
* **Tasa de Conversión a Cliente (clientes / leads)**: El KPI más importante para el negocio. Mide la calidad del lead y la efectividad del seguimiento. Permite a Alex saber que, por ejemplo, los leads de la 'Calculadora de Macros' convierten a cliente en un 8%, mientras que los de la 'Guía de Yoga' solo en un 2%, indicándole dónde enfocar sus esfuerzos.
* **Coste por Lead (CPL)**: (Requiere integración con módulo de anuncios). `Inversión en anuncios / Total de Leads Generados`. Esencial para evaluar la rentabilidad de las campañas de pago dirigidas a los lead magnets.
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant Usuario as Visitante Web
participant LandingPage as Landing Page/Formulario
participant TrainerERP_API as API Pública
participant TrainerERP_Backend as Backend
participant TrainerERP_Email as Sist. de Email
Usuario->>LandingPage: Visita la página de la Calculadora de Macros
Usuario->>LandingPage: Rellena el formulario (datos personales)
LandingPage->>TrainerERP_API: POST /api/public/leads con datos del formulario y magnetId
TrainerERP_API-->>TrainerERP_Backend: Valida y reenvía datos
TrainerERP_Backend->>TrainerERP_Backend: 1. Crea/actualiza registro del Lead
TrainerERP_Backend->>TrainerERP_Backend: 2. Asocia el Lead al leadMagnetId
TrainerERP_Backend->>TrainerERP_Backend: 3. Busca la automatización conectada
alt Automatización encontrada
TrainerERP_Backend->>TrainerERP_Email: Dispara el primer email de la secuencia (con los resultados)
TrainerERP_Email-->>Usuario: Envía el email
end
TrainerERP_Backend-->>TrainerERP_API: Responde {status: 'success'}
TrainerERP_API-->>LandingPage: Responde con éxito
LandingPage->>Usuario: Muestra la página de 'Gracias' con los resultados
