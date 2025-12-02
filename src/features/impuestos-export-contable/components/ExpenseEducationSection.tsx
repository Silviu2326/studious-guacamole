import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { CATEGORIAS_GASTO, CategoriaGasto } from '../types/expenses';
import { getGuiaGastosDeducibles, GuiaGastosDeducibles } from '../api/api';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  Lightbulb,
  AlertCircle,
  Info,
  Loader2,
  Shield,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

/**
 * Componente educativo tipo centro de ayuda que muestra información sobre
 * gastos deducibles y buenas prácticas fiscales para entrenadores personales.
 * 
 * Características:
 * - Guías cortas sobre qué es un gasto deducible
 * - Listado de categorías típicas y qué se puede deducir en cada una
 * - Advertencias de límites comunes (viajes, dietas, vehículo, etc.)
 * - Buenas prácticas fiscales
 * - Contenido dinámico desde la API (simulado)
 */
export const ExpenseEducationSection: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showChecklist, setShowChecklist] = useState(false);
  const [showIntroduccion, setShowIntroduccion] = useState(true);
  const [showLimites, setShowLimites] = useState(false);
  const [showBuenasPracticas, setShowBuenasPracticas] = useState(false);
  const [guia, setGuia] = useState<GuiaGastosDeducibles | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar guía al montar el componente
  useEffect(() => {
    const cargarGuia = async () => {
      try {
        setLoading(true);
        const datos = await getGuiaGastosDeducibles();
        setGuia(datos);
      } catch (error) {
        console.error('Error al cargar la guía educativa:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarGuia();
  }, []);

  const toggleCategory = (categoriaId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoriaId)) {
      newExpanded.delete(categoriaId);
    } else {
      newExpanded.add(categoriaId);
    }
    setExpandedCategories(newExpanded);
  };

  // Si está cargando, mostrar estado de carga
  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando guía educativa...</p>
        </div>
      </Card>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!guia) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-12 text-center">
          <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">No se pudo cargar la guía educativa.</p>
        </div>
      </Card>
    );
  }

  // Función helper para obtener color según importancia
  const getImportanceColor = (importancia: 'alta' | 'media' | 'baja') => {
    switch (importancia) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'media':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'baja':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  // Datos legacy para mantener compatibilidad mientras se migra
  const ejemplosGastos: Record<CategoriaGasto, {
    ejemplos: string[];
    tips: string[];
    porcentajeDeducible?: string;
  }> = {
    equipamiento: {
      ejemplos: [
        'Pesas, mancuernas y barras',
        'Máquinas de ejercicio (cintas, bicicletas estáticas)',
        'Colchonetas y material de yoga',
        'Material de resistencia (bandas elásticas, kettlebells)',
        'Equipamiento de medición (balanzas, calibradores)'
      ],
      tips: [
        'Guarda las facturas de compra para justificar la inversión',
        'El equipamiento debe ser necesario para tu actividad profesional',
        'Puedes deducir hasta el 100% si es de uso exclusivo profesional'
      ],
      porcentajeDeducible: '100%'
    },
    certificaciones: {
      ejemplos: [
        'Certificaciones profesionales (NASM, ACE, NSCA, etc.)',
        'Cursos de formación continua',
        'Renovaciones de licencias profesionales',
        'Seminarios y workshops especializados',
        'Certificaciones de primeros auxilios'
      ],
      tips: [
        'Las certificaciones deben estar relacionadas con tu actividad',
        'Conserva los certificados y facturas',
        'La formación continua es 100% deducible'
      ],
      porcentajeDeducible: '100%'
    },
    marketing: {
      ejemplos: [
        'Publicidad en redes sociales (Facebook, Instagram, Google Ads)',
        'Material promocional (flyers, tarjetas de visita)',
        'Fotografía profesional para marketing',
        'Diseño gráfico y branding',
        'Suscripciones a plataformas de marketing digital'
      ],
      tips: [
        'Los gastos de marketing son 100% deducibles',
        'Mantén registros de campañas publicitarias',
        'Incluye gastos de diseño y creación de contenido'
      ],
      porcentajeDeducible: '100%'
    },
    transporte: {
      ejemplos: [
        'Combustible para desplazamientos a clientes',
        'Peajes y parking relacionados con trabajo',
        'Mantenimiento del vehículo (solo parte profesional)',
        'Seguro del vehículo (proporcional al uso profesional)',
        'Desplazamientos a formaciones y eventos profesionales'
      ],
      tips: [
        'Lleva un registro de kilómetros profesionales',
        'Solo se deduce la parte proporcional al uso profesional',
        'Guarda los tickets de gasolina y peajes',
        'Considera usar la fórmula de kilometraje si es más ventajosa'
      ],
      porcentajeDeducible: 'Proporcional al uso profesional'
    },
    materiales: {
      ejemplos: [
        'Material consumible (toallas, agua, gel desinfectante)',
        'Suplementos para demostraciones (no para consumo personal)',
        'Material de oficina (cuadernos, bolígrafos, impresiones)',
        'Material sanitario (guantes, mascarillas)',
        'Productos de limpieza para el espacio de trabajo'
      ],
      tips: [
        'Solo se deducen materiales usados exclusivamente para la actividad',
        'No se deducen materiales de uso personal',
        'Guarda las facturas de compra'
      ],
      porcentajeDeducible: '100% si es de uso exclusivo profesional'
    },
    software: {
      ejemplos: [
        'Suscripciones a apps de entrenamiento (MyFitnessPal, Trainerize)',
        'Software de gestión de clientes',
        'Plataformas de videollamadas para entrenamientos online',
        'Software de contabilidad y facturación',
        'Aplicaciones de nutrición y planificación de dietas'
      ],
      tips: [
        'Las suscripciones profesionales son 100% deducibles',
        'Si usas software personal y profesional, deduce solo la parte profesional',
        'Conserva los recibos de suscripción'
      ],
      porcentajeDeducible: '100% si es exclusivo profesional'
    },
    seguros: {
      ejemplos: [
        'Seguro de responsabilidad civil profesional',
        'Seguro de vida vinculado a la actividad profesional',
        'Seguro de equipamiento profesional',
        'Seguro de salud (si eres autónomo)',
        'Seguros relacionados con el espacio de trabajo'
      ],
      tips: [
        'Los seguros profesionales son 100% deducibles',
        'El seguro de salud tiene límites anuales de deducción',
        'Guarda las pólizas y recibos de pago'
      ],
      porcentajeDeducible: '100% (salvo seguros de salud con límites)'
    },
    alquiler: {
      ejemplos: [
        'Alquiler de espacio de entrenamiento',
        'Alquiler de sala de yoga o pilates',
        'Alquiler de oficina o espacio administrativo',
        'Alquiler de equipamiento (si no es compra)',
        'Alquiler de espacio para eventos o talleres'
      ],
      tips: [
        'El alquiler debe ser necesario para la actividad profesional',
        'Si trabajas desde casa, solo se deduce la parte proporcional',
        'Guarda los contratos de alquiler y recibos'
      ],
      porcentajeDeducible: '100% si es exclusivo profesional'
    },
    servicios_profesionales: {
      ejemplos: [
        'Servicios de contabilidad y gestoría',
        'Asesoría legal y fiscal',
        'Diseño gráfico y branding',
        'Consultoría de marketing',
        'Servicios de fotografía profesional'
      ],
      tips: [
        'Los servicios profesionales son 100% deducibles',
        'Asegúrate de recibir facturas por los servicios',
        'Los servicios deben estar relacionados con tu actividad'
      ],
      porcentajeDeducible: '100%'
    },
    formacion: {
      ejemplos: [
        'Cursos de formación continua',
        'Workshops y seminarios',
        'Conferencias y congresos del sector',
        'Cursos online especializados',
        'Material educativo y libros profesionales'
      ],
      tips: [
        'La formación continua es 100% deducible',
        'Debe estar relacionada con tu actividad profesional',
        'Conserva certificados y facturas',
        'Incluye gastos de desplazamiento a formaciones'
      ],
      porcentajeDeducible: '100%'
    },
    comunicaciones: {
      ejemplos: [
        'Línea telefónica profesional',
        'Internet (proporcional al uso profesional)',
        'Servicios de comunicación empresarial',
        'Aplicaciones de mensajería profesional',
        'Servicios de correo electrónico empresarial'
      ],
      tips: [
        'Si es uso mixto, deduce solo la parte profesional',
        'Considera tener una línea separada para uso profesional',
        'Guarda las facturas de los servicios'
      ],
      porcentajeDeducible: 'Proporcional al uso profesional'
    },
    dietas: {
      ejemplos: [
        'Comidas fuera de casa cuando trabajas con clientes',
        'Dietas cuando trabajas fuera de tu localidad habitual',
        'Comidas durante formaciones o eventos profesionales',
        'Dietas durante desplazamientos de trabajo'
      ],
      tips: [
        'Solo se deducen dietas justificadas por trabajo',
        'Debe haber un desplazamiento o trabajo fuera de casa',
        'Guarda los tickets y justifica el motivo',
        'Hay límites diarios establecidos por Hacienda'
      ],
      porcentajeDeducible: 'Hasta límites establecidos por Hacienda'
    },
    vestimenta: {
      ejemplos: [
        'Ropa de trabajo específica (uniforme con logo)',
        'Calzado deportivo profesional',
        'Ropa técnica para entrenamientos',
        'Vestimenta con identificación profesional'
      ],
      tips: [
        'Solo se deduce si es vestimenta específica de trabajo',
        'La ropa de uso personal no es deducible',
        'Debe ser claramente identificable como profesional',
        'Guarda las facturas'
      ],
      porcentajeDeducible: '100% si es exclusiva de trabajo'
    },
    otros: {
      ejemplos: [
        'Gastos bancarios de cuenta profesional',
        'Comisiones de pasarelas de pago',
        'Gastos de representación justificados',
        'Otros gastos necesarios para la actividad'
      ],
      tips: [
        'Deben estar relacionados con la actividad profesional',
        'Deben estar justificados con factura',
        'Consulta con tu gestor para casos específicos'
      ],
      porcentajeDeducible: 'Variable según el caso'
    }
  };

  // Checklist mensual de gastos a revisar
  const checklistMensual = [
    {
      categoria: 'Equipamiento',
      items: [
        '¿Has comprado nuevo equipamiento este mes?',
        '¿Tienes las facturas guardadas?',
        '¿El equipamiento es exclusivo para uso profesional?'
      ]
    },
    {
      categoria: 'Formación',
      items: [
        '¿Has realizado algún curso o formación?',
        '¿Has asistido a algún seminario o workshop?',
        '¿Tienes los certificados y facturas?'
      ]
    },
    {
      categoria: 'Marketing',
      items: [
        '¿Has realizado gastos en publicidad?',
        '¿Has contratado servicios de diseño o fotografía?',
        '¿Has renovado suscripciones de marketing digital?'
      ]
    },
    {
      categoria: 'Transporte',
      items: [
        '¿Has registrado todos los desplazamientos profesionales?',
        '¿Tienes los tickets de gasolina y peajes?',
        '¿Has calculado el uso profesional del vehículo?'
      ]
    },
    {
      categoria: 'Software y suscripciones',
      items: [
        '¿Has renovado suscripciones a software profesional?',
        '¿Has contratado nuevas plataformas?',
        '¿Tienes los recibos de pago?'
      ]
    },
    {
      categoria: 'Servicios profesionales',
      items: [
        '¿Has contratado servicios de contabilidad o gestoría?',
        '¿Has utilizado servicios de asesoría?',
        '¿Tienes las facturas de los servicios?'
      ]
    },
    {
      categoria: 'Otros gastos',
      items: [
        '¿Has realizado otros gastos profesionales?',
        '¿Tienes todas las facturas guardadas?',
        '¿Has revisado que todos los gastos sean deducibles?'
      ]
    }
  ];

  return (
    <div id="educacion-gastos-deducibles" className="space-y-6">
      {/* Header de la sección educativa - Tipo Centro de Ayuda */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {guia.introduccion.titulo}
              </h2>
              <p className="text-gray-700 mb-4">
                {guia.introduccion.descripcion}
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Importante:</strong> {guia.introduccion.advertencia}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bloque: ¿Qué es un Gasto Deducible? */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <button
            onClick={() => setShowIntroduccion(!showIntroduccion)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {guia.queEsDeducible.titulo}
              </h3>
            </div>
            {showIntroduccion ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showIntroduccion && (
            <div className="space-y-4 pl-12">
              <p className="text-gray-700 leading-relaxed">
                {guia.queEsDeducible.definicion}
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Criterios para que un gasto sea deducible:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                  {guia.queEsDeducible.criterios.map((criterio, index) => (
                    <li key={index}>{criterio}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Ejemplos de gastos deducibles:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                  {guia.queEsDeducible.ejemplos.map((ejemplo, index) => (
                    <li key={index}>{ejemplo}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Categorías de gastos con ejemplos - Usando datos de la API */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-gray-900">
              Gastos Deducibles por Categoría
            </h3>
          </div>
          
          <div className="space-y-3">
            {guia.categorias.map((categoriaEducativa) => {
              const categoriaInfo = CATEGORIAS_GASTO[categoriaEducativa.categoriaId as CategoriaGasto];
              const isExpanded = expandedCategories.has(categoriaEducativa.categoriaId);
              
              // Si no existe la categoría en CATEGORIAS_GASTO, usar datos de la API
              const categoriaNombre = categoriaInfo?.nombre || categoriaEducativa.nombre;
              const categoriaDescripcion = categoriaInfo?.descripcion || categoriaEducativa.descripcion;
              
              return (
                <div
                  key={categoriaEducativa.categoriaId}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleCategory(categoriaEducativa.categoriaId)}
                    className="w-full px-4 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{categoriaNombre}</div>
                        <div className="text-sm text-gray-600">{categoriaDescripcion}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {categoriaEducativa.porcentajeDeducible && (
                        <Badge variant="success" className="hidden sm:inline-flex">
                          {categoriaEducativa.porcentajeDeducible} deducible
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 py-4 bg-white border-t border-gray-200">
                      <div className="space-y-4">
                        {/* Ejemplos concretos */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Ejemplos de gastos deducibles:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                            {categoriaEducativa.ejemplos.map((ejemplo, index) => (
                              <li key={index}>{ejemplo}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Tips y consejos */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            Consejos importantes:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                            {categoriaEducativa.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Límites específicos de la categoría */}
                        {categoriaEducativa.limites && categoriaEducativa.limites.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-red-600" />
                              Límites y advertencias:
                            </h4>
                            <ul className="space-y-2">
                              {categoriaEducativa.limites.map((limite, index) => (
                                <li
                                  key={index}
                                  className={`p-3 rounded-lg border ${
                                    limite.importante
                                      ? 'bg-red-50 border-red-200'
                                      : 'bg-yellow-50 border-yellow-200'
                                  }`}
                                >
                                  <div className="font-semibold text-sm mb-1">
                                    {limite.concepto}
                                  </div>
                                  {(limite.limite || limite.porcentaje) && (
                                    <div className="text-xs text-gray-600 mb-1">
                                      {limite.limite && `Límite: ${limite.limite}`}
                                      {limite.porcentaje && `Porcentaje: ${limite.porcentaje}`}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-700">
                                    {limite.descripcion}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Bloque: Límites Comunes */}
      <Card className="bg-white shadow-sm border-amber-200">
        <div className="p-6">
          <button
            onClick={() => setShowLimites(!showLimites)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {guia.limitesComunes.titulo}
              </h3>
            </div>
            {showLimites ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showLimites && (
            <div className="space-y-4 pl-12">
              <div className="space-y-3">
                {guia.limitesComunes.limites.map((limite, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      limite.importante
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {limite.importante && (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {limite.concepto}
                        </h4>
                        {(limite.limite || limite.porcentaje) && (
                          <div className="text-sm text-gray-700 mb-2">
                            {limite.limite && <span className="font-medium">Límite: </span>}
                            {limite.limite && limite.limite}
                            {limite.porcentaje && <span className="font-medium">Porcentaje: </span>}
                            {limite.porcentaje && limite.porcentaje}
                          </div>
                        )}
                        <p className="text-sm text-gray-700">
                          {limite.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Nota importante:</strong> {guia.limitesComunes.notaImportante}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bloque: Buenas Prácticas Fiscales */}
      <Card className="bg-white shadow-sm border-green-200">
        <div className="p-6">
          <button
            onClick={() => setShowBuenasPracticas(!showBuenasPracticas)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {guia.buenasPracticas.titulo}
              </h3>
            </div>
            {showBuenasPracticas ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showBuenasPracticas && (
            <div className="space-y-4 pl-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guia.buenasPracticas.practicas.map((practica, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getImportanceColor(practica.importancia)}`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">
                          {practica.titulo}
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {practica.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Checklist mensual */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Checklist Mensual de Gastos
              </h3>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowChecklist(!showChecklist)}
            >
              {showChecklist ? 'Ocultar' : 'Mostrar'} Checklist
            </Button>
          </div>
          
          {showChecklist && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Revisa mensualmente estos puntos para asegurarte de que no estás perdiendo 
                oportunidades de deducción fiscal:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistMensual.map((seccion, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      {seccion.categoria}
                    </h4>
                    <ul className="space-y-2">
                      {seccion.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Revisa este checklist al final de cada mes para asegurarte de 
                  haber registrado todos tus gastos deducibles. Esto te ayudará a maximizar tus deducciones 
                  y ahorrar en impuestos.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Consejos finales */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Recordatorios Importantes
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">✓</span>
                  <span>
                    <strong>Guarda todas las facturas:</strong> Es esencial conservar los comprobantes 
                    de todos los gastos deducibles. Hacienda puede solicitar justificantes en cualquier momento.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">✓</span>
                  <span>
                    <strong>Registra los gastos inmediatamente:</strong> No esperes al final del año para 
                    registrar tus gastos. Hazlo mensualmente para no olvidar nada.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">✓</span>
                  <span>
                    <strong>Consulta con un profesional:</strong> La normativa fiscal puede ser compleja. 
                    Consulta con tu gestor o asesor fiscal para casos específicos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">✓</span>
                  <span>
                    <strong>Revisa regularmente:</strong> Revisa tus gastos mensualmente usando el checklist 
                    para asegurarte de no perder ninguna deducción.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

