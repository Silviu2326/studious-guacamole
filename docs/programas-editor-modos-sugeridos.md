# Modos Sugeridos para BatchTrainingModal

## Modos Actuales
1. **Añadir rutinas predefinidas** - Aplica rutinas de la biblioteca a múltiples días
2. **Mover o copiar bloques entre días** - Reorganiza bloques de un día a otro
3. **Añadir/quitar tags en lote** - Gestiona tags masivamente
4. **Modificar métricas en lote** - Cambia intensidad, series, repeticiones, peso, tempo, descanso

---

## Modos Sugeridos (Priorizados)

### 🔥 ALTA PRIORIDAD

#### 1. **Duplicar/Clonar Semanas Completas**
**Descripción**: Duplica una semana completa a otra(s) semana(s) con opciones de variación automática.

**Argumentación**:
- **Eficiencia**: Los entrenadores suelen crear programas de 4-8 semanas con estructuras similares. Duplicar una semana base y luego ajustar es mucho más rápido que crear desde cero.
- **Consistencia**: Garantiza que la estructura semanal se mantenga coherente entre semanas.
- **Variación controlada**: Permite aplicar variaciones automáticas (progresión de carga, cambio de ejercicios, ajuste de intensidad) al duplicar.

**Casos de uso**:
- Crear un mesociclo de 4 semanas duplicando la semana 1 con progresiones
- Replicar una semana de deload en múltiples puntos del programa
- Clonar una semana exitosa para otro cliente con ajustes mínimos

**Funcionalidades**:
- Seleccionar semana origen (1-4)
- Seleccionar semanas destino
- Opciones de variación:
  - Progresión automática de carga (+5%, +10%, etc.)
  - Rotación de ejercicios similares
  - Ajuste de intensidad (RPE +0.5, +1, etc.)
  - Mantener estructura exacta

---

#### 2. **Balance de Grupos Musculares**
**Descripción**: Analiza y ajusta automáticamente el balance entre grupos musculares a lo largo de la semana.

**Argumentación**:
- **Prevención de desequilibrios**: Los entrenadores necesitan asegurar que todos los grupos musculares reciban atención adecuada. Es fácil olvidar grupos o sobrecargar otros.
- **Análisis visual**: Muestra un dashboard con distribución actual vs. objetivo por grupo muscular.
- **Corrección automática**: Sugiere y aplica ajustes para balancear el volumen.

**Casos de uso**:
- Detectar que se está entrenando demasiado tren superior vs. inferior
- Asegurar que grupos pequeños (hombros, bíceps) no se descuiden
- Balancear trabajo de empuje vs. tracción
- Corregir desequilibrios detectados por el análisis

**Funcionalidades**:
- Dashboard de análisis:
  - Volumen por grupo muscular (series, repeticiones)
  - Distribución de intensidad por grupo
  - Comparación con objetivos/recomendaciones
- Ajustes automáticos:
  - Añadir sesiones para grupos sub-entrenados
  - Reducir volumen de grupos sobre-entrenados
  - Sugerir redistribución de bloques

---

#### 3. **Distribución de Intensidad Semanal**
**Descripción**: Visualiza y ajusta la distribución de intensidades (RPE, carga) a lo largo de la semana para optimizar la recuperación.

**Argumentación**:
- **Periodización**: La distribución correcta de intensidad es clave para la periodización efectiva. Demasiados días altos seguidos causan fatiga; demasiados días bajos no maximizan el progreso.
- **Prevención de sobreentrenamiento**: Ayuda a identificar patrones problemáticos (ej: 3 días consecutivos de alta intensidad).
- **Optimización de recuperación**: Sugiere redistribuciones para mejorar la recuperación entre sesiones.

**Casos de uso**:
- Detectar semanas con demasiados días de alta intensidad
- Asegurar días de recuperación adecuados entre sesiones pesadas
- Crear patrones de intensidad (ondulante, lineal, etc.)
- Ajustar intensidades para adaptarse a objetivos del cliente

**Funcionalidades**:
- Gráfico de intensidad semanal (día por día)
- Alertas de patrones problemáticos:
  - Días consecutivos de alta intensidad
  - Falta de días de recuperación
  - Distribución desequilibrada
- Ajustes automáticos:
  - Redistribuir intensidades
  - Añadir días de recuperación
  - Aplicar plantillas de periodización (ondulante, lineal, etc.)

---

### 🟡 MEDIA PRIORIDAD

#### 4. **Aplicar Plantillas de Estructura Semanal**
**Descripción**: Aplica plantillas de estructura semanal comunes (Upper/Lower, Push/Pull/Legs, Full Body, etc.) a la semana actual.

**Argumentación**:
- **Rapidez**: Los entrenadores suelen usar estructuras probadas. Aplicar una plantilla base y luego personalizar es más eficiente.
- **Consistencia**: Garantiza que la estructura semanal siga principios de periodización conocidos.
- **Educación**: Ayuda a entrenadores menos experimentados a usar estructuras efectivas.

**Casos de uso**:
- Convertir una semana libre en Upper/Lower split
- Aplicar estructura Push/Pull/Legs a una semana
- Crear semanas de Full Body para principiantes
- Aplicar estructuras especializadas (ej: Powerlifting, Bodybuilding)

**Funcionalidades**:
- Plantillas predefinidas:
  - Upper/Lower (2 días)
  - Push/Pull/Legs (3 días)
  - Full Body (3-4 días)
  - Upper/Lower/Upper/Lower (4 días)
  - Personalizadas por el usuario
- Opciones:
  - Reemplazar estructura actual o añadir a existente
  - Mantener bloques específicos
  - Ajustar intensidades según plantilla

---

#### 5. **Progresión Automática Semana a Semana**
**Descripción**: Aplica progresiones automáticas de carga, volumen o intensidad a través de múltiples semanas.

**Argumentación**:
- **Principio de sobrecarga progresiva**: Fundamental en periodización. Aplicar progresiones manualmente semana a semana es tedioso y propenso a errores.
- **Consistencia**: Asegura que las progresiones se apliquen de forma sistemática.
- **Flexibilidad**: Permite diferentes tipos de progresión (lineal, ondulante, escalonada).

**Casos de uso**:
- Aumentar carga 5% cada semana durante 4 semanas
- Progresar de 3x8 a 3x10 a 3x12 en repeticiones
- Aumentar RPE de 7 a 7.5 a 8 semana a semana
- Aplicar deload en semana 4 (reducir carga 20%)

**Funcionalidades**:
- Seleccionar semanas objetivo
- Tipo de progresión:
  - Lineal (aumento constante)
  - Ondulante (sube/baja)
  - Escalonada (aumentos grandes cada X semanas)
  - Deload (reducción programada)
- Métricas a progresar:
  - Peso (% o kg)
  - Repeticiones
  - Series
  - RPE/Intensidad
  - Descanso
- Filtros:
  - Solo bloques de fuerza
  - Solo ejercicios específicos
  - Por grupo muscular

---

#### 6. **Sincronizar Estructura entre Semanas**
**Descripción**: Copia la estructura (tipos de bloques, distribución) de una semana a otra(s) manteniendo o variando el contenido.

**Argumentación**:
- **Consistencia estructural**: Mantiene la misma distribución de tipos de entrenamiento entre semanas mientras permite variar ejercicios.
- **Eficiencia**: Más rápido que recrear la estructura manualmente.
- **Variación controlada**: Permite mantener estructura pero cambiar ejercicios/especificidad.

**Casos de uso**:
- Semana 2-4 con misma estructura que semana 1 pero diferentes ejercicios
- Mantener días de fuerza pero rotar ejercicios
- Replicar distribución de modalidades (Strength, MetCon, Mobility) con contenido nuevo

**Funcionalidades**:
- Seleccionar semana origen
- Seleccionar semanas destino
- Opciones:
  - Copiar estructura exacta (mismos bloques)
  - Copiar solo distribución de modalidades
  - Mantener bloques específicos (ej: siempre Mobility los lunes)
  - Variar ejercicios pero mantener estructura

---

### 🟢 BAJA PRIORIDAD (pero útiles)

#### 7. **Análisis y Ajuste de Volumen Total**
**Descripción**: Analiza el volumen total (series x repeticiones x peso) por grupo muscular y sugiere ajustes.

**Argumentación**:
- **Ciencia del entrenamiento**: El volumen total es una métrica clave. Demasiado volumen causa sobreentrenamiento; muy poco limita el progreso.
- **Optimización**: Ayuda a encontrar el volumen óptimo para cada cliente.
- **Prevención**: Detecta semanas con volumen excesivo antes de que cause problemas.

**Funcionalidades**:
- Dashboard de volumen:
  - Volumen total por grupo muscular
  - Comparación con objetivos/recomendaciones
  - Tendencias semana a semana
- Sugerencias:
  - Reducir volumen si es excesivo
  - Aumentar volumen si es insuficiente
  - Redistribuir volumen entre días

---

#### 8. **Exportar/Importar Bloques o Semanas**
**Descripción**: Exporta bloques o semanas completas para reutilizar en otros programas o compartir.

**Argumentación**:
- **Reutilización**: Los entrenadores crean bloques/semanas que funcionan bien y quieren reutilizarlos.
- **Colaboración**: Permite compartir estructuras entre entrenadores.
- **Biblioteca personal**: Crea una biblioteca de semanas/bloques probados.

**Funcionalidades**:
- Exportar:
  - Semana completa
  - Bloques seleccionados
  - Con o sin métricas
- Importar:
  - Desde archivo
  - Desde biblioteca personal
  - Desde otros programas del mismo entrenador

---

#### 9. **Comparar Semanas o Programas**
**Descripción**: Compara dos semanas o programas lado a lado para identificar diferencias y similitudes.

**Argumentación**:
- **Análisis**: Útil para comparar diferentes versiones de un programa o programas de diferentes clientes.
- **Aprendizaje**: Ayuda a entender qué funciona mejor comparando programas exitosos.
- **Debugging**: Identifica cambios accidentales entre versiones.

**Funcionalidades**:
- Seleccionar dos semanas/programas
- Vista comparativa:
  - Diferencias resaltadas
  - Métricas comparadas
  - Distribución de modalidades
- Opciones:
  - Copiar diferencias de una a otra
  - Exportar comparación

---

#### 10. **Aplicar Reglas de Periodización**
**Descripción**: Aplica reglas de periodización comunes (ej: 3 semanas de carga, 1 de deload) automáticamente.

**Argumentación**:
- **Best practices**: Implementa principios de periodización probados automáticamente.
- **Consistencia**: Asegura que la periodización se aplique correctamente.
- **Educación**: Enseña a entrenadores menos experimentados sobre periodización.

**Funcionalidades**:
- Plantillas de periodización:
  - 3:1 (3 semanas carga, 1 deload)
  - 4:1
  - Ondulante diario
  - Lineal
  - Personalizadas
- Aplicación automática de:
  - Ajustes de volumen
  - Ajustes de intensidad
  - Días de recuperación
  - Deloads programados

---

## Priorización Recomendada

### Fase 1 (Implementar primero):
1. **Duplicar/Clonar Semanas Completas** - Alto impacto, uso frecuente
2. **Balance de Grupos Musculares** - Previene problemas comunes
3. **Distribución de Intensidad Semanal** - Fundamental para periodización

### Fase 2:
4. **Aplicar Plantillas de Estructura Semanal** - Útil para muchos usuarios
5. **Progresión Automática Semana a Semana** - Ahorra mucho tiempo
6. **Sincronizar Estructura entre Semanas** - Complementa duplicación

### Fase 3 (Si hay demanda):
7-10. Modos de análisis y utilidades avanzadas

---

## Consideraciones de Implementación

### UX/UI:
- Mantener consistencia con modos actuales
- Previsualización antes de aplicar cambios
- Confirmación para acciones destructivas
- Historial de cambios (undo/redo)

### Rendimiento:
- Optimizar cálculos para programas grandes (4+ semanas)
- Lazy loading de análisis pesados
- Caché de resultados de análisis

### Validación:
- Validar que los cambios no rompan la estructura del programa
- Alertas para cambios que puedan causar problemas
- Opciones de "dry run" (simulación sin aplicar)





