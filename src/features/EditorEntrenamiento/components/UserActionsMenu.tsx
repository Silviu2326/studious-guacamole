import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Settings, LogOut, User, DollarSign, Users } from 'lucide-react';
import { useUIContext } from '../context/UIContext';

const UserActionsMenu: React.FC = () => {
  const { setPreferencesModalOpen } = useUIContext();

  return (
    <div className="flex items-center">
      {/* Settings Button for Desktop */}
      <button
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 transition-colors mr-2"
        aria-label="Configuración"
        title="Configuración del Editor"
        onClick={() => setPreferencesModalOpen(true)}
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* User Avatar with Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button 
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Menú de usuario"
          >
            <span className="text-xs font-medium text-gray-600">US</span>
          </Menu.Button>
        </div>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert('Navegar a Mi Perfil')}
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mi Perfil
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert('Navegar a Suscripción')}
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <DollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
                    Suscripción
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert('Navegar a Team Settings')}
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                    Team Settings
                  </button>
                )}
              </Menu.Item>

              {/* Settings for Mobile, inside dropdown */}
              <Menu.Item className="lg:hidden">
                {({ active }) => (
                  <button
                    onClick={() => setPreferencesModalOpen(true)}
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                    Configuración
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => alert('Cerrar Sesión')}
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Cerrar Sesión
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserActionsMenu;