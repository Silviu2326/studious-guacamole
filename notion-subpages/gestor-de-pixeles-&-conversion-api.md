# Gestor de Píxeles & Conversion API

**Página padre:** Hola

---

# Gestor de Píxeles & Conversion API
👥 Tipo de Usuario: Entrenador Personal (Administrador), Administrador del Sistema
Esta funcionalidad está diseñada para el 'Entrenador Personal (Administrador)' o el rol de 'Administrador del Sistema' que gestiona activamente campañas de publicidad de pago. No es una pantalla para el uso diario ni para los clientes finales. Es una herramienta técnica que permite a los entrenadores con conocimientos de marketing digital maximizar el retorno de su inversión publicitaria, conectando su cuenta de TrainerERP directamente con plataformas como Meta (Facebook/Instagram), Google Ads o TikTok.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/pixels
## Descripción Funcional
El 'Gestor de Píxeles & Conversion API' es el centro de control de TrainerERP para el seguimiento de conversiones de alta precisión. En el competitivo mundo del fitness online, la publicidad de pago es clave para captar nuevos clientes, ya sea promocionando un reto de 21 días, una consulta gratuita o un plan de entrenamiento personalizado. Sin embargo, con las crecientes restricciones de privacidad (como las de iOS 14) y el uso de bloqueadores de anuncios, el seguimiento tradicional basado en cookies (píxeles del navegador) ha perdido hasta un 30-40% de su eficacia. Esta página soluciona ese problema permitiendo a los entrenadores implementar el seguimiento del lado del servidor a través de las APIs de conversión (C-API). En lugar de que el navegador del cliente envíe la información, es el servidor de TrainerERP el que comunica directamente a plataformas como Facebook o Google cuando ocurre una acción valiosa. Esto incluye eventos críticos para un entrenador: cuando un lead se registra para descargar una guía de nutrición ('Lead'), cuando un cliente potencial agenda una llamada de evaluación ('Schedule'), o, lo más importante, cuando un cliente compra un paquete de entrenamiento ('Purchase'). Este sistema no solo es más fiable, sino que también permite el seguimiento de eventos 'offline' o del backend que un píxel de navegador nunca podría ver, como la renovación automática de una suscripción mensual.
## Valor de Negocio
El valor de negocio de esta funcionalidad para un entrenador personal es inmenso y directo: optimizar cada euro invertido en publicidad. Un entrenador con un presupuesto limitado no puede permitirse malgastar dinero en anuncios que no generan clientes. Sin un seguimiento preciso, es imposible saber si la campaña de Instagram que promociona un 'Plan de Verano' realmente generó esas 3 nuevas suscripciones de 150€ al mes, o si vinieron de otro canal. El Gestor de Píxeles & Conversion API cierra esta brecha de atribución. Permite al entrenador ver con claridad cristalina qué anuncios, audiencias y creatividades están convirtiendo leads en clientes de pago. Al enviar datos de conversión fiables desde el servidor, se mejora la calidad de la optimización de los algoritmos de las plataformas publicitarias, lo que resulta en un menor coste por adquisición (CPA) y un mayor retorno de la inversión publicitaria (ROAS). Para un estudio de entrenamiento, esto significa poder escalar sus campañas con confianza, sabiendo que sus decisiones se basan en datos precisos y no en suposiciones. En resumen, transforma el gasto en publicidad de una apuesta a una inversión medible y optimizable para el crecimiento del negocio.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador que invierte en anuncios de Facebook, quiero conectar mi cuenta de Facebook Ads a TrainerERP para enviar eventos de conversión desde el servidor (server-side), de modo que pueda medir con precisión cuántos clientes de pago provienen de mis campañas.
- Como dueño de un estudio de fitness, quiero configurar un Píxel de TikTok y Google Ads para rastrear las inscripciones a mis clases de prueba que se originan en anuncios de video, para así optimizar mi gasto publicitario en múltiples plataformas.
- Como coach online, quiero ver un log de los eventos de conversión enviados (ej. 'Purchase', 'Lead', 'Schedule') y su estado de entrega, para poder depurar y verificar que mi tracking está funcionando correctamente.
- Como administrador de TrainerERP, quiero poder activar o desactivar fácilmente el envío de eventos para un píxel específico sin tener que eliminar la configuración completa, para poder pausar campañas o realizar pruebas A/B.
- Como entrenador que usa las landing pages de TrainerERP para captar leads, quiero que los eventos estándar como 'PageView' y 'ViewContent' se envíen automáticamente a mis píxeles configurados, sin necesidad de configuración manual para cada página que creo.
- Como profesional del marketing en un centro de fitness, quiero poder enviar datos enriquecidos del cliente (como email y teléfono hasheados) en los eventos de la API de conversiones para mejorar la Tasa de Coincidencia de Eventos (Event Match Quality) y la atribución.
## Acciones Clave
- Añadir una nueva configuración de Píxel/C-API seleccionando la plataforma (Meta, Google, TikTok).
- Introducir y validar las credenciales de la API (ID de Píxel, Token de Acceso) de forma segura.
- Mapear eventos internos de TrainerERP (ej: 'cliente.pago_exitoso') a eventos estándar de la plataforma publicitaria (ej: 'Purchase').
- Activar o desactivar el seguimiento para una configuración de píxel específica.
- Ver un registro detallado de los últimos eventos enviados, incluyendo la carga útil (payload), la hora y el estado de la respuesta de la API externa.
- Enviar un evento de prueba para verificar que la conexión con la plataforma publicitaria funciona correctamente.
- Editar la configuración de un píxel existente para actualizar el token de acceso o los eventos rastreados.
## 🧩 Componentes React Sugeridos
### 1. PixelManagerDashboard
Tipo: container | Componente principal que orquesta la página. Obtiene la lista de configuraciones de píxeles, gestiona el estado de los modales (añadir/editar) y pasa los datos a los componentes de presentación.
Estados: pixels: PixelConfig[], isLoading: boolean, error: string | null, isAddModalOpen: boolean
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
<PixelManagerDashboard />
```

### 2. PixelConfigCard
Tipo: presentational | Muestra la información de una única configuración de píxel (ej. Facebook). Incluye el logo de la plataforma, el ID, un interruptor para activar/desactivar, y botones para editar, ver logs o eliminar.
Props:
- config: 
- { platform: 'Meta' | 'Google' | 'TikTok', pixelId: string, isActive: boolean, lastEvent: { time: string, status: 'success' | 'failed' } } (requerido) - Objeto con la información de la configuración del píxel.
- onToggleStatus: 
- (id: string, newStatus: boolean) => void (requerido) - Función callback que se ejecuta al cambiar el interruptor de estado.
- onViewLogs: 
- (id: string) => void (requerido) - Función callback para abrir el visor de logs.
Dependencias: @headlessui/react (for Switch)
Ejemplo de uso:
```typescript
<PixelConfigCard config={pixelData} onToggleStatus={handleToggle} onViewLogs={handleViewLogs} />
```

### 3. AddPixelModal
Tipo: container | Modal con un formulario de varios pasos para añadir una nueva configuración de píxel. Gestiona la lógica del formulario, la validación y la llamada a la API.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onSuccess: 
- (newPixel: PixelConfig) => void (requerido) - Callback ejecutado tras añadir el píxel con éxito.
Estados: step: number, platform: string, pixelId: string, apiToken: string, trackedEvents: string[], isSubmitting: boolean
Dependencias: formik, yup
Ejemplo de uso:
```typescript
<AddPixelModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={refreshPixelList} />
```

### 4. usePixelConfigurations
Tipo: hook | Custom hook para abstraer la lógica de fetching, creación y actualización de las configuraciones de píxeles utilizando react-query.
Estados: Devuelve el estado de react-query: { data, isLoading, isError, error }, Provee mutaciones: { addPixel, updatePixelStatus }
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data: pixels, isLoading, addPixel } = usePixelConfigurations();
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/marketing/tracking-configs
Obtiene la lista de todas las configuraciones de píxeles y C-API para el entrenador autenticado.
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto representa una configuración de píxel.
```json
[
  {
    "id": "conf_12345",
    "platform": "Meta",
    "pixelId": "8765432109876",
    "isActive": true,
    "createdAt": "2023-10-27T10:00:00Z"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se ha proporcionado.

### 2. POST /api/v1/marketing/tracking-configs
Crea una nueva configuración de píxel y C-API. El token de la API se encripta antes de guardarse.
Parámetros:
- platform (
- string ('Meta', 'Google', 'TikTok'), body, requerido): La plataforma de publicidad.
- pixelId (
- string, body, requerido): El ID del Píxel o de seguimiento.
- apiAccessToken (
- string, body, requerido): El token de acceso para la API de Conversiones.
- trackedEvents (
- string[], body, opcional): Array de eventos a rastrear (ej: ['PURCHASE', 'LEAD']).
Respuesta:
Tipo: object
Estructura: El objeto de la configuración recién creada, sin el token.
```json
{
  "id": "conf_67890",
  "platform": "Meta",
  "pixelId": "8765432109876",
  "isActive": true,
  "createdAt": "2023-10-27T11:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos o los datos son inválidos.
- 409: 
- Conflict - Ya existe una configuración para esa plataforma y píxel.

### 3. PATCH /api/v1/marketing/tracking-configs/{configId}
Actualiza una configuración existente, como su estado (activo/inactivo) o el token.
Parámetros:
- configId (
- string, path, requerido): ID de la configuración a actualizar.
- isActive (
- boolean, body, opcional): Nuevo estado de la configuración.
- apiAccessToken (
- string, body, opcional): Nuevo token de acceso.
Respuesta:
Tipo: object
Estructura: El objeto de la configuración actualizada.
```json
{
  "id": "conf_12345",
  "platform": "Meta",
  "pixelId": "8765432109876",
  "isActive": false,
  "updatedAt": "2023-10-27T12:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna configuración con el ID proporcionado.

### 4. DELETE /api/v1/marketing/tracking-configs/{configId}
Elimina una configuración de píxel de forma permanente.
Parámetros:
- configId (
- string, path, requerido): ID de la configuración a eliminar.
Respuesta:
Tipo: object
Estructura: Respuesta vacía con código de estado 204 No Content.
```json
{}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna configuración con el ID proporcionado.

### 5. GET /api/v1/marketing/tracking-configs/{configId}/logs
Obtiene los logs de eventos recientes para una configuración de píxel específica.
Parámetros:
- configId (
- string, path, requerido): ID de la configuración para la cual obtener los logs.
- limit (
- integer, query, opcional): Número de logs a devolver (por defecto 50).
Respuesta:
Tipo: array
Estructura: Un array de objetos de log, ordenados por fecha descendente.
```json
[
  {
    "id": "log_abc",
    "timestamp": "2023-10-27T12:05:00Z",
    "eventName": "Purchase",
    "status": "success",
    "responseCode": 200
  },
  {
    "id": "log_def",
    "timestamp": "2023-10-27T12:04:00Z",
    "eventName": "Lead",
    "status": "failed",
    "responseCode": 400,
    "errorMessage": "Invalid event parameters"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna configuración con el ID proporcionado.
## Notas Técnicas
Colecciones backend: tracking_configurations: Almacena las configuraciones de los píxeles (plataforma, pixelId, apiToken encriptado, userId, isActive)., tracking_event_logs: Guarda un registro de los eventos enviados (configurationId, eventName, payload, status, response, timestamp)., event_queue: Una cola de mensajes (ej. RabbitMQ, SQS) para procesar el envío de eventos de forma asíncrona y con reintentos.
KPIs visibles: Total de eventos enviados (últimos 7 días), Tasa de éxito de envío (%), Desglose de eventos por tipo ('Purchase', 'Lead', 'Schedule'), Calidad de coincidencia de eventos (Event Match Quality) - Promedio (si la API lo provee, como Meta), Latencia promedio de envío de eventos (ms), Número de configuraciones de píxel activas
## Documentación Completa
## Resumen
El Gestor de Píxeles & Conversion API es una herramienta avanzada dentro de la suite de marketing de TrainerERP, diseñada para proporcionar a los entrenadores un seguimiento de conversiones robusto y fiable para sus campañas de publicidad. En la era post-cookie, donde el seguimiento del navegador es cada vez menos fiable debido a las políticas de privacidad (iOS 14+) y los bloqueadores de anuncios, la capacidad de medir el retorno de la inversión publicitaria (ROAS) se ve comprometida. Esta funcionalidad resuelve este problema implementando el seguimiento del lado del servidor (server-side tracking).
Funciona así: en lugar de depender del navegador de un cliente potencial para informar a Facebook o Google sobre una conversión, es el servidor de TrainerERP el que envía esta información directamente. Cuando un cliente completa una acción clave, como comprar un plan de entrenamiento, el backend de TrainerERP se comunica de forma segura y directa con la API de la plataforma publicitaria. Esto asegura que casi el 100% de las conversiones se registren, proporcionando datos precisos para optimizar las campañas, reducir el coste por cliente y escalar el negocio de entrenamiento con confianza.
## Flujo paso a paso de uso real
**Escenario:** Un entrenador personal, 'Carlos', quiere lanzar una campaña en Instagram para su 'Reto Fitness de 30 días' que cuesta 99€. Quiere asegurarse de que puede atribuir correctamente cada venta a sus anuncios.
1. **Obtener Credenciales:** Carlos va a su Facebook Business Manager. Navega a la sección 'Orígenes de datos' -> 'Píxeles'. Selecciona su píxel, va a la pestaña 'Configuración' y, en la sección 'API de conversiones', genera un 'Token de acceso'. Copia su 'ID del Píxel' y el nuevo 'Token de acceso'.
2. **Configuración en TrainerERP:** Carlos inicia sesión en TrainerERP y va a `Marketing > Gestor de Píxeles`. Hace clic en 'Añadir Nueva Configuración'.
3. **Selección de Plataforma:** Se le presenta una lista de plataformas. Elige 'Meta (Facebook/Instagram)'.
4. **Introducir Datos:** En el formulario, pega el 'ID del Píxel' y el 'Token de acceso' que obtuvo de Facebook.
5. **Mapeo de Eventos:** TrainerERP le muestra una lista de eventos de negocio clave. Carlos selecciona los que son importantes para él:
* `Lead`: Cuando alguien se registra en su landing page para recibir un 'PDF de 5 recetas saludables'.
* `InitiateCheckout`: Cuando alguien hace clic en el botón 'Comprar ahora' del reto, pero aún no ha pagado.
* `Purchase`: Cuando el pago de 99€ se procesa con éxito a través del módulo de pagos de TrainerERP.
6. **Guardar y Activar:** Carlos guarda la configuración. El sistema realiza una llamada de prueba para validar las credenciales. Al confirmarse, el estado del píxel aparece como 'Activo'.
7. **Operación Automática:** A partir de ahora, cada vez que un usuario realice una de esas acciones en TrainerERP, el sistema enviará automáticamente el evento correspondiente a la API de Conversiones de Facebook, junto con datos del usuario (hasheados para privacidad) para mejorar la atribución.
8. **Análisis:** Una semana después, Carlos puede entrar en su Facebook Ads Manager y ver exactamente cuántas compras de 99€ ha generado su campaña, permitiéndole calcular su ROAS y decidir si debe aumentar el presupuesto.
## Riesgos operativos y edge cases
* **Configuración Incorrecta:** Un ID de píxel o token de acceso incorrecto hará que todos los envíos de eventos fallen. La UI debe tener un botón de 'Probar Conexión' para validar las credenciales al momento de la configuración.
* **Doble Conteo:** Si el entrenador ya tiene el píxel de Facebook instalado manualmente en su web, podría contar los eventos dos veces (una desde el navegador, otra desde el servidor). Es crucial que TrainerERP genere y envíe un `event_id` único para cada evento, y que se eduque al usuario para que configure su píxel del navegador para enviar este mismo `event_id`. Esto permite a Facebook deduplicar los eventos.
* **Consentimiento de Privacidad (GDPR/CCPA):** El envío de datos personales (incluso hasheados) a terceros como Facebook requiere el consentimiento del usuario. TrainerERP debe integrarse con el sistema de banners de cookies/consentimiento. Si un usuario no da su consentimiento para el seguimiento, no se debe enviar ningún evento de C-API para él.
* **Retraso en la Atribución:** Los eventos del servidor pueden tener una pequeña demora en aparecer en los paneles de las plataformas publicitarias. Se debe informar al usuario que los datos pueden no ser en tiempo real.
## KPIs y qué significan
* **Total de eventos enviados:** Un indicador de volumen. Muestra cuántas acciones valiosas de los clientes se están rastreando. Un número bajo podría indicar un problema o baja actividad.
* **Tasa de éxito de envío (%):** El KPI de salud más importante. Un porcentaje inferior al 99% indica problemas con la API de la plataforma, credenciales incorrectas o datos de eventos malformados. Debe ser monitoreado de cerca.
* **Tasa de Coincidencia de Eventos (Event Match Quality - EMQ):** Específico de Meta. Mide qué tan bien Facebook puede vincular el evento enviado desde tu servidor a una cuenta de usuario de Facebook. Se mejora enviando más identificadores de cliente (email, teléfono, nombre, todos hasheados). Una EMQ alta (superior a 8.0/10) significa una atribución mucho más precisa y una mejor optimización de los anuncios.
* **Eventos por tipo ('Purchase', 'Lead'):** Permite al entrenador ver el desglose de su embudo de conversión. Por ejemplo, puede ver 100 eventos `Lead` pero solo 5 `Purchase`, lo que indica un posible problema en la etapa de conversión de su embudo.
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant C as Cliente
participant FE as TrainerERP Frontend
participant BE as TrainerERP Backend
participant EQ as Event Queue
participant EW as Event Worker
participant Meta as Meta C-API
C->>FE: Completa compra de un plan
FE->>BE: POST /api/payments/charge
BE->>BE: Procesa el pago
alt Pago Exitoso
BE-->>FE: 200 OK (Pago confirmado)
BE->>EQ: Enqueue('PURCHASE', { event_data })
end
EQ-->>EW: Consume evento 'PURCHASE'
EW->>Meta: POST /v18.0/{pixel_id}/events (con payload)
alt Envío Exitoso
Meta-->>EW: 200 OK
EW->>BE: Log Event (status: 'success')
else Envío Fallido
Meta-->>EW: 400 Bad Request
EW->>BE: Log Event (status: 'failed', error_msg)
EW->>EQ: Re-enqueue con backoff exponencial
end
