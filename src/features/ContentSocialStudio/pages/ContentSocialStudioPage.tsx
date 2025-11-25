import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Wand2, Palette } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

export default function ContentSocialStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-violet-100 to-rose-200 dark:from-violet-900/40 dark:to-rose-900/30 rounded-2xl shadow-inner">
                  <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-300" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Content & Social Studio
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    El antiguo hub se ha dividido en páginas más específicas para una mejor organización y experiencia de usuario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-white shadow-sm">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Navega a las nuevas páginas
              </h2>
              <p className="text-gray-600 dark:text-slate-400">
                Selecciona una de las siguientes páginas para acceder a las funcionalidades específicas:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Planner & Social */}
              <Link
                to="/dashboard/content/planner-social"
                className="group block"
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-800">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/30 rounded-2xl">
                      <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Planner & Social
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Planificación de contenido, calendario IA y análisis de rendimiento social
                    </p>
                  </div>
                </Card>
              </Link>

              {/* Creación & IA */}
              <Link
                to="/dashboard/content/creation-ai"
                className="group block"
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-800">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/30 rounded-2xl">
                      <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Creación & IA
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Herramientas de creación con IA, video studio y generación de contenido
                    </p>
                  </div>
                </Card>
              </Link>

              {/* Activos & Marca */}
              <Link
                to="/dashboard/content/assets-brand"
                className="group block"
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-800">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-rose-100 to-orange-200 dark:from-rose-900/40 dark:to-orange-900/30 rounded-2xl">
                      <Palette className="w-8 h-8 text-rose-600 dark:text-rose-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Activos & Marca
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Biblioteca de activos, configuración de marca y gestión de identidad visual
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

