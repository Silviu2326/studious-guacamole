# Cambios Necesarios para Integrar las User Stories

## Resumen de Implementación

Se han creado los siguientes archivos y funcionalidades:

### 1. Tipos Extendidos (`types/index.ts`)
- ✅ Añadido campo `dia` opcional a `Comida`
- ✅ Añadido `DistribucionBloquesDia` para gestionar bloques por día
- ✅ Añadido `IndicadorAdherenciaDia` para indicadores de adherencia
- ✅ Añadidos campos `distribucionBloques` e `indicadoresAdherencia` a `Dieta`

### 2. Utilidades Creadas
- ✅ `utils/distribucionBloques.ts` - Funciones para añadir/quitar bloques y ajustar macros
- ✅ `utils/adherenciaPrevista.ts` - Funciones para calcular adherencia prevista

### 3. Componentes Creados
- ✅ `components/GestorBloquesDia.tsx` - Componente para gestionar bloques por día
- ✅ `components/IndicadorAdherenciaDia.tsx` - Componente para mostrar indicadores de adherencia

## Cambios Pendientes en DietaEditorPage.tsx

### 1. Añadir Imports (línea ~8-9)
```typescript
import { GestorBloquesDia, IndicadorAdherenciaDia } from '../components';
import { añadirBloqueDia, quitarBloqueDia, calcularMacrosActualesDia, getMacrosObjetivoDia, getBloquesActivosDia } from '../utils/distribucionBloques';
import { calcularIndicadoresAdherencia, getIndicadorAdherenciaDia } from '../utils/adherenciaPrevista';
import type { TipoComida as TipoComidaType } from '../types';
```

### 2. Añadir Imports de Iconos (línea ~48)
```typescript
  LayoutGrid,
  List,
```

### 3. Añadir Estados (después de línea ~439)
```typescript
  const [cargandoAdherencia, setCargandoAdherencia] = useState(false);
  const [vistaSemanalTipo, setVistaSemanalTipo] = useState<'board' | 'agenda'>('board');
```

### 4. Añadir useEffect para Cargar Indicadores (después de línea ~472)
```typescript
  // Cargar indicadores de adherencia cuando la dieta cambia
  useEffect(() => {
    const cargarIndicadoresAdherencia = async () => {
      if (!dieta || !dieta.clienteId) return;
      
      setCargandoAdherencia(true);
      try {
        const indicadores = await calcularIndicadoresAdherencia(dieta, dieta.clienteId);
        setDieta(prev => prev ? {
          ...prev,
          indicadoresAdherencia: indicadores,
        } : null);
      } catch (error) {
        console.error('Error cargando indicadores de adherencia:', error);
      } finally {
        setCargandoAdherencia(false);
      }
    };

    cargarIndicadoresAdherencia();
  }, [dieta?.id, dieta?.clienteId]);
```

### 5. Añadir Handlers (después de línea ~972)
```typescript
  // Handler para añadir bloque a un día
  const handleAñadirBloque = useCallback(async (dia: string, tipoBloque: TipoComidaType) => {
    if (!dieta || !dietaId) return;
    
    const dietaActualizada = añadirBloqueDia(dieta, dia, tipoBloque);
    setDieta(dietaActualizada);
    dietaRef.current = dietaActualizada;

    try {
      await guardarComoBorrador(dietaId, dietaActualizada);
      registrarCambioDieta(
        dietaId,
        'actualizacion_comidas',
        `Añadido bloque ${tipoBloque} al ${dia}`,
        [{ campo: 'distribucionBloques', descripcion: `Bloque ${tipoBloque} añadido` }],
        dietaActualizada
      );
    } catch (error) {
      console.error('Error añadiendo bloque:', error);
    }
  }, [dieta, dietaId]);

  // Handler para quitar bloque de un día
  const handleQuitarBloque = useCallback(async (dia: string, tipoBloque: TipoComidaType) => {
    if (!dieta || !dietaId) return;
    
    const dietaActualizada = quitarBloqueDia(dieta, dia, tipoBloque);
    setDieta(dietaActualizada);
    dietaRef.current = dietaActualizada;

    try {
      await guardarComoBorrador(dietaId, dietaActualizada);
      registrarCambioDieta(
        dietaId,
        'actualizacion_comidas',
        `Quitado bloque ${tipoBloque} del ${dia}`,
        [{ campo: 'distribucionBloques', descripcion: `Bloque ${tipoBloque} quitado` }],
        dietaActualizada
      );
    } catch (error) {
      console.error('Error quitando bloque:', error);
    }
  }, [dieta, dietaId]);
```

### 6. Modificar renderVistaSemanal (línea ~1470-1576)

En el map de `diasSemana`, dentro del div de cada día, añadir:

1. **Después del header del día (después de línea ~1481)**, añadir:
```typescript
            {/* Gestor de bloques y indicador de adherencia */}
            {dieta && (
              <div className="space-y-2">
                <GestorBloquesDia
                  dieta={dieta}
                  dia={dia.id}
                  onAñadirBloque={handleAñadirBloque}
                  onQuitarBloque={handleQuitarBloque}
                />
                {getIndicadorAdherenciaDia(dieta, dia.id) && (
                  <IndicadorAdherenciaDia
                    indicador={getIndicadorAdherenciaDia(dieta, dia.id)!}
                    mostrarDetalles={false}
                  />
                )}
              </div>
            )}
```

2. **Modificar el map de bloquesComida** para filtrar solo los bloques activos:
```typescript
            <div className="space-y-3">
              {bloquesComida
                .filter(bloque => {
                  if (!dieta) return true;
                  const bloquesActivos = getBloquesActivosDia(dieta, dia.id);
                  return bloquesActivos.includes(bloque.id as TipoComida);
                })
                .map((bloque) => (
                  // ... resto del código del bloque
                ))}
            </div>
```

3. **Calcular macros del día** antes del map (añadir antes de línea ~1470):
```typescript
        {diasSemana.map((dia) => {
          const macrosDia = dieta ? calcularMacrosActualesDia(dieta, dia.id) : { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
          const objetivoCalorias = dieta ? getMacrosObjetivoDia(dieta, dia.id).calorias : 0;
          const colorCalorias = macrosDia.calorias >= objetivoCalorias * 0.9 && macrosDia.calorias <= objetivoCalorias * 1.1
            ? 'text-emerald-600'
            : macrosDia.calorias < objetivoCalorias * 0.9
            ? 'text-amber-600'
            : 'text-red-600';

          return (
            <div key={dia.id} className="...">
              {/* resto del código */}
            </div>
          );
        })}
```

## Notas

- Los macros se ajustan automáticamente cuando se añaden/quitan bloques
- Los indicadores de adherencia se calculan basándose en feedback histórico simulado
- En producción, la función `obtenerAdherenciaHistoricaPorTipo` debería consultar datos reales de la base de datos

