# Documentación de Integración - API Mock de Transacciones Bancarias

## Resumen

Este documento describe cómo se integran los componentes de transacciones bancarias con el sistema de gestión de gastos deducibles y el dashboard financiero.

## Componentes Principales

### 1. API de Transacciones Bancarias (`api/bankTransactions.ts`)

#### Funciones Principales

##### `importBankTransactions(csvRows: any[], bankAccountId: string): Promise<BankTransaction[]>`

Importa transacciones bancarias desde filas CSV parseadas.

**Parámetros:**
- `csvRows`: Array de objetos parseados del CSV (filas con columnas mapeadas)
- `bankAccountId`: ID de la cuenta bancaria asociada

**Ejemplo de uso:**
```typescript
const csvRows = [
  { fecha: '01/01/2024', concepto: 'Compra Amazon', importe: '150.00' },
  { fecha: '02/01/2024', concepto: 'Pago cliente', importe: '500.00' }
];
const transactions = await importBankTransactions(csvRows, 'account-123');
```

**Características:**
- Usa el parser de CSV para normalizar los datos
- Aplica categorización automática según la descripción
- Detecta y omite duplicados automáticamente
- Crea transacciones con IDs únicos

##### `getBankTransactions(filtros?: BankTransactionFilters): Promise<BankTransaction[]>`

Obtiene transacciones bancarias con filtros opcionales.

**Filtros disponibles:**
- `bankAccountId`: Filtrar por cuenta bancaria
- `from`: Fecha de inicio
- `to`: Fecha de fin
- `tipo`: Tipo de transacción (ingreso, gasto, etc.)
- `conciliada`: Estado de conciliación (true = solo conciliadas, false = solo no conciliadas)

**Ejemplo de uso:**
```typescript
// Obtener todas las transacciones
const todas = await getBankTransactions();

// Filtrar por cuenta y rango de fechas
const filtradas = await getBankTransactions({
  bankAccountId: 'account-123',
  from: new Date('2024-01-01'),
  to: new Date('2024-12-31')
});

// Solo transacciones no conciliadas
const pendientes = await getBankTransactions({ conciliada: false });
```

##### `conciliarTransaccion(transactionId: string, expenseId: string): Promise<BankTransaction>`

Concilia una transacción bancaria con un gasto deducible.

**Ejemplo de uso:**
```typescript
const transaction = await conciliarTransaccion('bank-txn-123', 'expense-456');
console.log(transaction.conciliada); // true
console.log(transaction.expenseIdRelacionadoOpcional); // 'expense-456'
```

##### `detectarDuplicados(transacciones: BankTransaction[]): BankTransaction[]`

Detecta posibles transacciones duplicadas.

**Criterios de detección:**
- Misma fecha (mismo día)
- Mismo importe (con tolerancia de 0.01)
- Descripción similar (contiene palabras clave comunes)

**Ejemplo de uso:**
```typescript
const transacciones = await getBankTransactions();
const duplicados = detectarDuplicados(transacciones);
console.log(`Se encontraron ${duplicados.length} posibles duplicados`);
```

### 2. Parser CSV (`utils/csvParser.ts`)

#### Funciones Principales

##### `parseCSVText(csvText: string, delimiter?: string): Record<string, any>[]`

Parsea texto CSV y devuelve un array de objetos normalizados.

**Características:**
- Detecta automáticamente el delimitador (coma o punto y coma)
- Maneja encabezados y separadores configurables
- Soporta campos entre comillas

**Ejemplo de uso:**
```typescript
const csvText = `fecha,concepto,importe
01/01/2024,Compra Amazon,150.00
02/01/2024,Pago cliente,500.00`;

const rows = parseCSVText(csvText);
// Resultado: [
//   { fecha: '01/01/2024', concepto: 'Compra Amazon', importe: '150.00' },
//   { fecha: '02/01/2024', concepto: 'Pago cliente', importe: '500.00' }
// ]
```

##### `mapCSVToTransactions(rows: Record<string, any>[], mapping: CSVColumnMapping, dateFormat?: string): BankTransaction[]`

Mapea las filas del CSV a transacciones bancarias usando el mapeo de columnas.

##### `suggestCategory(concepto: string, importe: number, tipo: 'ingreso' | 'egreso')`

Sugiere categorías para transacciones basándose en palabras clave y patrones conocidos.

**Lógica de categorización automática:**
- **Amazon Prime/AWS** → `software` (confianza: 0.95)
- **Amazon (general)** → `materiales` (confianza: 0.85)
- **Netflix, Spotify, Adobe, Microsoft** → `software` (confianza: 0.9)
- **Facebook, Instagram, LinkedIn** → `marketing` (confianza: 0.9)
- **Uber, Taxi, Parking** → `transporte` (confianza: 0.9)
- **Certificaciones, NASM, ACE** → `certificaciones` (confianza: 0.85)
- **Decathlon, Nike, Adidas** → `equipamiento` (confianza: 0.85)

## Integración con Componentes

### 1. BankCSVImport.tsx

**Flujo de integración:**

1. **Carga del archivo CSV:**
   ```typescript
   const result = await parseCSV(selectedFile);
   setParseResult(result);
   ```

2. **Mapeo de columnas:**
   - El usuario mapea las columnas del CSV a los campos del sistema
   - Se guarda la configuración para futuros imports

3. **Previsualización:**
   ```typescript
   const transactions = mapCSVToTransactions(parseResult.rows, mapping);
   const existingTransactions = await getBankTransactions();
   // Detectar duplicados y sugerir categorías
   ```

4. **Importación:**
   ```typescript
   // En el componente actual, se usa importBankTransactions(transactions)
   // Pero la nueva API espera: importBankTransactions(csvRows, bankAccountId)
   // Necesita actualización para usar la nueva firma
   ```

**Nota:** El componente `BankCSVImport.tsx` necesita una pequeña actualización para usar la nueva firma de `importBankTransactions` que recibe `csvRows` y `bankAccountId` en lugar de `BankTransaction[]`.

**Actualización sugerida:**
```typescript
// Antes:
const result = await importBankTransactions(transactionsToImport);

// Después:
const result = await importBankTransactions(
  parseResult.rows.filter((_, idx) => !previewTransactions[idx].isDuplicate),
  'account-id-aqui' // Obtener del contexto/usuario
);
```

### 2. GestorGastosDeducibles.tsx

**Flujo de integración:**

1. **Crear gastos desde transacciones bancarias:**
   ```typescript
   // Las transacciones importadas con categoría automática
   // pueden crear gastos deducibles automáticamente
   // Esto se hace en importBankTransactions cuando:
   // - transactionType === 'gasto'
   // - categoriaSugeridaOpcional está definida
   ```

2. **Conciliar transacciones con gastos existentes:**
   ```typescript
   // Desde el componente, se puede llamar a:
   await conciliarTransaccion(transactionId, expenseId);
   ```

3. **Visualizar transacciones no conciliadas:**
   ```typescript
   const pendientes = await getBankTransactions({ conciliada: false });
   // Mostrar en la UI para que el usuario las concilie manualmente
   ```

**Funcionalidades futuras:**
- Botón para crear gasto desde transacción bancaria
- Vista de transacciones pendientes de conciliación
- Sugerencias automáticas de conciliación basadas en fecha e importe

### 3. FinancialDashboard.tsx

**Flujo de integración:**

1. **Obtener transacciones para el dashboard:**
   ```typescript
   const transacciones = await getBankTransactions({
     from: dashboard.period.from,
     to: dashboard.period.to
   });
   ```

2. **Mostrar resumen de transacciones:**
   - Total de ingresos vs gastos
   - Transacciones conciliadas vs no conciliadas
   - Categorización automática aplicada

3. **Alertas y notificaciones:**
   ```typescript
   // Alertar sobre transacciones no conciliadas
   const noConciliadas = await getBankTransactions({ conciliada: false });
   if (noConciliadas.length > 10) {
     // Mostrar alerta en el dashboard
   }
   ```

## Flujo Completo de Importación

```
1. Usuario sube CSV → parseCSV()
2. Sistema detecta columnas → autoDetectColumns()
3. Usuario mapea columnas → CSVColumnMapping
4. Sistema previsualiza → mapCSVToTransactions() + suggestCategory()
5. Usuario revisa y confirma
6. Sistema importa → importBankTransactions(csvRows, bankAccountId)
7. Sistema categoriza automáticamente → suggestCategory()
8. Sistema detecta duplicados → detectarDuplicados()
9. Transacciones disponibles en el sistema
10. Usuario puede conciliar → conciliarTransaccion()
11. Transacciones aparecen en FinancialDashboard
```

## Categorización Automática

### Patrones Específicos (Alta Confianza)

| Patrón | Categoría | Confianza |
|--------|-----------|-----------|
| Amazon Prime/AWS | software | 0.95 |
| Amazon (general) | materiales | 0.85 |
| Netflix, Spotify, Adobe | software | 0.9 |
| Facebook, Instagram Ads | marketing | 0.9 |
| Uber, Taxi, Parking | transporte | 0.9 |
| Certificaciones, NASM | certificaciones | 0.85 |
| Decathlon, Nike, Adidas | equipamiento | 0.85 |

### Palabras Clave Generales

Cada categoría tiene un conjunto de palabras clave que se buscan en la descripción de la transacción. La confianza se calcula basándose en el número de coincidencias.

## Mejoras Futuras

1. **Aprendizaje automático:**
   - Guardar decisiones del usuario sobre categorización
   - Mejorar sugerencias basándose en historial

2. **Conciliación automática:**
   - Sugerir conciliaciones basadas en fecha e importe
   - Matching inteligente entre transacciones y gastos

3. **Integración con APIs bancarias:**
   - Conectar directamente con APIs de bancos
   - Importación automática periódica

4. **Validación mejorada:**
   - Validar formato de fechas según país
   - Validar importes según moneda

## Notas Técnicas

- **Almacenamiento:** Actualmente en memoria (mock). En producción, usar base de datos.
- **IDs:** Se generan con timestamp + índice + random para garantizar unicidad.
- **Duplicados:** Se detectan por fecha (mismo día), importe (tolerancia 0.01) y descripción similar.
- **Categorización:** Se aplica solo a egresos. Los ingresos no requieren categoría.

## Ejemplos de Uso Completo

### Ejemplo 1: Importar CSV y crear gastos automáticamente

```typescript
// 1. Parsear CSV
const csvText = `fecha,concepto,importe
01/01/2024,Compra Amazon Prime,99.99
02/01/2024,Uber viaje,15.50
03/01/2024,Certificación NASM,500.00`;

const rows = parseCSVText(csvText);

// 2. Importar transacciones
const transactions = await importBankTransactions(rows, 'account-123');

// 3. Las transacciones ya están categorizadas:
// - Amazon Prime → software
// - Uber → transporte
// - Certificación NASM → certificaciones

// 4. Obtener transacciones no conciliadas
const pendientes = await getBankTransactions({ 
  bankAccountId: 'account-123',
  conciliada: false 
});
```

### Ejemplo 2: Conciliar transacción con gasto

```typescript
// 1. Obtener transacciones pendientes
const pendientes = await getBankTransactions({ conciliada: false });

// 2. Usuario selecciona una transacción y un gasto
const transaction = pendientes[0];
const expense = await expensesAPI.obtenerGastos()[0];

// 3. Conciliar
const conciliada = await conciliarTransaccion(transaction.id, expense.id);

// 4. Verificar
console.log(conciliada.conciliada); // true
console.log(conciliada.expenseIdRelacionadoOpcional); // expense.id
```

### Ejemplo 3: Detectar duplicados

```typescript
// 1. Obtener todas las transacciones
const todas = await getBankTransactions();

// 2. Detectar duplicados
const duplicados = detectarDuplicados(todas);

// 3. Mostrar al usuario
if (duplicados.length > 0) {
  console.warn(`Se encontraron ${duplicados.length} posibles duplicados`);
  duplicados.forEach(dup => {
    console.log(`- ${dup.descripcion} - ${dup.importe}€ - ${dup.fecha}`);
  });
}
```

