# Email Deliverability & Compliance Hub

**Página padre:** Hola

---

# Email Deliverability & Compliance Hub
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Esta funcionalidad es crucial para cualquier entrenador que utilice el email marketing para comunicarse con sus clientes y leads. El 'Entrenador Personal (Administrador)' la usará para monitorear la salud de sus listas y garantizar que sus mensajes clave (recordatorios, planes, ofertas) lleguen a la bandeja de entrada. El 'Entrenador Asociado' en un estudio más grande podría ser el responsable de gestionar las campañas y necesitará estas herramientas para optimizar los resultados. El 'Administrador del Sistema' puede supervisar la salud de envío de toda la plataforma.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/email/compliance
## Descripción Funcional
El 'Email Deliverability & Compliance Hub' es el centro de control para garantizar que la comunicación por correo electrónico de un entrenador no solo se envíe, sino que se entregue de manera efectiva, legal y profesional. En el competitivo mundo del fitness online, que un email llegue a la bandeja de entrada en lugar de a la de spam puede significar la diferencia entre un cliente retenido y uno perdido. Esta página va más allá de un simple editor de correos; se enfoca en la 'salud' a largo plazo de la estrategia de email del entrenador. Proporciona un dashboard visual con un 'Email Health Score' que resume de un vistazo la reputación del remitente. Detalla métricas críticas como las tasas de rebote (hard y soft bounces), quejas de spam y tasas de cancelación de suscripción. La gestión proactiva de estos elementos es fundamental. Por ejemplo, el sistema limpiará automáticamente los contactos con 'hard bounces' (emails inexistentes) para proteger la reputación del dominio del entrenador. Además, ofrece herramientas de cumplimiento legal indispensables, como un registro de consentimiento para normativas como GDPR, vital para entrenadores con clientes en Europa. La gestión de la lista de supresión permite a los entrenadores controlar quién no debe recibir correos, centralizando las bajas y quejas para evitar errores costosos. En esencia, este hub transforma el email de una simple herramienta de envío a un activo estratégico, protegiendo al entrenador de problemas legales y técnicos mientras maximiza el impacto de su comunicación.
## Valor de Negocio
El valor de negocio del 'Email Deliverability & Compliance Hub' para un entrenador personal es multifacético y directo. Principalmente, protege y maximiza el retorno de la inversión de uno de sus canales de comunicación más importantes. Una alta entregabilidad asegura que las ofertas de nuevos programas de entrenamiento, los recordatorios de sesiones, los consejos de nutrición y los mensajes motivacionales lleguen a sus destinatarios, lo que impacta directamente en la conversión de ventas y la retención de clientes. Al automatizar la limpieza de listas y la gestión de rebotes, TrainerERP ahorra al entrenador horas de trabajo manual y previene daños a su reputación de remitente, que una vez perdida, es muy difícil de recuperar. Desde una perspectiva de mitigación de riesgos, el cumplimiento de normativas como GDPR y CAN-SPAM no es opcional; es una necesidad legal. Este hub proporciona las herramientas para gestionar consentimientos y bajas de forma transparente, evitando multas potencialmente devastadoras para un negocio en crecimiento. Finalmente, mantener una lista de correo 'sana' y respetar las preferencias de los clientes construye una marca profesional y de confianza, diferenciando al entrenador de competidores que pueden utilizar prácticas de marketing más agresivas y menos sostenibles. A largo plazo, esto se traduce en una base de clientes más leal y comprometida.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero ver un panel con la salud de mi lista de emails para poder identificar rápidamente si mis comunicaciones sobre nuevos retos están en riesgo de ser marcadas como spam.
- Como gestor de un estudio de fitness, quiero que el sistema limpie automáticamente los emails de clientes que rebotan (hard bounces) para no malgastar envíos y proteger la reputación de nuestro dominio.
- Como coach online con clientes en Europa, quiero tener un registro de consentimiento (GDPR) para cada suscriptor, para poder demostrar cumplimiento legal si es necesario.
- Como entrenador, quiero gestionar una lista de supresión global para que si un cliente se da de baja de mi newsletter, no reciba accidentalmente ofertas de entrenamiento personalizadas.
- Como entrenador que lanza un nuevo programa, quiero poder ver el porcentaje de quejas de spam de mi última campaña para entender si mi mensaje fue relevante o si debo ajustar mi segmentación de clientes.
## Acciones Clave
- Visualizar el Dashboard de Salud de Email (Tasa de Apertura, Rebote, Quejas).
- Gestionar la Lista de Supresión (añadir/eliminar manualmente un email).
- Revisar y exportar el registro de consentimientos (GDPR).
- Configurar reglas automáticas para la limpieza de listas (ej: suprimir tras 1 hard bounce).
- Ver un historial detallado de quejas de spam y rebotes por campaña de email.
- Conectar y validar la configuración de dominio (SPF, DKIM) para mejorar la autenticación del remitente.
## 🧩 Componentes React Sugeridos
### 1. EmailHealthDashboard
Tipo: container | Componente principal que obtiene y muestra las métricas de salud de email. Orquesta la obtención de datos y los pasa a los componentes de presentación.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para obtener sus estadísticas específicas.
Estados: loading, error, healthStats
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<EmailHealthDashboard trainerId='trainer-123' />
```

### 2. KpiCard
Tipo: presentational | Una tarjeta reutilizable para mostrar una métrica clave (KPI) con su valor, un título, un ícono y un indicador de tendencia (positivo/negativo).
Props:
- title: 
- string (requerido) - El título de la métrica, ej: 'Tasa de Rebote'.
- value: 
- string | number (requerido) - El valor de la métrica, ej: '2.5%'.
- trend: 
- 'up' | 'down' | 'neutral' (opcional) - Indica la tendencia para mostrar una flecha verde o roja.
- tooltipText: 
- string (opcional) - Texto explicativo que aparece al pasar el cursor.
Dependencias: lucide-react (para iconos)
Ejemplo de uso:
```typescript
<KpiCard title='Tasa de Quejas' value='0.05%' trend='down' tooltipText='Menos quejas que el mes pasado. ¡Buen trabajo!' />
```

### 3. SuppressionListTable
Tipo: container | Muestra la lista de supresión en una tabla paginada y con búsqueda. Permite añadir y eliminar emails manualmente.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para gestionar su lista.
Estados: suppressedEmails, currentPage, searchTerm, isLoading
Dependencias: @tanstack/react-table
Ejemplo de uso:
```typescript
<SuppressionListTable trainerId='trainer-123' />
```

### 4. useEmailComplianceAPI
Tipo: hook | Hook personalizado que encapsula toda la lógica de llamadas a la API para la gestión de la salud y cumplimiento de email.
Props:
- trainerId: 
- string (requerido) - ID del entrenador.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { stats, suppressionList, addSuppressedEmail } = useEmailComplianceAPI('trainer-123');
```
## 🔌 APIs Requeridas
### 1. GET /api/email/health-stats
Obtiene las estadísticas de salud de email para el entrenador autenticado en un rango de fechas.
Parámetros:
- range (
- string, query, opcional): Rango de fechas para las estadísticas. Ej: 'last30days', 'last7days'.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene KPIs como healthScore, bounceRate, spamComplaintRate, unsubscribeRate, y datos para gráficos de series temporales.
```json
{
  "healthScore": 89,
  "bounceRate": {
    "total": 1.2,
    "hard": 0.3,
    "soft": 0.9
  },
  "spamComplaintRate": 0.08,
  "unsubscribeRate": 0.5,
  "history": [
    {
      "date": "2023-10-01",
      "bounces": 10,
      "complaints": 1
    },
    {
      "date": "2023-10-02",
      "bounces": 12,
      "complaints": 0
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se proporcionó.
- 404: 
- Not Found - No se encontraron datos para el entrenador especificado.

### 2. GET /api/email/suppression-list
Obtiene la lista de emails suprimidos con paginación y búsqueda.
Parámetros:
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de resultados por página.
- search (
- string, query, opcional): Término de búsqueda para filtrar por email.
Respuesta:
Tipo: object
Estructura: Un objeto con los resultados y metadatos de paginación.
```json
{
  "data": [
    {
      "email": "bounce@example.com",
      "reason": "hard_bounce",
      "date": "2023-09-15T10:00:00Z"
    },
    {
      "email": "complaint@example.com",
      "reason": "spam_complaint",
      "date": "2023-09-16T11:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - Token de autenticación no válido.

### 3. POST /api/email/suppression-list
Añade manualmente un email a la lista de supresión.
Parámetros:
- email (
- string, body, requerido): El correo electrónico a suprimir.
- reason (
- string, body, opcional): Razón opcional para la supresión (ej: 'manual_add').
Respuesta:
Tipo: object
Estructura: Un objeto confirmando la adición.
```json
{
  "success": true,
  "email": "manual@example.com",
  "message": "Email añadido a la lista de supresión."
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El formato del email no es válido.
- 409: 
- Conflict - El email ya se encuentra en la lista de supresión.

### 4. DELETE /api/email/suppression-list/{email}
Elimina un email de la lista de supresión (acción a realizar con cuidado).
Parámetros:
- email (
- string, path, requerido): El correo electrónico a eliminar de la lista.
Respuesta:
Tipo: object
Estructura: Un objeto confirmando la eliminación.
```json
{
  "success": true,
  "message": "Email eliminado de la lista de supresión."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El email especificado no se encontró en la lista de supresión.

### 5. POST /api/webhooks/email-events
Endpoint para recibir eventos de proveedores de email (ESP) como SendGrid, Postmark, etc. (No es llamado por el frontend).
Parámetros:
- event_payload (
- object, body, requerido): El cuerpo del webhook enviado por el ESP, que contiene el tipo de evento (bounce, complaint, etc.) y los detalles.
Respuesta:
Tipo: object
Estructura: Respuesta 200 OK para confirmar la recepción.
```json
{
  "status": "received"
}
```
Autenticación: No requerida
Errores posibles:
- 400: 
- Bad Request - El payload del webhook es inválido o no se puede procesar.
## Notas Técnicas
Colecciones backend: email_health_metrics, suppression_list, gdpr_consent_log, email_events
KPIs visibles: Email Health Score (Puntuación global de 0-100), Tasa de Rebote (desglosada en Hard y Soft), Tasa de Quejas de Spam (porcentaje sobre emails entregados), Tasa de Bajas (Unsubscribe Rate), Tasa de Apertura Promedio (en los últimos 30 días), Porcentaje de la Lista de Contactos en Supresión
## Documentación Completa
## Resumen
El **Email Deliverability & Compliance Hub** es el centro de mando para la salud y el cumplimiento legal de las comunicaciones por email dentro de TrainerERP. Su objetivo principal es asegurar que los mensajes cruciales de los entrenadores —desde planes de entrenamiento y recordatorios de pago hasta campañas de marketing para nuevos retos— lleguen a la bandeja de entrada de sus clientes, y no a la carpeta de spam. Este módulo protege el activo más importante del marketing digital de un entrenador: su reputación como remitente y su lista de contactos.
A través de un dashboard intuitivo, el entrenador puede monitorear en tiempo real métricas vitales como la tasa de rebote, quejas de spam y cancelaciones de suscripción. El sistema no solo informa, sino que actúa: limpia automáticamente las listas de contactos eliminando direcciones inválidas (hard bounces) y gestiona una lista de supresión centralizada para respetar las decisiones de los usuarios que no desean recibir más comunicaciones. Adicionalmente, provee herramientas de cumplimiento para normativas internacionales como GDPR, permitiendo a los entrenadores operar con confianza en un mercado global.
En pocas palabras, este hub convierte la gestión de email de una tarea reactiva y riesgosa a una estrategia proactiva, segura y profesional que fomenta la confianza del cliente y maximiza el impacto del negocio.
## Flujo paso a paso de uso real
Imaginemos a **Carlos, un entrenador personal online** que usa TrainerERP para gestionar a sus 150 clientes.
1. **Lanzamiento de Campaña:** Carlos acaba de enviar un email a su lista completa anunciando su nuevo 'Reto de Verano de 30 días'.
2. **Revisión Post-Campaña:** Al día siguiente, Carlos accede a TrainerERP y navega a `Marketing > Email > Compliance Hub`.
3. **Análisis del Dashboard:** Lo primero que ve es su 'Email Health Score', que ha bajado de 95 a 91. Pasa el cursor sobre el widget y un tooltip le informa que la 'Tasa de Rebote' fue ligeramente más alta en su última campaña.
4. **Investigación de Rebotes:** Hace clic en la tarjeta de 'Tasa de Rebote'. El sistema le muestra una lista de los 4 emails que rebotaron. Tres fueron 'soft bounces' (buzón lleno, un problema temporal), pero uno fue un 'hard bounce'. El email era `cliente_nuevo@gmil.com`. Carlos se da cuenta del error tipográfico (debería ser `gmail.com`). El sistema ya ha añadido automáticamente `cliente_nuevo@gmil.com` a la lista de supresión para no intentar enviarle más correos.
5. **Corrección Proactiva:** Carlos va a la ficha de ese cliente, corrige el email a `cliente_nuevo@gmail.com` y lo reenvía manualmente al reto. El sistema le notifica que, al corregirlo, el email inválido anterior permanecerá en la lista de supresión por seguridad.
6. **Verificación de Cumplimiento:** Un cliente de Portugal le pregunta cómo se suscribió a su lista. Carlos va a la pestaña 'Registros de Consentimiento', busca el email del cliente y puede ver la fecha, hora y el formulario exacto ('Descarga de Guía de Nutrición') a través del cual el cliente dio su consentimiento, pudiendo exportar esta prueba si fuera necesario.
7. **Revisión de Quejas:** Ve que hubo cero quejas de spam. Esto le da confianza en que el contenido de su reto fue bien recibido por su audiencia.
Este flujo muestra cómo Carlos utiliza el hub no solo para ver datos, sino para tomar acciones informadas que mejoran la calidad de su lista y la relación con sus clientes, todo en menos de 10 minutos.
## Riesgos operativos y edge cases
- **Configuración de Dominio (SPF/DKIM):** Si un entrenador no ha configurado correctamente la autenticación de su dominio, la entregabilidad será baja sin importar la calidad de su lista. El hub debe detectar esto y guiar al usuario para que lo solucione.
- **Importación de Listas Grandes:** Un entrenador que migra desde otra plataforma puede importar una lista de baja calidad. Se debe ofrecer un servicio (o integración) de validación de listas en el momento de la importación para evitar un daño inmediato a la reputación.
- **Bucle de Re-suscripción:** Un usuario en la lista de supresión intenta suscribirse de nuevo a través de un formulario. El sistema debe tener un flujo claro que le envíe un email de confirmación específico para verificar que realmente quiere volver a recibir comunicaciones.
- **Dependencia de API de Terceros:** El sistema depende de los webhooks del proveedor de email (ESP). Si el servicio del ESP sufre una interrupción, los datos de rebotes y quejas pueden llegar con retraso. Se debe tener un mecanismo de monitoreo y, si es posible, de reconciliación periódica.
## KPIs y qué significan
- **Email Health Score:** Una puntuación de 0 a 100 que resume tu reputación general. Por encima de 90 es excelente. Por debajo de 80, es una señal de alerta que requiere tu atención.
- **Tasa de Rebote (Hard Bounce):** Porcentaje de emails enviados a direcciones que no existen. Es como llamar a un número de teléfono desconectado. Una tasa alta (>1%) es muy dañina. El sistema los bloquea automáticamente.
- **Tasa de Rebote (Soft Bounce):** Porcentaje de emails enviados a direcciones que existen pero que no pudieron recibir el correo temporalmente (ej: buzón lleno). No es tan grave, pero si un contacto rebota varias veces, se convierte en un riesgo.
- **Tasa de Quejas de Spam:** Porcentaje de destinatarios que marcaron tu email como spam. Esta es la métrica más crítica. Una tasa superior a 0.1% (1 queja por cada 1000 emails) es una bandera roja para proveedores como Gmail y puede llevar al bloqueo de tu dominio.
- **Tasa de Bajas:** Porcentaje de personas que hicieron clic en 'cancelar suscripción'. Aunque no es ideal, es mucho mejor que una queja de spam. Indica que el contenido no fue relevante para ese segmento.
## Diagramas de Flujo (Mermaid)
**Flujo de Procesamiento de Eventos de Email (Webhook):**
mermaid
graph TD
A[Proveedor de Email (ESP) envía Webhook] --> B{TrainerERP API Endpoint: /api/webhooks/email-events};
B --> C{¿Qué tipo de evento es?};
C -- Hard Bounce --> D[Añadir email a la Suppression List con razón 'hard_bounce'];
C -- Spam Complaint --> E[Añadir email a la Suppression List con razón 'spam_complaint'];
C -- Unsubscribe --> F[Añadir email a la Suppression List con razón 'unsubscribe'];
D --> G[Actualizar Métricas de Salud: Incrementar contador de Hard Bounces];
E --> H[Actualizar Métricas de Salud: Incrementar contador de Quejas];
F --> I[Actualizar Métricas de Salud: Incrementar contador de Bajas];
G --> J[Recalcular Email Health Score];
H --> J;
I --> J;
