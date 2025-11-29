# Marketing de Referidos

**Página padre:** Hola

---

# Marketing de Referidos
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' y 'Entrenador Asociado', quienes son responsables de la estrategia de crecimiento y monetización del negocio. Ellos pueden crear, gestionar y analizar campañas de referidos. El rol 'Cliente' interactuará con el resultado de estas campañas (recibiendo y compartiendo sus códigos/links únicos a través de su portal de cliente), pero no tendrá acceso a este panel de configuración.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/monetizacion/referidos
## Descripción Funcional
La página de 'Marketing de Referidos' es un centro de control completo diseñado para que los entrenadores personales transformen a su base de clientes actual en un motor de crecimiento orgánico y de bajo costo. Más allá de un simple generador de enlaces, esta herramienta permite la creación de campañas de referidos sofisticadas y personalizadas, adaptadas a los ciclos del negocio del fitness, como 'Reto de Verano' o 'Propósitos de Año Nuevo'. El entrenador puede definir con precisión los incentivos para ambas partes: el cliente que refiere (el referente) y el nuevo cliente (el referido). Las recompensas son flexibles, pudiendo ser desde sesiones de entrenamiento gratuitas, descuentos porcentuales en la siguiente mensualidad, acceso a contenido premium exclusivo, o incluso productos de merchandising. El sistema automatiza todo el ciclo de vida del referido: desde la generación de un enlace y código único para cada cliente, el seguimiento de clics y registros, hasta la validación de la conversión (cuando el referido se convierte en un cliente de pago). Una vez confirmada la conversión, el sistema aplica automáticamente las recompensas prometidas, eliminando la carga administrativa para el entrenador y garantizando una experiencia fluida y gratificante para los clientes. Esta página es fundamental para escalar el negocio de un entrenador personal de manera sostenible.
## Valor de Negocio
El valor de negocio de la funcionalidad de Marketing de Referidos para TrainerERP es inmenso y multifacético, atacando directamente los principales desafíos de crecimiento de un entrenador personal. En primer lugar, reduce drásticamente el Costo de Adquisición de Clientes (CAC). El marketing de boca a boca es inherentemente más económico y efectivo que la publicidad pagada, permitiendo al entrenador reinvertir su presupuesto en otras áreas. En segundo lugar, aumenta significativamente el Valor de Vida del Cliente (LTV). Los clientes referidos tienden a ser de mayor calidad y presentan tasas de retención más altas, ya que llegan con una confianza preestablecida a través de su amigo o familiar. Además, el propio acto de referir fortalece la lealtad del cliente existente, haciéndolo sentir un embajador de la marca. Esta herramienta convierte la base de clientes pasiva en una fuerza de ventas activa y automatizada, creando un círculo virtuoso de crecimiento. Para los estudios con varios entrenadores, permite identificar qué clientes son los más influyentes y recompensarlos, fomentando una comunidad fuerte y comprometida que impulsa el crecimiento del negocio de forma orgánica y escalable.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear una campaña de referidos estacional ('Operación Bikini') para que mis clientes inviten a sus amigos y ambos reciban 2 sesiones grupales gratis, y así poder llenar mis clases de verano.
- Como entrenador online, quiero que el sistema genere automáticamente un enlace único para cada uno de mis clientes, para que puedan compartirlo fácilmente en sus historias de Instagram o grupos de WhatsApp.
- Como dueño de un estudio de fitness, quiero acceder a un dashboard que me muestre en tiempo real cuántos referidos ha traído cada cliente y cuántos de ellos han contratado un plan, para identificar y premiar a mis 'Top Embajadores'.
- Como coach de grupos pequeños, quiero configurar recompensas automáticas para que, cuando un referido pague su primera cuota, el sistema aplique inmediatamente un 25% de descuento en la próxima factura de mi cliente referente, sin que yo tenga que intervenir.
- Como entrenador personal independiente, quiero poder personalizar el mensaje de texto predeterminado que mis clientes pueden enviar a sus amigos, incluyendo mi logo y un tono motivacional que vaya con mi marca.
- Como administrador, quiero poder definir reglas de campaña, como un número máximo de recompensas por cliente o una fecha de vencimiento para la oferta, para crear un sentido de urgencia y controlar los costos del programa.
## Acciones Clave
- Crear una nueva campaña de referidos con un asistente paso a paso.
- Definir recompensas duales (para referente y referido) basadas en descuentos, sesiones gratis o acceso a contenido.
- Monitorear el rendimiento de las campañas activas a través de un dashboard con KPIs clave.
- Visualizar un ranking de los clientes más influyentes ('Leaderboard de Embajadores').
- Personalizar los materiales de marketing para compartir (links, códigos QR, plantillas de mensajes).
- Pausar, archivar o duplicar una campaña existente para reutilizarla en el futuro.
## 🧩 Componentes React Sugeridos
### 1. CampaignWizard
Tipo: container | Un componente de formulario multi-paso que guía al entrenador a través de la creación o edición de una campaña de referidos. Maneja la lógica de estado para todos los campos de la campaña.
Props:
- onSubmit: 
- function (requerido) - Función a ejecutar cuando el formulario se envía con éxito. Recibe el objeto de la campaña como argumento.
- initialCampaignData: 
- Campaign (opcional) - Datos de una campaña existente para poblar el formulario en modo de edición.
Estados: currentStep, campaignName, campaignDuration, referrerRewardType, referrerRewardValue, referredRewardType, referredRewardValue, termsAndConditions
Dependencias: formik, yup, date-fns
Ejemplo de uso:
```typescript
<CampaignWizard onSubmit={handleCreateCampaign} />
```

### 2. ReferralStatsDashboard
Tipo: container | El componente principal de la página que obtiene y muestra los KPIs clave del programa de referidos. Utiliza hooks para obtener los datos de la API.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para filtrar las estadísticas.
Estados: statsData, isLoading, error, timeRangeFilter ('7d', '30d', '90d')
Dependencias: axios, recharts
Ejemplo de uso:
```typescript
<ReferralStatsDashboard trainerId={currentUser.id} />
```

### 3. CampaignStatusCard
Tipo: presentational | Una tarjeta visual que muestra un resumen de una campaña de referidos individual, incluyendo su estado (activa, pausada, finalizada), conversiones y un botón de acciones.
Props:
- campaign: 
- object (requerido) - Objeto con los datos de la campaña (nombre, estado, totalReferidos, totalConversiones).
- onViewDetails: 
- function (requerido) - Callback que se ejecuta al hacer clic para ver los detalles de la campaña.
- onToggleStatus: 
- function (requerido) - Callback para pausar o reactivar la campaña.
Ejemplo de uso:
```typescript
<CampaignStatusCard campaign={campaignData} onViewDetails={() => openDetails(campaignData.id)} onToggleStatus={() => toggleCampaign(campaignData.id)} />
```

### 4. useReferralApi
Tipo: hook | Un hook personalizado que encapsula la lógica de las llamadas a la API de referidos (crear, leer, actualizar campañas y obtener estadísticas), manejando el estado de carga y errores.
Estados: data, loading, error
Dependencias: axios
Ejemplo de uso:
```typescript
const { data: campaigns, loading, createCampaign } = useReferralApi();
```
## 🔌 APIs Requeridas
### 1. POST /api/v1/referral/campaigns
Crea una nueva campaña de marketing de referidos para el entrenador autenticado.
Parámetros:
- campaignData (
- object, body, requerido): Objeto que contiene todos los detalles de la nueva campaña.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la campaña recién creada, incluyendo su ID único.
```json
{
  "id": "camp_12345",
  "name": "Reto de Enero",
  "status": "active",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "referrerReward": {
    "type": "free_sessions",
    "value": 2
  },
  "referredReward": {
    "type": "percentage_discount",
    "value": 20
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos de la campaña incompletos o inválidos (ej. fecha de fin anterior a la de inicio).
- 403: 
- Forbidden - El usuario no tiene permisos para crear campañas.

### 2. GET /api/v1/referral/campaigns
Obtiene una lista de todas las campañas de referidos del entrenador.
Parámetros:
- status (
- string, query, opcional): Filtra las campañas por estado ('active', 'paused', 'archived').
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto es una campaña.
```json
[
  {
    "id": "camp_12345",
    "name": "Reto de Enero",
    "status": "active",
    "stats": {
      "referrals": 50,
      "conversions": 12
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Error al consultar la base de datos.

### 3. PUT /api/v1/referral/campaigns/{campaignId}
Actualiza una campaña de referidos existente (ej. para pausarla o cambiar sus términos).
Parámetros:
- campaignId (
- string, path, requerido): El ID único de la campaña a actualizar.
- updateData (
- object, body, requerido): Un objeto con los campos a actualizar.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la campaña actualizado.
```json
{
  "id": "camp_12345",
  "name": "Reto de Enero",
  "status": "paused",
  "...": "..."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna campaña con el ID proporcionado.
- 400: 
- Bad Request - Los datos de actualización son inválidos.

### 4. GET /api/v1/referral/stats
Obtiene las estadísticas agregadas de todo el programa de referidos.
Parámetros:
- range (
- string, query, opcional): El rango de tiempo para las estadísticas ('last7days', 'last30days', 'allTime').
Respuesta:
Tipo: object
Estructura: Un objeto con los KPIs clave del programa.
```json
{
  "totalRevenueFromReferrals": 5400.5,
  "totalConversions": 45,
  "conversionRate": 0.15,
  "topReferrers": [
    {
      "clientId": "cli_abc",
      "name": "Laura Gómez",
      "conversions": 5
    },
    {
      "clientId": "cli_def",
      "name": "Carlos Ruiz",
      "conversions": 3
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 500: 
- Internal Server Error - Error durante el cálculo de las estadísticas.
## Notas Técnicas
Colecciones backend: referral_campaigns, referrals, users, rewards_log, subscriptions
KPIs visibles: Tasa de Participación de Clientes (Clientes activos que comparten / Total clientes activos), Tasa de Conversión de Referidos (Referidos convertidos a pago / Clics en enlaces de referido), Ingresos Generados por Referidos, Costo de Adquisición por Referido (Valor total de recompensas / Nuevos clientes de referidos), Top 5 Clientes Referentes (por número de conversiones), Ciclo de Conversión Promedio (días desde el clic hasta el pago)
## Documentación Completa
## Resumen
El módulo de **Marketing de Referidos** es una herramienta estratégica dentro del área de **MONETIZACIÓN & OFERTAS** de TrainerERP. Su objetivo principal es empoderar a los entrenadores personales para que aprovechen su activo más valioso —sus clientes satisfechos— y los conviertan en una fuerza de marketing escalable. Este sistema permite la creación, gestión y análisis de campañas de referidos "trae un amigo", automatizando todo el proceso desde la generación de enlaces únicos hasta la aplicación de recompensas. Al reducir el costo de adquisición de clientes y aumentar la lealtad de la base existente, este módulo impacta directamente en la rentabilidad y el crecimiento sostenible del negocio de un entrenador.
## Flujo paso a paso de uso real
1. **Creación de la Campaña:** Un entrenador, llamémosle Álex, decide lanzar una campaña para el verano. Entra en `TrainerERP > Monetización > Referidos` y hace clic en "Nueva Campaña".
2. **Configuración:** El asistente le guía:
* **Nombre:** "Operación Verano Fit".
* **Duración:** Del 1 de junio al 31 de julio.
* **Recompensa para el Referente:** Álex elige "2 Sesiones Adicionales Gratuitas" para el cliente que refiere.
* **Recompensa para el Referido:** Álex configura un "20% de descuento en el primer mes" para el amigo que se inscribe.
* **Términos:** Especifica que la recompensa se aplica solo cuando el referido contrata un plan mensual (no un paquete de sesiones sueltas).
3. **Lanzamiento:** Álex lanza la campaña. El sistema automáticamente realiza dos acciones: (A) Envía una notificación por email y a través de la app a todos sus clientes activos, anunciando el programa. (B) Genera un enlace y un código QR únicos para cada cliente, visibles en su portal personal.
4. **Compartir:** Una clienta, Sofía, ve la notificación. Entra en su app de TrainerERP, copia su enlace y lo comparte en su grupo de WhatsApp de amigas.
5. **Conversión:** Su amiga, Elena, hace clic en el enlace. Es dirigida a una landing page de Álex (también gestionada por TrainerERP) con el descuento del 20% ya precargado. Elena se registra y contrata el plan mensual.
6. **Automatización de Recompensas:** El sistema detecta la conversión a través del código de seguimiento en el enlace de Sofía.
* Automáticamente, aplica un crédito de 2 sesiones a la cuenta de Sofía.
* Aplica el descuento del 20% a la primera factura de Elena.
* Notifica a Sofía por email: "¡Genial! Tu amiga Elena se ha unido. Hemos añadido 2 sesiones gratis a tu cuenta."
7. **Análisis:** Álex revisa su dashboard de referidos. Ve que la campaña "Operación Verano Fit" ha generado 5 nuevos clientes en su primera semana. También observa que Sofía es su mejor "embajadora" hasta la fecha.
## Riesgos operativos y edge cases
* **Auto-Referencia:** Un usuario podría intentar registrarse con un nuevo email usando su propio código.
* **Mitigación:** Implementar comprobaciones básicas como la coincidencia de IP o el seguimiento de cookies. Marcar las auto-referencias para revisión manual.
* **Abuso de Recompensas:** En campañas con recompensas de alto valor, podría haber intentos de fraude con tarjetas de crédito robadas o cuentas falsas.
* **Mitigación:** Implementar un período de carencia o 'clawback' (ej. 30 días). La recompensa para el referente solo se libera después de que el pago del referido haya superado el período de disputas.
* **Confusión en la Atribución:** Un cliente potencial hace clic en el enlace de dos amigos diferentes antes de registrarse.
* **Mitigación:** Aplicar una política de atribución clara, como "último clic". El referente cuyo enlace fue el último en ser utilizado antes del registro obtiene la recompensa. Esto debe estar claro en los términos y condiciones.
* **Recompensas Acumuladas:** ¿Qué sucede si el referido también tiene un cupón de descuento de otra fuente?
* **Mitigación:** El sistema de promociones debe tener una jerarquía. Por defecto, las ofertas de referidos no deberían ser acumulables con otras promociones, a menos que el entrenador lo configure explícitamente.
## KPIs y qué significan
* **Tasa de Participación:** (Clientes que comparten su link / Clientes totales). Mide si la campaña y sus incentivos son lo suficientemente atractivos para que los clientes actúen. Una tasa baja puede indicar que las recompensas no son motivadoras.
* **Tasa de Conversión de Referidos:** (Nuevos clientes de pago / Clics en links). Es el KPI de efectividad más importante. Muestra cuán persuasiva es la oferta para los nuevos clientes potenciales. Una tasa alta significa que el mensaje y el descuento resuenan bien.
* **Ingresos Generados por Referidos:** Suma total de los ingresos de los clientes que llegaron a través del programa. Permite calcular el ROI directo de la funcionalidad.
* **Costo de Adquisición por Referido (CAC):** (Valor total de las recompensas otorgadas / Nº de nuevos clientes). Este número debe ser significativamente más bajo que el CAC de otros canales (ej. anuncios de Facebook) para que el programa sea exitoso.
* **Viralidad (K-factor):** (Nº de invitaciones enviadas por cada cliente * Tasa de conversión). Un K-factor > 1 indica crecimiento exponencial. Aunque es difícil de medir con precisión, es el objetivo final de un programa de referidos maduro.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Entrenador crea Campaña de Referidos] --> B(Sistema genera links únicos para Clientes);
B --> C{Cliente A comparte su link};
C --> D[Amigo B hace clic en el link];
D --> E{Amigo B se registra y compra un plan};
E -- Sí --> F[Sistema valida la conversión];
E -- No --> G[Referido queda como pendiente];
F --> H[Aplica recompensa al Cliente A];
F --> I[Aplica recompensa al Amigo B];
H --> J[Notifica al Cliente A];
I --> K[Entrenador ve la conversión en el Dashboard];
