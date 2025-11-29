# SMS/Email Preference Center

**Página padre:** Hola

---

# SMS/Email Preference Center
👥 Tipo de Usuario: Cliente, Entrenador Personal (Administrador)
Principalmente para el 'Cliente' final del entrenador. Esta página es accedida a través de un enlace seguro y único (tokenizado) enviado por email o SMS. El cliente puede gestionar directamente sus preferencias sin necesidad de iniciar sesión. El 'Entrenador Personal (Administrador)' tiene acceso de solo lectura a las preferencias de sus clientes desde el perfil de cada uno para entender mejor sus necesidades y respetar sus deseos, pero no puede modificarlas para garantizar el cumplimiento legal.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /client/preferences/communication
## Descripción Funcional
El 'SMS/Email Preference Center' es una herramienta fundamental dentro de TrainerERP, diseñada para fortalecer la relación entre el entrenador y sus clientes mientras se asegura un estricto cumplimiento de las normativas de privacidad globales como GDPR y CCPA. Esta página centralizada permite a los clientes de un entrenador personal tener control granular sobre las comunicaciones que reciben. En lugar de una simple opción de 'suscribir/desuscribir', el cliente puede personalizar su experiencia eligiendo qué tipo de contenido desea recibir. Las categorías están específicamente adaptadas al nicho del fitness, incluyendo 'Recordatorios de Sesiones', 'Actualizaciones del Plan de Entrenamiento', 'Consejos Semanales de Nutrición', 'Mensajes Motivacionales Diarios', y 'Ofertas Especiales en Programas y Retos'. Para cada una de estas categorías, el cliente puede seleccionar su canal preferido (Email o SMS/WhatsApp) y, en algunos casos, la frecuencia (diaria, semanal). Esto no solo respeta la bandeja de entrada del cliente, sino que también aumenta drásticamente la efectividad de la comunicación del entrenador, ya que cada mensaje enviado es un mensaje deseado. La interfaz es limpia, intuitiva y accesible desde cualquier dispositivo, asegurando que el proceso de actualización de preferencias sea rápido y sin fricciones.
## Valor de Negocio
El 'SMS/Email Preference Center' aporta un valor de negocio incalculable a los entrenadores que utilizan TrainerERP. En primer lugar, mitiga significativamente el riesgo legal y financiero asociado al incumplimiento de las leyes de protección de datos. Al dar al cliente un control explícito y documentado, el entrenador se protege contra quejas de spam y posibles sanciones. En segundo lugar, transforma la comunicación de masiva a personalizada, mejorando la retención de clientes. Un cliente que recibe solo la información que valora (como un recordatorio de sesión por SMS y un consejo de nutrición por email) se siente escuchado y respetado, no bombardeado por marketing. Esto reduce las tasas de cancelación de suscripción y aumenta la interacción con el contenido. Además, optimiza los costes de comunicación, especialmente en canales de pago como el SMS, al evitar envíos a clientes no interesados. Finalmente, eleva la marca del entrenador, posicionándolo como un profesional que no solo se preocupa por los resultados físicos de sus clientes, sino también por su privacidad y su tiempo. Esta confianza es un diferenciador clave en un mercado competitivo.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como Cliente, quiero poder darme de baja de los correos promocionales sobre nuevos bootcamps, pero seguir recibiendo mis recordatorios de sesión por SMS para no faltar a mis entrenamientos.
- Como Cliente, quiero elegir recibir mensajes motivacionales diarios por WhatsApp por la mañana, pero que mi resumen de progreso mensual me llegue por email para poder archivarlo fácilmente.
- Como Cliente, quiero tener un botón claro de 'Anular suscripción a todo' para poder cesar todas las comunicaciones no transaccionales de forma rápida y definitiva si decido dejar el programa de entrenamiento.
- Como Entrenador Personal, quiero que mis clientes puedan autogestionar sus preferencias de comunicación para asegurar que cumplo con la normativa GDPR y para que mis mensajes de marketing lleguen solo a quienes están interesados.
- Como Cliente, quiero poder acceder a mi centro de preferencias directamente desde un enlace en el pie de página de cualquier email que reciba, sin tener que recordar un usuario o contraseña, para hacer cambios sobre la marcha.
## Acciones Clave
- Visualizar una lista de todas las categorías de comunicación disponibles (Recordatorios, Planes, Nutrición, Motivación, Promociones).
- Activar o desactivar la suscripción para cada categoría de comunicación individualmente mediante un interruptor (toggle).
- Seleccionar el canal de comunicación preferido (Email o SMS) para cada categoría activada.
- Guardar la configuración de preferencias actualizada con un solo clic.
- Ejecutar una anulación de suscripción global para todas las comunicaciones no esenciales.
- Ver la fecha en que se actualizaron por última vez las preferencias para tener un registro.
- Recibir una confirmación visual inmediata en la pantalla después de guardar los cambios.
## 🧩 Componentes React Sugeridos
### 1. PreferenceCenterContainer
Tipo: container | Componente principal que orquesta toda la página. Obtiene el token de la URL, realiza la llamada a la API para cargar las preferencias del cliente, gestiona el estado de carga y error, y maneja la acción de guardar los cambios.
Estados: preferences: Preference[], isLoading: boolean, error: string | null, isSaving: boolean
Dependencias: axios, react-router-dom
Ejemplo de uso:
```typescript
<PreferenceCenterContainer />
```

### 2. PreferenceCategoryRow
Tipo: presentational | Muestra una única fila para una categoría de preferencia (ej. 'Mensajes Motivacionales'). Incluye el nombre de la categoría, un interruptor para activar/desactivar y el selector de canal.
Props:
- categoryName: 
- string (requerido) - Nombre legible de la categoría de comunicación.
- isSubscribed: 
- boolean (requerido) - Estado actual de la suscripción para esta categoría.
- selectedChannel: 
- 'email' | 'sms' | 'none' (requerido) - Canal actualmente seleccionado.
- onToggle: 
- (isSubscribed: boolean) => void (requerido) - Callback que se ejecuta cuando el interruptor cambia.
- onChannelChange: 
- (channel: 'email' | 'sms') => void (requerido) - Callback que se ejecuta cuando se selecciona un nuevo canal.
Ejemplo de uso:
```typescript
<PreferenceCategoryRow categoryName="Consejos de Nutrición" isSubscribed={true} selectedChannel='email' onToggle={handleToggle} onChannelChange={handleChannelChange} />
```

### 3. ChannelSelector
Tipo: presentational | Un componente visual para seleccionar entre Email y SMS, mostrando iconos representativos. Se deshabilita si la categoría está desactivada.
Props:
- value: 
- 'email' | 'sms' (requerido) - El canal actualmente seleccionado.
- onChange: 
- (channel: 'email' | 'sms') => void (requerido) - Función a llamar cuando la selección cambia.
- disabled: 
- boolean (opcional) - Si el selector debe estar deshabilitado.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<ChannelSelector value={channel} onChange={setChannel} disabled={!isSubscribed} />
```

### 4. useCommunicationPreferences
Tipo: hook | Hook personalizado que encapsula la lógica para interactuar con la API de preferencias. Expone métodos para cargar, actualizar y guardar las preferencias, así como los estados de carga y error.
Props:
- token: 
- string (requerido) - Token de autenticación del cliente para acceder a sus preferencias.
Dependencias: axios
Ejemplo de uso:
```typescript
const { preferences, isLoading, error, savePreferences } = useCommunicationPreferences(token);
```
## 🔌 APIs Requeridas
### 1. GET /api/client/preferences
Obtiene las preferencias de comunicación actuales de un cliente usando un token de un solo uso.
Parámetros:
- token (
- string, query, requerido): Token JWT de corta duración y un solo uso que identifica al cliente y autoriza la lectura.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene la información del cliente y un array de sus preferencias.
```json
{
  "clientName": "Ana García",
  "preferences": [
    {
      "category": "session_reminders",
      "is_subscribed": true,
      "channel": "sms"
    },
    {
      "category": "workout_updates",
      "is_subscribed": true,
      "channel": "email"
    },
    {
      "category": "nutrition_tips",
      "is_subscribed": true,
      "channel": "email"
    },
    {
      "category": "motivation",
      "is_subscribed": false,
      "channel": "none"
    },
    {
      "category": "promotions",
      "is_subscribed": false,
      "channel": "none"
    }
  ],
  "last_updated_at": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Token inválido o expirado - El token proporcionado no es válido, ya ha sido utilizado o ha superado su tiempo de vida.
- 404: 
- Cliente no encontrado - El cliente asociado al token no existe en el sistema.

### 2. PUT /api/client/preferences
Actualiza las preferencias de comunicación de un cliente. Invalida el token después del uso.
Parámetros:
- token (
- string, query, requerido): Token JWT de corta duración y un solo uso que identifica al cliente y autoriza la escritura.
- preferences (
- array, body, requerido): Un array con la configuración de preferencias actualizada.
Respuesta:
Tipo: object
Estructura: Un objeto con un mensaje de confirmación.
```json
{
  "status": "success",
  "message": "Tus preferencias han sido actualizadas correctamente."
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Datos de preferencias inválidos - El cuerpo de la solicitud (body) no tiene el formato esperado o contiene valores no válidos.
- 401: 
- Token inválido o expirado - El token proporcionado no es válido, ya ha sido utilizado o ha superado su tiempo de vida.

### 3. POST /api/client/unsubscribe-all
Realiza una anulación de suscripción global para todas las comunicaciones no transaccionales. Esta acción es irreversible por parte del cliente y debe ser registrada en un log de auditoría.
Parámetros:
- token (
- string, body, requerido): Token JWT que identifica al cliente.
Respuesta:
Tipo: object
Estructura: Un objeto con un mensaje de confirmación.
```json
{
  "status": "success",
  "message": "Has sido dado de baja de todas nuestras comunicaciones."
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Token inválido o expirado - El token proporcionado no es válido.

### 4. GET /api/trainer/clients/{clientId}/preferences
Permite a un entrenador autenticado ver las preferencias de comunicación de uno de sus clientes (solo lectura).
Parámetros:
- clientId (
- string, path, requerido): ID del cliente cuyas preferencias se quieren consultar.
Respuesta:
Tipo: object
Estructura: La misma estructura que el GET del cliente.
```json
{
  "preferences": [
    {
      "category": "session_reminders",
      "is_subscribed": true,
      "channel": "sms"
    }
  ],
  "last_updated_at": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Acceso denegado - El entrenador no tiene permiso para ver a este cliente.
- 404: 
- Cliente no encontrado - El clientId no existe.
## Notas Técnicas
Colecciones backend: clients, communication_preferences, audit_logs
KPIs visibles: Fecha de última actualización, Estado de suscripción por categoría (Suscrito / No suscrito), Canal seleccionado por categoría (Email / SMS), Estado global de suscripción (Activo / Totalmente anulado), Número de categorías de comunicación activas
## Documentación Completa
## Resumen
El Centro de Preferencias de Comunicación (SMS/Email Preference Center) es una página web crítica para el cumplimiento legal y la retención de clientes dentro de la plataforma TrainerERP. Su objetivo principal es empoderar a los clientes finales de los entrenadores, dándoles un control total y granular sobre los tipos de mensajes que reciben, el canal por el que los reciben (Email o SMS/WhatsApp), y la frecuencia.
Esta funcionalidad va más allá de un simple enlace de "cancelar suscripción". Proporciona una experiencia de usuario positiva que respeta el tiempo y la atención del cliente, lo que a su vez fortalece la relación con su entrenador. Para el entrenador, esta herramienta automatiza el cumplimiento de normativas de privacidad como GDPR, reduce las quejas de spam, mejora las tasas de apertura y clics al enviar contenido deseado, y optimiza los costes asociados a las campañas de marketing. En esencia, convierte la comunicación de una potencial molestia en un servicio de valor añadido, alineado con los objetivos del cliente.
---
## Flujo paso a paso de uso real
Este es el recorrido típico de un cliente que desea ajustar sus preferencias:
1. **Recepción de Comunicación**: Ana, una clienta, recibe un email de su entrenador con "5 recetas saludables para la semana".
2. **Acceso al Centro de Preferencias**: Al final del email, Ana ve un enlace que dice "Gestionar mis preferencias de comunicación" y hace clic en él.
3. **Autenticación Transparente**: El sistema de TrainerERP recibe la solicitud. El enlace contiene un token JWT seguro, único y de corta duración, asociado exclusivamente a Ana. Esto le permite acceder sin necesidad de introducir usuario y contraseña.
4. **Redirección y Carga de Datos**: El sistema valida el token y redirige a Ana a la página `trainer-erp.com/client/preferences/communication?token=...`. La página se carga y, usando el token, hace una llamada a la API `GET /api/client/preferences` para obtener su configuración actual.
5. **Visualización de Preferencias**: Ana ve una interfaz clara con varias filas:
* Recordatorios de Sesión: `Activado - SMS`
* Consejos de Nutrición: `Activado - Email`
* Mensajes Motivacionales: `Activado - Email`
* Ofertas y Promociones: `Activado - Email`
6. **Realización de Cambios**: Ana decide que recibe demasiados emails. Desactiva los "Mensajes Motivacionales" usando el interruptor y decide que no le interesan las promociones, por lo que desactiva también esa categoría.
7. **Guardado de Cambios**: Hace clic en el botón "Guardar mis preferencias".
8. **Llamada a la API de Actualización**: El frontend realiza una llamada `PUT /api/client/preferences` enviando el nuevo conjunto de reglas en el cuerpo de la petición. El token se utiliza de nuevo para autorizar esta escritura.
9. **Confirmación y Persistencia**: El backend recibe la solicitud, actualiza el registro de preferencias de Ana en la base de datos, invalida el token para que no pueda ser reutilizado y registra la acción en un log de auditoría. Devuelve una respuesta de éxito.
10. **Feedback al Usuario**: La página muestra un mensaje de confirmación: "¡Tus preferencias se han guardado con éxito!". Si Ana recarga la página con el mismo enlace, recibirá un error de "token expirado", garantizando la seguridad.
---
## Riesgos operativos y edge cases
* **Seguridad del Token**: El token de acceso debe tener una vida corta (ej. 24 horas) y ser de un solo uso para la escritura (se invalida tras guardar) para prevenir accesos no autorizados si el enlace es compartido.
* **Sincronización de Datos**: Si un cliente cambia su email o teléfono desde su perfil principal, el sistema debe asegurar que las preferencias de comunicación se mantengan ligadas a la identidad del cliente, no al dato de contacto obsoleto.
* **Prevalencia de la anulación global**: Si un cliente pulsa "Anular suscripción a todo", esta acción debe tener la máxima prioridad. Debe desactivar todas las categorías de preferencia y añadir una bandera `global_unsubscribe` en el perfil del cliente que impida que futuras automatizaciones o envíos manuales (excepto transaccionales) puedan contactarle.
* **Comunicaciones Transaccionales**: El sistema debe diferenciar claramente entre comunicaciones de marketing/opcionales y comunicaciones transaccionales (ej. restablecimiento de contraseña, confirmación de pago). El centro de preferencias SÓLO debe gestionar las opcionales.
* **Manejo de clientes sin datos de contacto**: La interfaz debe gestionar elegantemente el caso de que una categoría se intente configurar para SMS si el cliente no tiene un número de teléfono registrado, mostrando un mensaje informativo y deshabilitando la opción.
---
## KPIs y qué significan
* **Tasa de Actualización de Preferencias**: (Nº de clientes que actualizan / Nº de clientes activos) * 100. Una tasa alta puede indicar que los clientes están comprometidos, pero si es demasiado alta, podría señalar que las opciones por defecto no son las adecuadas.
* **Ratio de Preferencia de Canal (Email vs. SMS)**: El porcentaje de suscripciones activas por canal. Ayuda al entrenador a decidir dónde invertir más esfuerzo y presupuesto en comunicación.
* **Tasa de Abandono por Categoría**: Porcentaje de clientes que desactivan una categoría específica. Un valor alto en "Promociones" es normal, pero uno alto en "Consejos de Nutrición" podría indicar que el contenido no es de valor.
* **Tasa de Anulación Global (Global Unsubscribe Rate)**: El KPI de salud más importante. Un aumento repentino es una señal de alarma sobre la calidad del servicio o la estrategia de comunicación.
---
## Diagramas de Flujo (Mermaid)
### Flujo de Actualización de Preferencias del Cliente
mermaid
graph TD
A[Cliente recibe email y clica en 'Gestionar Preferencias'] --> B{Sistema genera y embebe token JWT único};
B --> C[Cliente es redirigido a /client/preferences?token=...];
C --> D[Página carga y llama a GET /api/client/preferences];
D --> E[API valida token y devuelve preferencias actuales];
E --> F[UI muestra las preferencias al cliente];
F --> G{Cliente modifica sus preferencias en la UI};
G --> H[Cliente clica en 'Guardar'];
H --> I[Página llama a PUT /api/client/preferences con nuevos datos];
I --> J{API valida token, actualiza BD, invalida token y registra log};
J --> K[API devuelve respuesta de éxito];
K --> L[UI muestra mensaje de confirmación];
