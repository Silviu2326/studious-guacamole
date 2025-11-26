# Dynamic Pricing & Ofertas Inteligentes

**Página padre:** Hola

---

# Dynamic Pricing & Ofertas Inteligentes
👥 Tipo de Usuario: Entrenador Personal (Administrador), Administrador del Sistema
Esta funcionalidad está diseñada para los roles de gestión del negocio (Entrenador Administrador, Administrador del Sistema) que configuran las estrategias de precios. Los roles 'Cliente' y 'Lead' no acceden a esta interfaz, pero son los receptores de los precios y ofertas generados por las reglas aquí definidas.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/monetizacion/precios-dinamicos
## Descripción Funcional
La página de 'Dynamic Pricing & Ofertas Inteligentes' es un centro de control avanzado que permite a los entrenadores personales y dueños de estudios de fitness ir más allá de los descuentos estáticos y adoptar una estrategia de monetización proactiva y automatizada. En lugar de establecer un precio fijo para un plan de entrenamiento o una sesión, este sistema permite crear un conjunto de reglas lógicas que ajustan los precios en tiempo real basándose en una multitud de factores. Por ejemplo, un entrenador puede configurar reglas para ofrecer descuentos automáticos en las horas de menor demanda (ej. martes a las 11 a.m.) para maximizar la ocupación de su agenda. También puede diseñar ofertas de reactivación para clientes que no han reservado una sesión en más de 30 días, enviándoles automáticamente un descuento personalizado para incentivar su regreso. El motor de reglas es altamente personalizable, permitiendo combinar condiciones como la estacionalidad (ofertas de 'Verano Fit'), el historial del cliente (descuentos de lealtad para clientes con más de 1 año), el nivel de compromiso (recompensas para quienes completan retos) o incluso la escasez (aumento ligero del precio para las últimas plazas de un bootcamp popular). Esta herramienta transforma la fijación de precios de una tarea manual y reactiva a un sistema inteligente que optimiza ingresos, conversión y retención de forma continua.
## Valor de Negocio
El valor de negocio de la funcionalidad de 'Dynamic Pricing & Ofertas Inteligentes' es multifacético y de alto impacto para cualquier profesional del fitness. En primer lugar, maximiza los ingresos al permitir una gestión de precios similar a la de las aerolíneas o los hoteles, llenando espacios vacíos en la agenda con tarifas reducidas y capitalizando la alta demanda con precios premium. Esto convierte el tiempo no vendido, que antes era una pérdida total, en una fuente de ingresos. En segundo lugar, aumenta significativamente la tasa de conversión y retención de clientes. Al generar ofertas personalizadas y contextualmente relevantes (como un descuento de 'bienvenida de nuevo' a un cliente inactivo), el sistema crea puntos de contacto valiosos que demuestran que el entrenador valora a su clientela, reduciendo el churn. Tercero, proporciona una ventaja competitiva decisiva. Mientras la competencia usa precios fijos, los usuarios de TrainerERP pueden adaptarse dinámicamente al mercado, a las estaciones y al comportamiento individual de cada cliente. Finalmente, automatiza un proceso complejo y estratégico, liberando al entrenador de la tarea de pensar y aplicar manualmente descuentos, permitiéndole centrarse en lo que mejor sabe hacer: entrenar a sus clientes y hacer crecer su negocio.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador personal, quiero crear una regla que ofrezca un 15% de descuento en las sesiones individuales reservadas entre las 10:00 y las 14:00 de lunes a jueves, para poder llenar mis horas valle y aumentar mi facturación diaria.
- Como dueño de un estudio, quiero configurar una oferta automática que envíe un cupón para una 'primera clase de grupo gratis' a los leads que completen un formulario de 'Interés en Bootcamp', para así aumentar la conversión de lead a cliente.
- Como coach online, quiero establecer un precio especial de lanzamiento para mi nuevo programa de 'Transformación de 90 días' que sea válido solo durante la primera semana de enero, para capitalizar la motivación de 'propósitos de año nuevo'.
- Como administrador, quiero que el sistema identifique a los clientes que no han renovado su paquete de sesiones 5 días después de su vencimiento y les envíe automáticamente una oferta de renovación con un 10% de descuento, para reducir el churn proactivamente.
- Como entrenador de grupos pequeños, quiero que el precio de las últimas 2 plazas de mi clase de 'HIIT Intenso' aumente un 10%, para crear un sentido de urgencia y maximizar los ingresos de las clases más populares.
## Acciones Clave
- Crear una nueva regla de precios dinámicos desde una plantilla o desde cero.
- Editar las condiciones (triggers), acciones (descuentos/precios) y segmentos de audiencia de una regla existente.
- Activar y desactivar reglas con un solo clic para gestionar campañas estacionales.
- Visualizar un dashboard con el rendimiento de cada regla (ofertas generadas, conversiones, ingresos adicionales).
- Utilizar el 'Simulador de Precios' para probar cómo afectará una nueva regla a un servicio o cliente específico antes de activarla.
- Establecer la prioridad entre reglas para resolver conflictos (ej: si un cliente cumple los requisitos para dos ofertas, cuál se aplica).
## 🧩 Componentes React Sugeridos
### 1. DynamicPricingDashboardContainer
Tipo: container | Componente principal que orquesta la página. Utiliza el hook 'useDynamicPricingRules' para obtener los datos y gestionar el estado global de las reglas, pasando la información a los componentes de presentación.
Estados: rules: DynamicPricingRule[], isLoading: boolean, error: Error | null, isRuleBuilderOpen: boolean, selectedRuleForEdit: DynamicPricingRule | null
Dependencias: useDynamicPricingRules (custom hook)
Ejemplo de uso:
```typescript
<DynamicPricingDashboardContainer />
```

### 2. RuleBuilderForm
Tipo: presentational | Formulario complejo y modular para crear o editar una regla. Contiene selectores para condiciones (triggers), acciones y audiencias, mostrando campos relevantes de forma condicional.
Props:
- initialRuleData: 
- Partial<DynamicPricingRule> (opcional) - Datos de una regla existente para poblar el formulario en modo de edición.
- onSubmit: 
- (ruleData: DynamicPricingRule) => void (requerido) - Función callback que se ejecuta al enviar el formulario con los datos validados de la regla.
- onCancel: 
- () => void (requerido) - Función callback para cerrar el formulario.
Estados: ruleName: string, conditions: Condition[], action: Action, targetAudience: Audience
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<RuleBuilderForm onSubmit={handleCreateRule} onCancel={() => setIsModalOpen(false)} />
```

### 3. RuleListItem
Tipo: presentational | Componente que renderiza una fila en la lista de reglas. Muestra el nombre, un resumen de la condición/acción, un interruptor para activar/desactivar y botones de acción (editar, eliminar, duplicar).
Props:
- rule: 
- DynamicPricingRule (requerido) - El objeto completo de la regla a mostrar.
- onToggleStatus: 
- (ruleId: string, isActive: boolean) => void (requerido) - Callback para cambiar el estado activo/inactivo de la regla.
- onEdit: 
- (rule: DynamicPricingRule) => void (requerido) - Callback para abrir el modo de edición para esta regla.
Dependencias: SwitchComponent (UI Library)
Ejemplo de uso:
```typescript
<RuleListItem rule={myRule} onToggleStatus={handleToggle} onEdit={handleEdit} />
```

### 4. useDynamicPricingRules
Tipo: hook | Hook personalizado que encapsula toda la lógica de comunicación con la API para las reglas de precios. Proporciona métodos para leer, crear, actualizar y eliminar reglas, manejando el estado de carga y errores.
Estados: Provee estado de 'rules', 'isLoading', 'error' al componente que lo usa.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { rules, createRule, isLoading } = useDynamicPricingRules();
```
## 🔌 APIs Requeridas
### 1. GET /api/monetization/dynamic-rules
Obtiene todas las reglas de precios dinámicos creadas por el entrenador autenticado.
Respuesta:
Tipo: array
Estructura: Array de objetos 'DynamicPricingRule'. Cada objeto contiene id, nombre, prioridad, isActive, conditions, action y targetAudience.
```json
[
  {
    "id": "rule_123",
    "name": "Descuento Horas Valle",
    "isActive": true,
    "priority": 10,
    "conditions": {
      "type": "time_of_day",
      "from": "10:00",
      "to": "14:00",
      "days": [
        1,
        2,
        3,
        4
      ]
    },
    "action": {
      "type": "percentage_discount",
      "value": 15
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se proporcionó.

### 2. POST /api/monetization/dynamic-rules
Crea una nueva regla de precios dinámicos.
Parámetros:
- ruleData (
- object, body, requerido): Objeto JSON con la definición completa de la nueva regla.
Respuesta:
Tipo: object
Estructura: El objeto de la regla recién creada, incluyendo su nuevo ID.
```json
{
  "id": "rule_456",
  "name": "Oferta Reactivación",
  "isActive": false,
  "priority": 20,
  "conditions": {
    "type": "client_inactivity",
    "days": 30
  },
  "action": {
    "type": "fixed_discount",
    "value": 20,
    "currency": "EUR"
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos de la regla son inválidos o incompletos (ej. falta una condición).
- 402: 
- Payment Required - El plan del entrenador no incluye la funcionalidad de precios dinámicos.

### 3. PUT /api/monetization/dynamic-rules/{ruleId}
Actualiza una regla de precios dinámicos existente.
Parámetros:
- ruleId (
- string, path, requerido): El ID de la regla a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos de la regla que se desean modificar.
Respuesta:
Tipo: object
Estructura: El objeto completo de la regla actualizada.
```json
{
  "id": "rule_123",
  "name": "Descuento Horas Valle (Actualizado)",
  "isActive": true,
  "priority": 10,
  "action": {
    "type": "percentage_discount",
    "value": 20
  }
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna regla con el ID proporcionado.
- 403: 
- Forbidden - El usuario no tiene permisos para modificar esta regla.

### 4. POST /api/monetization/simulate-price
Calcula el precio final de un servicio para un contexto específico, aplicando las reglas de precios dinámicos activas. Esencial para la funcionalidad de 'Simulador'.
Parámetros:
- simulationContext (
- object, body, requerido): Contexto para la simulación, incluyendo ID del servicio, ID del cliente (opcional), y fecha/hora deseadas.
Respuesta:
Tipo: object
Estructura: Objeto con el precio original, el precio final, el descuento aplicado y la regla que se activó.
```json
{
  "originalPrice": 100,
  "finalPrice": 85,
  "discountAmount": 15,
  "appliedRuleId": "rule_123",
  "appliedRuleName": "Descuento Horas Valle"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan datos en el contexto de la simulación (ej. serviceId).
## Notas Técnicas
Colecciones backend: dynamicPricingRules, generatedOffers, clientSegments, serviceCatalog, bookingHistory, clientProfiles
KPIs visibles: Ingresos Adicionales Atribuidos (suma de ventas con ofertas aplicadas vs. precio original), Tasa de Conversión de Ofertas (ofertas utilizadas / ofertas presentadas), Ratio de Ocupación en Horas Valle (comparativa antes/después de activar reglas de horario), Tasa de Reactivación de Clientes Inactivos (porcentaje de clientes churn que vuelven a comprar con una oferta), Reducción de Carritos Abandonados (si se aplica una oferta de 'salida' cuando un cliente está a punto de abandonar la compra), Coste de Adquisición por Oferta (para ofertas enfocadas en nuevos leads)
## Documentación Completa
## Resumen
El sistema de **Precios Dinámicos y Ofertas Inteligentes** es una herramienta estratégica dentro del área de **MONETIZACIÓN & OFERTAS** de TrainerERP. Su propósito es dotar a los entrenadores y centros de fitness de la capacidad de automatizar su estrategia de precios para maximizar ingresos, ocupación y retención de clientes. A través de un motor de reglas personalizable, el sistema ajusta el coste de servicios (sesiones, planes, bootcamps) en tiempo real basándose en un conjunto de condiciones predefinidas por el usuario. Estas condiciones pueden incluir la hora del día, la estacionalidad, el comportamiento histórico del cliente, su nivel de compromiso, o la demanda actual de un servicio. Esta funcionalidad transforma la fijación de precios de un modelo estático y manual a uno dinámico, inteligente y proactivo, convirtiéndose en una palanca clave para el crecimiento del negocio.
## Flujo paso a paso de uso real
Un entrenador, llamémosle Álex, quiere aumentar la ocupación de sus mañanas, que suelen estar más vacías.
1. **Acceso a la Funcionalidad**: Álex navega desde su Dashboard principal a `Monetización > Precios Dinámicos`.
2. **Creación de la Regla**: Ve una lista vacía y hace clic en "Crear Nueva Regla". Se abre el constructor de reglas.
3. **Definición Básica**: Nombra la regla como "Descuento Mañanero" y le asigna una prioridad de 10 (un número bajo indica alta prioridad).
4. **Configuración de la Condición (Trigger)**:
* En la sección "SI...", Álex selecciona el tipo de condición: "Fecha y Hora".
* Se despliegan opciones específicas. Selecciona los días "Lunes, Martes, Miércoles, Jueves".
* Establece el rango horario: desde las "10:00" hasta las "14:00".
5. **Configuración de la Acción**:
* En la sección "ENTONCES...", selecciona el tipo de acción: "Aplicar Descuento Porcentual".
* Introduce el valor: `20` (para un 20%).
* A continuación, especifica a qué servicios se aplica. Selecciona su "Sesión de Entrenamiento Personal 1-a-1".
6. **Definición de la Audiencia (Opcional)**: En este caso, Álex quiere que se aplique a "Todos los clientes", así que deja la configuración por defecto.
7. **Simulación y Verificación**: Antes de guardar, Álex hace clic en el botón "Simular Precio".
* Abre un modal donde selecciona el servicio "Sesión de Entrenamiento Personal 1-a-1".
* Elige una fecha y hora, por ejemplo, un miércoles a las 11:00.
* El simulador muestra: `Precio Original: 60€, Regla Aplicada: 'Descuento Mañanero', Precio Final: 48€`.
* Satisfecho, cierra el simulador.
8. **Activación**: Álex guarda la regla y se asegura de que el interruptor de "Activa" esté encendido. La regla ahora está operativa.
Ahora, cuando un cliente entre en la web de reservas de Álex y seleccione una sesión el miércoles a las 11:00, TrainerERP le mostrará automáticamente el precio de 48€ en lugar de 60€.
## Riesgos operativos y edge cases
* **Canibalización de ingresos**: Si una regla es demasiado generosa (ej. un descuento muy alto en un horario que ya tenía cierta demanda), podría reducir los ingresos en lugar de aumentarlos. Es crucial analizar los datos antes de crear reglas.
* **Conflicto de reglas**: Un cliente podría cumplir las condiciones de múltiples ofertas. El campo `prioridad` es vital. El sistema debe evaluar las reglas en orden de prioridad y aplicar solo la primera que coincida. Se debe educar al usuario sobre cómo usar este campo eficazmente.
* **Percepción de justicia del cliente**: Si dos clientes hablan y descubren que pagaron precios muy diferentes por el mismo servicio, podría generar descontento. Las reglas deben ser lógicas y defendibles (ej. descuentos por reserva anticipada, horas valle, lealtad). Evitar reglas que parezcan arbitrarias.
* **Complejidad abrumadora**: Un exceso de reglas puede hacer que el sistema sea difícil de gestionar y depurar. Se recomienda empezar con 2-3 reglas simples y medir su impacto antes de añadir más complejidad.
* **Errores en la configuración**: Un error tipográfico (ej. 50% de descuento en lugar de 5%) puede ser catastrófico. La interfaz debe tener validaciones y el simulador es una herramienta clave de mitigación.
## KPIs y qué significan
* **Ingresos Adicionales Atribuidos**: Mide el valor monetario directo de esta funcionalidad. Se calcula como `(Ventas con oferta * Precio original) - (Ventas con oferta * Precio con oferta)`. Un valor positivo alto indica que las ofertas están incentivando ventas que de otro modo no ocurrirían.
* **Tasa de Conversión de Ofertas**: `(Nº de compras con oferta / Nº de veces que se mostró la oferta) * 100`. Este KPI mide la efectividad de la oferta en sí misma. Una tasa baja puede indicar que el descuento no es suficientemente atractivo o que la condición no es la adecuada.
* **Ratio de Ocupación en Horas Valle**: `(Horas reservadas en franja valle / Horas totales disponibles en franja valle) * 100`. Es el principal indicador para medir el éxito de las reglas basadas en el tiempo. Se debe comparar el valor antes y después de activar la regla.
* **Tasa de Reactivación de Clientes**: `(Clientes inactivos que compran con oferta / Total de clientes inactivos a los que se les ofreció) * 100`. Mide la eficacia de las campañas de retención para reducir el churn.
## Diagramas de Flujo (Mermaid)
**Lógica de Evaluación de Precio para una Reserva**
mermaid
flowchart TD
A[Inicio: Cliente solicita precio para un servicio] --> B{Obtener todas las reglas ACTIVAS para este entrenador};
B --> C{Ordenar reglas por PRIORIDAD (menor a mayor)};
C --> D{Iterar por cada regla};
D --> E{¿El contexto actual (cliente, servicio, fecha) cumple las CONDICIONES de la regla?};
E -- Sí --> F[Aplicar la ACCIÓN de la regla (ej. descuento)];
F --> G[Devolver Precio Final Calculado];
E -- No --> H{¿Hay más reglas en la lista?};
H -- Sí --> D;
H -- No --> I[Devolver Precio Original del Servicio];
G --> J[Fin];
I --> J[Fin];
