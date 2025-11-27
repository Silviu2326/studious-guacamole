import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MetricCards, Button } from '../../../components/componentsreutilizables';
import { Dumbbell, FileStack, FileText, List, Plus } from 'lucide-react';
import { ProgramasList, EditorPrograma } from '../../programas-de-entreno/components';

// Wrapper para ProgramasList que intercepta los clicks
function ProgramasListWrapper({ onProgramaClick, onNuevoPrograma }: { 
  onProgramaClick: (id: string) => void;
  onNuevoPrograma: () => void;
}) {
  useEffect(() => {
    // Interceptar clicks en botones de editar y nuevo programa
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        // Interceptar botón "Nuevo Programa"
        if (button.textContent?.includes('Nuevo Programa') || button.getAttribute('href') === '#editor') {
          e.preventDefault();
          e.stopPropagation();
          onNuevoPrograma();
          return;
        }
        
        // Interceptar botones de editar
        if (button.textContent?.includes('Editar')) {
          const href = (button as any).href || button.getAttribute('onclick');
          if (href && href.includes('id=')) {
            e.preventDefault();
            e.stopPropagation();
            const match = href.match(/id=([^&]+)/);
            if (match && match[1]) {
              onProgramaClick(match[1]);
            }
          }
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [onProgramaClick, onNuevoPrograma]);

  return <ProgramasList hideCreateButton={true} />;
}

export default function SuiteDeEntrenoPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [programaEditando, setProgramaEditando] = useState<string | null>(null);

  const metricas = useMemo(
    () => [
      {
        id: 'programas-activos',
        title: 'Programas Activos',
        value: '0',
        icon: <List className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'up' as const,
        },
        color: 'primary' as const,
      },
      {
        id: 'asignaciones',
        title: isEntrenador ? 'Asignados a Clientes' : 'Asignaciones',
        value: '0',
        icon: <Dumbbell className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'neutral' as const,
        },
        color: 'success' as const,
      },
      {
        id: 'plantillas',
        title: 'Plantillas Disponibles',
        value: '0',
        icon: <FileStack className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'up' as const,
        },
        color: 'primary' as const,
      },
      {
        id: 'total-ejercicios-main',
        title: 'Total Ejercicios',
        value: '0',
        icon: <FileText className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'neutral' as const,
        },
        color: 'warning' as const,
      },
    ],
    [isEntrenador]
  );

  const handleProgramaClick = (programaId: string) => {
    setProgramaEditando(programaId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Dumbbell size={24} className="text-blue-600" />
                </div>

                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Suite de Entreno
                  </h1>
                  <p className="text-gray-600">
                    {isEntrenador
                      ? 'Gestiona programas y plantillas de entrenamiento.'
                      : 'Gestiona programas y plantillas de entrenamiento para tu gimnasio.'}
                  </p>
                </div>
              </div>

              {/* Botón Nuevo Programa (visible solo cuando no se está editando) */}
              {!programaEditando && (
                <Button
                  onClick={() => setProgramaEditando('new')}
                  leftIcon={<Plus size={16} />}
                >
                  Nuevo Programa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas principales */}
          <MetricCards data={metricas} />

          {/* Contenido */}
          <div className="mt-6">
             <div className="space-y-6">
              {programaEditando ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setProgramaEditando(null)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ← Volver a Programas
                    </button>
                    <h2 className="text-xl font-semibold">
                      {programaEditando === 'new' ? 'Nuevo Programa' : 'Editando Programa'}
                    </h2>
                  </div>
                  <EditorPrograma />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Lista de Programas</h2>
                  </div>
                  <ProgramasListWrapper 
                    onProgramaClick={handleProgramaClick}
                    onNuevoPrograma={() => setProgramaEditando('new')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}