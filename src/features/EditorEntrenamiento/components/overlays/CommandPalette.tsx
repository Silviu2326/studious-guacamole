import React, { useState, Fragment } from 'react';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { 
  Search, 
  Calendar, 
  Copy, 
  Zap, 
  FileSpreadsheet, 
  BarChart3, 
  Settings,
  Users,
  Layout,
  Command
} from 'lucide-react';
import { useUIContext } from '../../context/UIContext';

type CommandItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string[];
  action: () => void;
};

type CommandGroup = {
  name: string;
  items: CommandItem[];
};

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIContext();
  const [query, setQuery] = useState('');

  // Actions definition
  const groups: CommandGroup[] = [
    {
      name: 'Acciones Rápidas',
      items: [
        { 
          id: 'new-day', 
          name: 'Crear nuevo día', 
          icon: <Calendar className="w-5 h-5" />, 
          shortcut: ['Cmd', 'N'],
          action: () => console.log('Crear nuevo día') 
        },
        { 
          id: 'duplicate-week', 
          name: 'Duplicar semana actual', 
          icon: <Copy className="w-5 h-5" />, 
          shortcut: ['Cmd', 'D'],
          action: () => console.log('Duplicar semana') 
        },
        { 
          id: 'batch-training', 
          name: 'Abrir BatchTraining', 
          icon: <Zap className="w-5 h-5" />, 
          shortcut: ['Cmd', 'B'],
          action: () => console.log('Abrir BatchTraining') 
        },
      ]
    },
    {
      name: 'Vistas',
      items: [
        { 
          id: 'view-weekly', 
          name: 'Cambiar a Vista Semanal', 
          icon: <Layout className="w-5 h-5" />, 
          shortcut: ['1'],
          action: () => console.log('Vista Semanal') 
        },
        { 
          id: 'view-excel', 
          name: 'Cambiar a Vista Excel', 
          icon: <FileSpreadsheet className="w-5 h-5" />, 
          shortcut: ['2'],
          action: () => console.log('Vista Excel') 
        },
        { 
          id: 'view-timeline', 
          name: 'Cambiar a Vista Timeline', 
          icon: <BarChart3 className="w-5 h-5" />, 
          shortcut: ['3'],
          action: () => console.log('Vista Timeline') 
        },
      ]
    },
    {
      name: 'Configuración',
      items: [
        { 
          id: 'change-client', 
          name: 'Cambiar cliente', 
          icon: <Users className="w-5 h-5" />, 
          action: () => console.log('Cambiar cliente') 
        },
        { 
          id: 'settings', 
          name: 'Preferencias del editor', 
          icon: <Settings className="w-5 h-5" />, 
          action: () => console.log('Preferencias') 
        },
      ]
    }
  ];

  // Flatten items for search, but keep group structure for display
  const filteredGroups = query === ''
    ? groups
    : groups.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      })).filter(group => group.items.length > 0);

  const handleSelect = (item: CommandItem | null) => {
    if (!item) return;
    item.action();
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <Transition.Root show={isCommandPaletteOpen} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog as="div" className="relative z-50" onClose={() => setCommandPaletteOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={handleSelect}>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-none"
                    placeholder="Buscar comandos o navegar..."
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(item: CommandItem) => item?.name}
                  />
                </div>

                {(filteredGroups.length > 0) && (
                  <Combobox.Options static className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                    {filteredGroups.map((group) => (
                      <div key={group.name}>
                         <div className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           {group.name}
                         </div>
                         {group.items.map((item) => (
                           <Combobox.Option
                             key={item.id}
                             value={item}
                             className={({ active }) =>
                               `flex cursor-default select-none items-center rounded-lg px-3 py-2.5 ${
                                 active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                               }`
                             }
                           >
                             {({ active }) => (
                               <>
                                 <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${active ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                   {item.icon}
                                 </div>
                                 <div className="ml-4 flex-auto">
                                   <p className={`text-sm font-medium ${active ? 'text-indigo-900' : 'text-gray-700'}`}>
                                     {item.name}
                                   </p>
                                 </div>
                                 {item.shortcut && (
                                    <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                      {item.shortcut.map((key, idx) => (
                                        <kbd key={idx} className="font-sans px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 shadow-sm">
                                          {key}
                                        </kbd>
                                      ))}
                                    </div>
                                 )}
                               </>
                             )}
                           </Combobox.Option>
                         ))}
                      </div>
                    ))}
                  </Combobox.Options>
                )}

                {query !== '' && filteredGroups.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">No se encontraron comandos.</p>
                )}
                
                <div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-4 text-xs text-gray-500 border-t border-gray-100">
                  <Command className="w-3 h-3 mr-1" /> 
                  <span className="mr-4">Buscar</span>
                  <span className="mr-1 font-bold">↑↓</span> <span className="mr-4">Navegar</span>
                  <span className="mr-1 font-bold">↵</span> <span className="mr-4">Seleccionar</span>
                  <span className="mr-1 font-bold">Esc</span> <span>Cerrar</span>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};