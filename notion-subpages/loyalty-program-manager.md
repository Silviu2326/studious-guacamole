# Loyalty Program Manager

**Página padre:** Hola

---

# Loyalty Program Manager
👥 Tipo de Usuario: Entrenador Personal (Administrador), Cliente
El 'Entrenador Personal (Administrador)' utiliza esta página para diseñar, configurar y gestionar todo el programa de fidelización: define cómo se ganan los puntos, qué recompensas se pueden canjear y los niveles de membresía. También puede ver análisis y ajustar puntos manualmente. El 'Cliente' no accede a esta página de gestión, sino que interactúa con el programa a través de su propio portal/dashboard, donde puede ver su saldo de puntos, su nivel actual, el historial de transacciones y el catálogo de recompensas disponibles para canjear.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/monetizacion/loyalty
## Descripción Funcional
El 'Loyalty Program Manager' es el centro de control para crear un ecosistema de recompensas y fidelización dentro de TrainerERP. Esta herramienta permite a los entrenadores personales transformar la experiencia de sus clientes en un viaje gamificado, incentivando la consistencia, el compromiso y la promoción. Desde esta interfaz, el entrenador puede establecer un conjunto de reglas automáticas para la asignación de puntos. Por ejemplo, se pueden otorgar puntos por acciones clave que impulsan el negocio: asistir a una sesión programada, completar un reto de fitness, alcanzar un hito personal (como un nuevo récord de levantamiento), dejar una reseña positiva, o, crucialmente, referir a un amigo que se convierta en cliente. El sistema se integra con el resto de TrainerERP para que esta asignación sea automática y sin fricciones. Además de la acumulación, el entrenador puede diseñar un atractivo catálogo de recompensas. Estas no se limitan a descuentos; pueden ser productos físicos (merchandising, suplementos), servicios (sesiones de entrenamiento personal gratuitas, consultas de nutrición) o contenido digital exclusivo (guías de entrenamiento avanzadas, recetarios). El entrenador establece el 'coste' en puntos para cada recompensa, controlando así la economía del programa. La funcionalidad se completa con la capacidad de crear niveles de membresía (ej. Bronce, Plata, Oro), que los clientes desbloquean al acumular puntos, ofreciendo beneficios crecientes como multiplicadores de puntos o acceso a recompensas exclusivas, fomentando así la retención a largo plazo.
## Valor de Negocio
El valor de negocio del 'Loyalty Program Manager' para un entrenador personal es multifacético y de alto impacto. Principalmente, es una poderosa herramienta de retención de clientes. Al recompensar la lealtad y la consistencia, se reduce significativamente la tasa de abandono (churn), uno de los mayores desafíos en la industria del fitness. Un cliente que está acumulando puntos para una recompensa deseada tiene un incentivo tangible para continuar con su programa de entrenamiento. En segundo lugar, convierte a los clientes en promotores activos del negocio. Al incentivar las referencias con puntos, el programa sistematiza y escala el marketing de boca en boca, que es la fuente de leads más efectiva y económica para un entrenador. Además, gamifica la experiencia del cliente, aumentando el 'engagement' y haciendo que el proceso de fitness sea más divertido y gratificante. Esto no solo mejora la satisfacción del cliente, sino que también crea una conexión emocional más fuerte con la marca del entrenador. Financieramente, puede abrir nuevas vías de monetización al ofrecer recompensas premium y fomenta comportamientos deseados que impactan directamente en los ingresos, como la asistencia regular y la compra de productos adicionales. En resumen, esta funcionalidad transforma la relación transaccional cliente-entrenador en una comunidad leal y comprometida, aumentando el valor de vida del cliente (LTV) y fortaleciendo la sostenibilidad del negocio.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero configurar reglas para que mis clientes ganen 10 puntos automáticamente por cada sesión a la que asistan, para incentivar la consistencia sin trabajo manual.
- Como dueño de un estudio, quiero crear un catálogo de recompensas que incluya '1 Sesión de Nutrición Gratis' por 500 puntos y 'Descuento del 15% en Merchandising' por 200 puntos, para ofrecer valor tangible a mis clientes.
- Como cliente, quiero ver mi saldo de puntos y mi nivel de fidelidad (ej. 'Nivel Oro') en mi panel personal para saber qué tan cerca estoy de mi próxima recompensa.
- Como entrenador online, quiero que el sistema otorgue automáticamente 100 puntos a un cliente cuando su referido se inscribe en un plan de pago, para potenciar el marketing de boca en boca.
- Como administrador del sistema, quiero poder ver un dashboard con las recompensas más canjeadas y la tasa de participación en el programa para poder optimizar la estrategia de fidelización.
- Como cliente, quiero recibir una notificación por email o push cuando canjeo una recompensa, con los detalles de cómo y cuándo la recibiré.
## Acciones Clave
- Configurar las reglas de acumulación de puntos por acción (asistencia, referido, compra, etc.).
- Crear, editar y eliminar recompensas del catálogo, asignando un coste en puntos a cada una.
- Definir y gestionar los niveles de fidelidad (tiers) y sus beneficios asociados (ej. multiplicador de puntos).
- Visualizar el historial completo de transacciones de puntos (ganados y canjeados) para cualquier cliente.
- Ajustar manualmente el saldo de puntos de un cliente para otorgar bonificaciones o corregir errores.
- Activar o desactivar el programa de fidelización globalmente.
- Analizar los KPIs del programa en un dashboard de rendimiento.
## 🧩 Componentes React Sugeridos
### 1. LoyaltyProgramDashboard
Tipo: container | Componente principal que orquesta la página. Obtiene la configuración del programa, las reglas, las recompensas y los KPIs, y los pasa a los componentes de presentación.
Estados: loyaltyConfig, loyaltyRules[], loyaltyRewards[], kpiData, isLoading, error
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<LoyaltyProgramDashboard />
```

### 2. RulesEngineConfigurator
Tipo: presentational | Muestra una lista de las reglas de acumulación de puntos y permite al entrenador activarlas/desactivarlas y editar los puntos asignados a cada acción.
Props:
- rules: 
- Array<{id: string, action: string, description: string, points: number, isActive: boolean}> (requerido) - Array de objetos que representan las reglas de acumulación de puntos.
- onUpdateRule: 
- (ruleId: string, newValues: {points?: number, isActive?: boolean}) => void (requerido) - Función callback que se ejecuta cuando el entrenador modifica una regla.
Estados: editingRuleId
Ejemplo de uso:
```typescript
<RulesEngineConfigurator rules={loyaltyRules} onUpdateRule={handleUpdateRule} />
```

### 3. RewardsCatalogManager
Tipo: presentational | Componente para visualizar, agregar, editar y eliminar recompensas del catálogo. Muestra cada recompensa como una tarjeta con su imagen, nombre, descripción y coste en puntos.
Props:
- rewards: 
- Array<{id: string, name: string, description: string, pointsCost: number, imageUrl?: string}> (requerido) - Array de objetos de recompensa a mostrar.
- onAddReward: 
- (newReward: Omit<Reward, 'id'>) => void (requerido) - Función para manejar la creación de una nueva recompensa.
- onDeleteReward: 
- (rewardId: string) => void (requerido) - Función para manejar la eliminación de una recompensa.
Estados: isAddModalOpen, isEditModalOpen, selectedReward
Dependencias: ModalComponent
Ejemplo de uso:
```typescript
<RewardsCatalogManager rewards={rewardsData} onAddReward={handleAdd} onDeleteReward={handleDelete} />
```

### 4. useLoyaltyProgram
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y mutación de los datos del programa de fidelización.
Dependencias: react-query
Ejemplo de uso:
```typescript
const { config, rules, rewards, updateConfig, isLoading } = useLoyaltyProgram();
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/loyalty/program
Obtiene la configuración completa del programa de fidelización, incluyendo reglas y niveles (tiers).
Respuesta:
Tipo: object
Estructura: Un objeto que contiene la configuración general (isActive, programName) y arrays para las reglas y los niveles.
```json
{
  "id": "prog_123",
  "isActive": true,
  "programName": "Trainer Pro Club",
  "rules": [
    {
      "id": "rule_abc",
      "actionType": "session_attendance",
      "points": 10,
      "isActive": true
    },
    {
      "id": "rule_def",
      "actionType": "referral_signup",
      "points": 100,
      "isActive": true
    }
  ],
  "tiers": [
    {
      "id": "tier_br",
      "name": "Bronce",
      "minPoints": 0,
      "pointMultiplier": 1
    },
    {
      "id": "tier_sl",
      "name": "Plata",
      "minPoints": 1000,
      "pointMultiplier": 1.2
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El programa de fidelización aún no ha sido configurado por este entrenador.

### 2. PUT /api/v1/loyalty/program
Actualiza la configuración del programa de fidelización (activar/desactivar, cambiar puntos de las reglas).
Parámetros:
- programData (
- object, body, requerido): Objeto con los campos a actualizar. Se pueden enviar solo los campos que cambian.
Respuesta:
Tipo: object
Estructura: El objeto del programa de fidelización actualizado.
```json
{
  "id": "prog_123",
  "isActive": true,
  "programName": "Trainer Pro Club",
  "rules": [
    {
      "id": "rule_abc",
      "actionType": "session_attendance",
      "points": 15,
      "isActive": true
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos de entrada inválidos, como puntos negativos.

### 3. POST /api/v1/loyalty/rewards
Crea una nueva recompensa en el catálogo.
Parámetros:
- rewardData (
- object, body, requerido): Datos de la nueva recompensa.
Respuesta:
Tipo: object
Estructura: El objeto de la recompensa recién creada, incluyendo su nuevo ID.
```json
{
  "id": "rew_xyz789",
  "name": "Proteína Whey 1kg",
  "description": "Bote de proteína sabor chocolate de nuestra marca asociada.",
  "pointsCost": 1500,
  "stock": 50,
  "type": "physical"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos obligatorios como 'name' o 'pointsCost'.
- 409: 
- Conflict - Ya existe una recompensa con el mismo nombre.

### 4. DELETE /api/v1/loyalty/rewards/{rewardId}
Elimina una recompensa del catálogo. Generalmente se debería marcar como inactiva en lugar de borrarla si ya ha sido canjeada.
Parámetros:
- rewardId (
- string, path, requerido): El ID de la recompensa a eliminar.
Respuesta:
Tipo: object
Estructura: Un mensaje de confirmación.
```json
{
  "message": "Reward deleted successfully"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna recompensa con el ID proporcionado.

### 5. POST /api/v1/clients/{clientId}/points/adjustment
Ajusta manualmente el saldo de puntos de un cliente (para bonos o correcciones).
Parámetros:
- clientId (
- string, path, requerido): El ID del cliente cuyo saldo se va a ajustar.
- adjustmentData (
- object, body, requerido): Objeto con la cantidad de puntos y el motivo del ajuste.
Respuesta:
Tipo: object
Estructura: El nuevo saldo de puntos del cliente y el registro de la transacción.
```json
{
  "clientId": "client_abc",
  "newPointsBalance": 550,
  "transaction": {
    "id": "txn_12345",
    "points": 50,
    "type": "credit",
    "reason": "Bono por completar reto de 30 días",
    "timestamp": "2023-10-27T10:00:00Z"
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El campo 'points' no es un número válido o falta el campo 'reason'.
- 404: 
- Not Found - El cliente con el ID especificado no existe.
## Notas Técnicas
Colecciones backend: loyalty_programs, loyalty_rules, loyalty_tiers, loyalty_rewards, user_points_ledger, users
KPIs visibles: Tasa de Participación en el Programa (% de clientes activos con transacciones de puntos), Puntos Totales Canjeados (últimos 30 días), Recompensa Más Popular (por número de canjes), Tasa de Redención (Puntos Canjeados / Puntos Ganados), Número de Referidos Exitosos a través del Programa, Promedio de Puntos por Cliente Activo
## Documentación Completa
## Resumen
El **Loyalty Program Manager** es una funcionalidad estratégica dentro del área de **MONETIZACIÓN & OFERTAS** de TrainerERP, diseñada para incrementar la retención de clientes y fomentar el marketing de boca en boca. Permite a los entrenadores personales y estudios de fitness crear un programa de fidelización a medida, donde los clientes ganan puntos por realizar acciones valiosas (asistir a clases, referir amigos, comprar productos) y luego canjean esos puntos por recompensas atractivas (sesiones gratis, descuentos, merchandising).
El objetivo principal es transformar la relación con el cliente de puramente transaccional a una basada en el compromiso y la lealtad a largo plazo. Al gamificar la experiencia de fitness, se aumenta la motivación del cliente y se fortalece su conexión con la marca del entrenador. El sistema está diseñado para ser altamente automatizado, integrándose con otras áreas de TrainerERP (calendario, CRM, facturación) para otorgar puntos sin intervención manual, liberando tiempo valioso para el entrenador.
## Flujo paso a paso de uso real
**Fase 1: Configuración por parte del Entrenador**
1. **Acceso:** El entrenador navega a `Dashboard > Monetización > Programa de Fidelización`.
2. **Activación:** Si es la primera vez, se le presenta un asistente de configuración. Lo primero es activar el programa con un simple toggle.
3. **Definir Reglas de Puntos:** El entrenador accede a la sección 'Reglas'. Aquí ve una lista de acciones predefinidas del sistema (ej. 'Asistencia a sesión', 'Registro de referido', 'Primera compra', 'Cumpleaños del cliente'). Para cada una, activa la regla y define cuántos puntos otorga. Por ejemplo:
* `Asistencia a sesión de PT`: 10 Puntos
* `Referido exitoso (se convierte en cliente)`: 150 Puntos
* `Dejar una reseña verificada`: 25 Puntos
4. **Crear Catálogo de Recompensas:** Navega a la sección 'Recompensas' y hace clic en 'Añadir Recompensa'. Completa un formulario:
* **Nombre:** Sesión de Entrenamiento Personal Gratis
* **Descripción:** Una sesión 1-a-1 de 60 minutos contigo.
* **Coste en Puntos:** 500
* **Tipo:** Servicio (Otras opciones: Producto Físico, Contenido Digital, Descuento)
* Repite el proceso para otras recompensas como 'Shaker de TrainerERP' (200 puntos) o '10% de descuento en suplementos' (100 puntos).
5. **Configurar Niveles (Opcional):** En la sección 'Niveles', puede crear tiers como 'Bronce' (0+ puntos), 'Plata' (1000+ puntos), y 'Oro' (3000+ puntos). Para los niveles 'Plata' y 'Oro', puede añadir beneficios como un multiplicador de puntos (ej. los miembros Oro ganan puntos x1.5 más rápido).
**Fase 2: Interacción por parte del Cliente**
1. **Ganar Puntos:** Un cliente, llamado Alex, asiste a su sesión. Al final del día, el sistema procesa las asistencias y automáticamente añade 10 puntos a su cuenta. Alex recibe una notificación: *"¡Felicidades! Has ganado 10 puntos por tu entrenamiento de hoy. ¡Sigue así!"*
2. **Ver Progreso:** Alex accede a su portal de cliente en TrainerERP. Ve un nuevo widget que muestra: *"Saldo: 120 Puntos | Nivel: Bronce"*.
3. **Explorar Recompensas:** Hace clic en el widget y es llevado a la página del programa de fidelización, donde ve su historial de puntos y el catálogo de recompensas disponibles.
4. **Canjear Recompensa:** Alex ve que tiene suficientes puntos para el '10% de descuento en suplementos'. Hace clic en 'Canjear'. El sistema le pide confirmación.
5. **Confirmación:** Al confirmar, se deducen 100 puntos de su saldo. Se genera un código de descuento único y se le muestra en pantalla, además de enviárselo por email. El entrenador recibe una notificación: *"Alex ha canjeado la recompensa '10% de descuento en suplementos'"*.
## Riesgos operativos y edge cases
* **Modificación de Reglas:** Si un entrenador reduce los puntos por una acción (de 10 a 5 por sesión), ¿qué pasa con los puntos ya otorgados? La política debe ser clara: los cambios no son retroactivos.
* **Devoluciones/Cancelaciones:** Si un cliente gana puntos por una compra y luego la devuelve, el sistema debe tener una lógica para revertir esos puntos. Esto requiere una integración profunda con el sistema de facturación.
* **Agotamiento de Recompensas:** Si una recompensa física (ej. 'Camiseta') se queda sin stock, la API debe reflejarlo para que no se pueda canjear. El entrenador debe poder marcar recompensas como 'agotadas' temporalmente.
* **Abuso del Sistema:** Un cliente podría intentar crear referidos falsos. El sistema debe validar que un referido es 'exitoso' solo cuando realiza un pago, no solo con el registro.
* **Desactivación del Programa:** Si un entrenador desactiva el programa, se debe comunicar claramente a los clientes qué pasará con sus puntos existentes (ej. 'tienes 90 días para canjear tus puntos').
## KPIs y qué significan
* **Tasa de Participación en el Programa:** (`Clientes con al menos 1 transacción de puntos / Total de clientes activos`). Este es el KPI de salud más importante. Una tasa baja (<30%) indica que el programa no es atractivo o no se está comunicando bien. El objetivo es >60%.
* **Tasa de Redención:** (`Puntos canjeados / Puntos ganados`). Mide si los clientes encuentran valor en las recompensas. Una tasa baja sugiere que las recompensas son inalcanzables o poco atractivas.
* **Recompensa Más Popular:** Ayuda al entrenador a entender qué valoran sus clientes para poder ofrecer más recompensas similares y optimizar el inventario.
* **Número de Referidos Exitosos a través del Programa:** Mide directamente el ROI del programa en términos de adquisición de nuevos clientes. Es un indicador clave del éxito de la vertiente de marketing.
## Diagramas de Flujo (Mermaid)
**Flujo de Acumulación de Puntos:**
mermaid
graph TD
A[Cliente realiza una acción clave, ej. Asiste a sesión] --> B{Sistema detecta el evento};
B --> C{¿Existe una regla de fidelización para esta acción?};
C -- Sí --> D[Calcular puntos a otorgar];
D --> E[Crear transacción de crédito en el ledger del cliente];
E --> F[Actualizar saldo total de puntos del cliente];
F --> G[Verificar si el nuevo saldo desbloquea un nuevo nivel];
G -- Sí --> H[Actualizar nivel del cliente y aplicar beneficios];
G -- No --> I[Enviar notificación al cliente];
H --> I;
C -- No --> J[Fin del proceso];
**Flujo de Canje de Recompensa:**
mermaid
graph TD
A[Cliente navega al catálogo de recompensas] --> B[Selecciona una recompensa];
B --> C{¿Tiene suficientes puntos?};
C -- Sí --> D[Mostrar modal de confirmación];
D --> E{Cliente confirma el canje};
E -- Sí --> F[Crear transacción de débito en el ledger];
F --> G[Actualizar saldo total de puntos];
G --> H[Notificar al entrenador sobre el canje];
H --> I[Entregar la recompensa al cliente (ej. generar código, añadir a la próxima entrega)];
I --> J[Enviar confirmación al cliente];
C -- No --> K[Mostrar mensaje de 'Puntos insuficientes'];
E -- No --> L[Cancelar y volver al catálogo];
