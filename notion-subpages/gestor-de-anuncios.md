# Gestor de Anuncios

**Página padre:** Hola

---

# Gestor de Anuncios
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' que gestiona el negocio y busca activamente su crecimiento. Los 'Entrenadores Asociados' podrían tener acceso de solo lectura para ver el rendimiento de las campañas que les afectan, pero sin la capacidad de crear o modificar presupuestos, según los permisos configurados por el administrador.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/anuncios
## Descripción Funcional
El Gestor de Anuncios de TrainerERP es un centro de control unificado y simplificado, diseñado para que los entrenadores personales puedan lanzar, gestionar y optimizar campañas publicitarias sin necesidad de ser expertos en marketing digital. A diferencia de las complejas interfaces nativas de Google Ads o Meta (Facebook/Instagram), nuestra plataforma traduce los objetivos de marketing en metas de negocio claras para un entrenador: 'Captar leads para entrenamiento 1-a-1', 'Promocionar un reto de 30 días' o 'Conseguir inscripciones para un webinar de nutrición'. El sistema permite conectar las cuentas publicitarias de las principales plataformas en pocos clics. Una vez conectadas, los entrenadores pueden crear campañas utilizando plantillas pre-diseñadas y audiencias sugeridas, específicamente pensadas para el nicho del fitness. Por ejemplo, plantillas con imágenes y textos probados para atraer clientes locales, o audiencias pre-segmentadas por intereses como 'fitness', 'levantamiento de pesas', 'yoga' y comportamientos como 'frecuenta gimnasios'. La verdadera potencia reside en su integración nativa con el resto de TrainerERP. Cada lead generado a través de un anuncio se captura automáticamente en el CRM, se etiqueta con la campaña de origen y puede iniciar un flujo de automatización, todo sin necesidad de herramientas externas. Esto permite un seguimiento del ROI (Retorno de la Inversión) real y preciso: desde el clic en el anuncio hasta la conversión en un cliente de pago recurrente.
## Valor de Negocio
El valor de negocio del Gestor de Anuncios para un entrenador personal es inmenso, ya que ataca directamente uno de sus mayores desafíos: la adquisición constante y predecible de nuevos clientes. Elimina la barrera técnica y la curva de aprendizaje asociadas con las plataformas publicitarias profesionales, democratizando el acceso a herramientas de crecimiento potentes. En lugar de pasar horas navegando por menús complejos, el entrenador puede lanzar una campaña de captación local en minutos, permitiéndole competir eficazmente con gimnasios y estudios más grandes. Al centralizar la gestión publicitaria dentro de TrainerERP, se cierra el círculo entre la inversión en marketing y los ingresos generados. El entrenador puede ver claramente: 'Invertí 100€ en esta campaña de Instagram y me generó 3 nuevos clientes con un valor de vida de 1.500€'. Esta visibilidad del ROAS (Retorno de la Inversión Publicitaria) es crucial para tomar decisiones de negocio informadas y escalar de manera sostenible. Además, al automatizar la creación de audiencias de retargeting (por ejemplo, personas que visitaron la página de precios pero no compraron), la plataforma maximiza el presupuesto publicitario, recuperando potenciales clientes que de otro modo se habrían perdido y aumentando significativamente las tasas de conversión.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear una campaña en Facebook para promocionar mi 'Reto de Verano de 6 semanas' dirigida a mujeres de 25-45 años en mi ciudad, para así llenar las plazas disponibles.
- Como propietario de un estudio de fitness, quiero ver un dashboard centralizado que me muestre el gasto total, el coste por lead (CPL) y el número de clientes nuevos que hemos conseguido a través de Google Ads este mes, para poder evaluar la rentabilidad de mi inversión publicitaria.
- Como coach online, quiero lanzar una campaña de retargeting en Instagram que muestre testimonios en video a las personas que visitaron mi landing page pero no agendaron una llamada de consultoría, para convencerles de dar el siguiente paso.
- Como entrenador que empieza, quiero usar una plantilla de anuncio ya hecha para una 'oferta de primera sesión de evaluación gratuita', para poder lanzar mi primera campaña rápidamente sin tener que diseñar nada.
- Como entrenador ocupado, quiero que el sistema me notifique si una campaña tiene un coste por lead por encima de 20€, para poder pausarla y revisar mi estrategia sin malgastar mi presupuesto.
## Acciones Clave
- Conectar y autenticar cuentas de publicidad (Meta Ads, Google Ads).
- Crear una nueva campaña publicitaria a través de un asistente guiado (Wizard).
- Visualizar el rendimiento agregado y detallado de todas las campañas en un único dashboard.
- Editar los parámetros de una campaña activa (presupuesto, estado, segmentación básica).
- Instalar y verificar el píxel de seguimiento de TrainerERP en las landing pages y formularios.
- Crear audiencias personalizadas basadas en la actividad de los clientes en TrainerERP (ej: 'Clientes que abandonaron el carrito').
## 🧩 Componentes React Sugeridos
### 1. CampaignsDashboardContainer
Tipo: container | Componente principal que orquesta la vista del Gestor de Anuncios. Gestiona el estado global, como el rango de fechas seleccionado, y realiza las llamadas a la API para obtener la lista de campañas y sus métricas de rendimiento.
Estados: campaigns: Campaign[], performanceMetrics: Metrics[], dateRange: { start: Date, end: Date }, isLoading: boolean, error: string | null
Dependencias: react-query, date-fns
Ejemplo de uso:
```typescript
<CampaignsDashboardContainer />
```

### 2. CampaignCreatorWizard
Tipo: container | Un asistente multi-paso que guía al usuario a través de la creación de una nueva campaña publicitaria. Maneja la lógica de estado de cada paso y realiza la llamada a la API POST al finalizar.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal del wizard.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
Estados: currentStep: number, campaignData: Partial<Campaign>, isSubmitting: boolean
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<CampaignCreatorWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
```

### 3. PerformanceMetricsGrid
Tipo: presentational | Muestra una cuadrícula de tarjetas (KPI_Card) con las métricas clave de rendimiento para un período seleccionado. No contiene lógica de obtención de datos.
Props:
- metrics: 
- { cpl: number, roas: number, ctr: number, spend: number, conversions: number } (requerido) - Objeto con los datos de rendimiento a mostrar.
- isLoading: 
- boolean (opcional) - Muestra esqueletos de carga si los datos se están cargando.
Ejemplo de uso:
```typescript
<PerformanceMetricsGrid metrics={dashboardData.summaryMetrics} isLoading={isLoading} />
```

### 4. useAdAccounts
Tipo: hook | Hook personalizado para gestionar la lógica de conexión y obtención de las cuentas publicitarias del usuario. Abstrae las llamadas a la API relacionadas con las cuentas.
Estados: Devuelve un objeto de react-query con { data: adAccounts, isLoading, error, ... }
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data: accounts, isLoading } = useAdAccounts();
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/ads/campaigns
Obtiene una lista de todas las campañas publicitarias asociadas a la cuenta del entrenador, con filtros opcionales.
Parámetros:
- platform (
- string, query, opcional): Filtra campañas por plataforma (ej: 'meta', 'google').
- status (
- string, query, opcional): Filtra campañas por estado (ej: 'active', 'paused').
Respuesta:
Tipo: array
Estructura: Un array de objetos de campaña, cada uno con id, name, status, platform, y métricas de rendimiento resumidas.
```json
[
  {
    "id": "camp_abc123",
    "name": "Campaña Leads Locales - Enero",
    "platform": "meta",
    "status": "active",
    "summary": {
      "spend": 150.75,
      "cpl": 12.56,
      "conversions": 12
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de sesión del usuario no es válido o ha expirado.

### 2. POST /api/v1/ads/campaigns
Crea una nueva campaña publicitaria en la plataforma especificada a través de la API correspondiente. Este endpoint abstrae la complejidad de la creación en cada plataforma.
Parámetros:
- campaignDetails (
- object, body, requerido): Objeto que contiene todos los detalles de la campaña a crear.
Respuesta:
Tipo: object
Estructura: El objeto de la campaña recién creada en nuestro sistema, incluyendo su ID interno y el ID externo de la plataforma.
```json
{
  "id": "camp_xyz789",
  "externalId": "1234567890123",
  "name": "Reto de Verano 2024",
  "platform": "meta",
  "status": "pending_review",
  "message": "Campaign created successfully and is under review by Meta."
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos en el body (ej: presupuesto, objetivo) o tienen un formato incorrecto.
- 422: 
- Unprocessable Entity - Error al crear la campaña en la plataforma externa (ej: presupuesto demasiado bajo, audiencia inválida, rechazo de la API de Meta/Google).

### 3. PATCH /api/v1/ads/campaigns/{id}
Actualiza el estado o el presupuesto de una campaña existente.
Parámetros:
- id (
- string, path, requerido): El ID interno de la campaña en TrainerERP.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar (ej: { status: 'paused' } o { dailyBudget: 50 }).
Respuesta:
Tipo: object
Estructura: El objeto de la campaña actualizado.
```json
{
  "id": "camp_abc123",
  "name": "Campaña Leads Locales - Enero",
  "status": "paused",
  "dailyBudget": 20
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna campaña con el ID proporcionado.
- 403: 
- Forbidden - El usuario no tiene permisos para modificar esta campaña.

### 4. GET /api/v1/ads/performance
Obtiene datos de rendimiento agregados para todas las campañas o una campaña específica en un rango de fechas.
Parámetros:
- startDate (
- string, query, requerido): Fecha de inicio en formato ISO (YYYY-MM-DD).
- endDate (
- string, query, requerido): Fecha de fin en formato ISO (YYYY-MM-DD).
- campaignId (
- string, query, opcional): ID de campaña opcional para obtener datos de una sola campaña.
Respuesta:
Tipo: object
Estructura: Un objeto con métricas agregadas y un desglose por día.
```json
{
  "total": {
    "spend": 1200.5,
    "conversions": 85,
    "cpl": 14.12,
    "clicks": 1523,
    "ctr": "2.15%"
  },
  "dailyBreakdown": [
    {
      "date": "2023-10-26",
      "spend": 75.1,
      "conversions": 5
    },
    {
      "date": "2023-10-27",
      "spend": 80.2,
      "conversions": 7
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Las fechas proporcionadas son inválidas o el rango es demasiado grande.

### 5. GET /api/v1/ads/accounts/connect/{platform}
Inicia el flujo de autenticación OAuth para conectar una cuenta de publicidad de una plataforma externa (Meta o Google). Redirige al usuario a la página de consentimiento de la plataforma.
Parámetros:
- platform (
- string, path, requerido): La plataforma a conectar ('meta' o 'google').
Respuesta:
Tipo: object
Estructura: Una respuesta de redirección (302) a la URL de OAuth de la plataforma.
```json
{
  "redirectUrl": "https://www.facebook.com/v18.0/dialog/oauth?client_id=..."
}
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Error al generar la URL de autenticación debido a una configuración incorrecta del servidor (client_id, secret).
## Notas Técnicas
Colecciones backend: ad_accounts, ad_campaigns, ad_sets, ads, ad_performance_snapshots, audiences, pixels
KPIs visibles: Gasto Total, Coste por Lead (CPL), Retorno de la Inversión Publicitaria (ROAS), Número de Conversiones (Leads/Clientes), Tasa de Clics (CTR), Coste por Clic (CPC), Impresiones
## Documentación Completa
## Resumen
El **Gestor de Anuncios** es un módulo estratégico dentro de **TrainerERP**, diseñado para empoderar a los entrenadores personales en la captación activa de clientes a través de publicidad digital. Su propósito fundamental es simplificar y centralizar la creación, gestión y análisis de campañas en plataformas complejas como Meta (Facebook & Instagram) y Google Ads. El módulo abstrae la jerga técnica y los flujos de trabajo complicados, traduciéndolos en objetivos de negocio tangibles para el entrenador, como "Conseguir más leads" o "Promocionar un nuevo programa".
La principal propuesta de valor es la **integración vertical** con el ecosistema de TrainerERP. A diferencia de usar las plataformas publicitarias de forma aislada, nuestro gestor conecta directamente el gasto publicitario con los resultados de negocio. Un lead generado por un anuncio no es solo una fila en una hoja de cálculo; es un contacto que entra automáticamente en el CRM de TrainerERP, se etiqueta con la fuente de la campaña y puede activar secuencias de email/SMS marketing, todo en un flujo ininterrumpido. Esto proporciona una visión 360º del viaje del cliente y un cálculo preciso del Retorno de la Inversión (ROAS), un indicador que la mayoría de los entrenadores no puede medir fácilmente.
Ofrecemos plantillas de campañas probadas, audiencias pre-configuradas para el nicho de fitness y un asistente de creación guiado, lo que reduce drásticamente el tiempo y el conocimiento necesarios para lanzar campañas efectivas.
---
## Flujo paso a paso de uso real
**Escenario:** Ana, una entrenadora personal, quiere captar 10 nuevos clientes para su programa de entrenamiento 1-a-1 en su ciudad, Madrid.
1. **Conexión de Cuentas:** Ana accede por primera vez a la sección `Marketing > Anuncios`. Se le presenta una pantalla de bienvenida que la invita a conectar sus cuentas publicitarias. Hace clic en "Conectar cuenta de Meta". Es redirigida a Facebook, donde autoriza a TrainerERP a gestionar sus campañas. Selecciona su cuenta publicitaria y página de negocio. El proceso dura menos de 2 minutos. La cuenta de Meta ahora aparece como "Conectada" en el dashboard.
2. **Creación de Campaña:** Ana hace clic en "Crear nueva campaña". Se abre un asistente:
* **Paso 1 (Objetivo):** El sistema le pregunta, "¿Qué quieres conseguir?". Las opciones son: "Recibir mensajes de potenciales clientes", "Que la gente rellene un formulario (Captar Leads)", "Promocionar mi página web". Ana elige "Captar Leads".
* **Paso 2 (Audiencia):** Ana define a quién quiere llegar. En la sección de ubicación, escribe "Madrid" y selecciona un radio de 15km. En demografía, elige "Mujeres" de "28 a 45 años". En intereses, TrainerERP le sugiere etiquetas como "Fitness y Bienestar", "Gimnasios", "Comida saludable". También ve una opción para crear una audiencia de "Retargeting", pero la ignora por ahora.
* **Paso 3 (Presupuesto y Duración):** Ana decide invertir 10€ al día y quiere que la campaña dure 30 días. El sistema le muestra un gasto total estimado de 300€.
* **Paso 4 (Anuncio):** TrainerERP le ofrece plantillas de creatividades. Elige una llamada "Testimonio de cliente". Sube una foto de una clienta satisfecha y utiliza el generador de texto con IA de TrainerERP para escribir el copy. El sistema le sugiere: "¿Cansada de no ver resultados en el gimnasio? Descubre cómo mi clienta Marta transformó su cuerpo en 3 meses. ¡Tu primera consulta es gratis! Rellena el formulario.". El formulario al que se enlaza es uno creado dentro de TrainerERP.
3. **Lanzamiento y Seguimiento:** Ana revisa el resumen de su campaña y hace clic en "Lanzar". La campaña se envía a Meta para su revisión. Unas horas después, aparece como "Activa" en su dashboard de TrainerERP.
4. **Análisis de Resultados:** Durante las siguientes semanas, Ana visita su dashboard de anuncios. Ve en tiempo real cuántas impresiones, clics y, lo más importante, cuántos formularios se han completado. Ve que lleva gastados 150€ y ha conseguido 12 leads, lo que le da un Coste por Lead (CPL) de 12.50€. En su CRM, ve a esos 12 nuevos leads etiquetados como "Lead - Campaña Madrid Enero". De esos 12, 5 ya se han convertido en clientes de pago. Puede calcular fácilmente su ROAS directamente en la plataforma.
---
## Riesgos operativos y edge cases
* **Sincronización de datos:** Puede haber un retraso o discrepancia entre las métricas mostradas en TrainerERP y las plataformas nativas. Debemos ser transparentes sobre la frecuencia de actualización (ej: cada hora) y los posibles motivos de diferencias (modelos de atribución).
* **Rechazo de anuncios:** Un anuncio puede ser rechazado por Meta/Google por incumplir sus políticas. Nuestro sistema debe capturar este estado, notificar al usuario de forma clara y, si es posible, ofrecer sugerencias para solucionarlo.
* **Gestión de tokens de API:** Los tokens de autenticación expiran. Es crítico tener un sistema robusto para refrescarlos automáticamente y un flujo de usuario claro para volver a autenticarse si el refresco falla, para evitar que las campañas dejen de reportar datos.
* **Gasto descontrolado:** Un error en la configuración del presupuesto en nuestra API podría llevar a un gasto excesivo. Se deben implementar múltiples salvaguardas y validaciones tanto en el frontend como en el backend al establecer y modificar presupuestos.
* **Complejidad de la audiencia:** Las opciones de segmentación de Meta/Google son extremadamente complejas. Nuestra simplificación debe ser potente pero no limitante. Un caso de borde es un usuario avanzado que quiere usar una audiencia personalizada muy específica que nuestra UI simplificada no permite crear.
---
## KPIs y qué significan
* **Gasto Total:** La cantidad total de dinero invertido en publicidad en el período seleccionado. Es la base para calcular la rentabilidad.
* **Coste por Lead (CPL):** (Gasto Total / Número de Leads). Este es el KPI más importante para campañas de captación. Le dice al entrenador exactamente cuánto le cuesta adquirir un cliente potencial. Un CPL bajo es bueno. Debe compararse con el valor que aporta un nuevo cliente.
* **Retorno de la Inversión Publicitaria (ROAS):** (Ingresos generados por los anuncios / Gasto Total). Mide cuántos euros de ingresos se generan por cada euro invertido. Un ROAS de 5:1 significa que por cada euro gastado, se generaron 5 euros en ventas. Es la medida definitiva del éxito de la campaña.
* **Número de Conversiones (Leads):** El número absoluto de personas que realizaron la acción deseada (ej: rellenar un formulario). Es el resultado directo de la campaña.
* **Tasa de Clics (CTR):** (Clics / Impresiones) * 100. Indica qué porcentaje de personas que vieron el anuncio hicieron clic en él. Un CTR alto sugiere que el anuncio es relevante y atractivo para la audiencia.
* **Coste por Clic (CPC):** (Gasto Total / Número de Clics). Cuánto cuesta cada clic en el anuncio. Es útil para evaluar la eficiencia del targeting y la creatividad del anuncio.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Creación de Campaña:**
mermaid
graph TD
A[Usuario hace clic en 'Crear Campaña'] --> B{Asistente de Campaña};
B --> C[Paso 1: Elegir Objetivo];
C --> D[Paso 2: Definir Audiencia y Ubicación];
D --> E[Paso 3: Establecer Presupuesto y Duración];
E --> F[Paso 4: Crear Anuncio (Creatividad + Texto)];
F --> G[Paso 5: Resumen y Confirmación];
G --> H{Lanzar Campaña};
H --> I[POST /api/v1/ads/campaigns];
I --> J[API Externa (Meta/Google)];
J --> K[Campaña en Revisión];
K --> L[Campaña Activa en Dashboard];
