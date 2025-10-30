import { LayoutDashboard, LogOut, Award, Building2, ChevronLeft, ChevronRight, TrendingUp, CalendarDays, ShieldAlert, Dumbbell, Banknote, Megaphone, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function Sidebar({ isCollapsed, onToggle, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEntrenador = user?.role === 'entrenador';
  const currentPath = location.pathname.includes('agenda')
    ? 'agenda'
    : location.pathname.includes('adherencia')
    ? 'adherencia'
    : location.pathname.includes('restricciones')
    ? 'restricciones'
    : location.pathname.includes('biblioteca-ejercicios')
    ? 'biblioteca-ejercicios'
    : location.pathname.includes('caja-bancos')
    ? 'caja-bancos'
    : location.pathname.includes('campanas-outreach')
    ? 'campanas-outreach'
    : location.pathname.includes('catalogo-planes')
    ? 'catalogo-planes'
    : location.pathname.includes('catalogo-productos')
    ? 'catalogo-productos'
    : 'dashboard';

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isEntrenador ? 'bg-blue-600' : 'bg-purple-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {isEntrenador ? (
              <Award className="w-6 h-6 text-white" />
            ) : (
              <Building2 className="w-6 h-6 text-white" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {isEntrenador ? 'Panel Entrenador' : 'Panel Gimnasio'}
              </h2>
              <p className="text-xs text-gray-600 truncate">{user?.name}</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`mt-4 w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} text-gray-500 hover:text-gray-700 transition`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => { onViewChange?.('dashboard'); navigate('/dashboard'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'dashboard'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange?.('adherencia'); navigate('/adherencia'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'adherencia'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? 'Adherencia' : ''}
            >
              <TrendingUp className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Adherencia</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange?.('restricciones'); navigate('/restricciones'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'restricciones'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? 'Restricciones Alimentarias' : ''}
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Restricciones</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange?.('biblioteca-ejercicios'); navigate('/biblioteca-ejercicios'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'biblioteca-ejercicios'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? 'Biblioteca de Ejercicios' : ''}
            >
              <Dumbbell className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Biblioteca de Ejercicios</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange?.('catalogo-planes'); navigate('/catalogo-planes'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'catalogo-planes'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? (isEntrenador ? 'Bonos PT' : 'Membresías') : ''}
            >
              <Package className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{isEntrenador ? 'Bonos PT' : 'Membresías'}</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange?.('agenda'); navigate('/agenda'); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                currentPath === 'agenda'
                  ? isEntrenador
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } font-medium transition`}
              title={isCollapsed ? 'Agenda' : ''}
            >
              <CalendarDays className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Agenda</span>}
            </button>
          </li>
          {!isEntrenador && (
            <>
              <li>
                <button
                  onClick={() => { onViewChange?.('catalogo-productos'); navigate('/catalogo-productos'); }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                    currentPath === 'catalogo-productos'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } font-medium transition`}
                  title={isCollapsed ? 'Catálogo de Productos' : ''}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>Catálogo de Productos</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onViewChange?.('caja-bancos'); navigate('/caja-bancos'); }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                    currentPath === 'caja-bancos'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } font-medium transition`}
                  title={isCollapsed ? 'Caja & Bancos' : ''}
                >
                  <Banknote className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>Caja & Bancos</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onViewChange?.('campanas-outreach'); navigate('/campanas-outreach'); }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg ${
                    currentPath === 'campanas-outreach'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } font-medium transition`}
                  title={isCollapsed ? 'Campañas & Outreach' : ''}
                >
                  <Megaphone className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>Campañas & Outreach</span>}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
