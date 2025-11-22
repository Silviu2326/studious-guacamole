import React from 'react';
import { ds } from '../../../../../features/adherencia/ui/ds';

export const StepConfiguration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">🔄</span>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          PROGRESIÓN LINEAL - Configuración
        </h3>
      </div>

      {/* 1. Range Selection */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">1️⃣ Selecciona el rango de semanas:</label>
        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Desde:</span>
                <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm">
                    <option>Semana 1</option>
                </select>
            </div>
             <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hasta:</span>
                <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm">
                    <option>Semana 4</option>
                </select>
            </div>
        </div>
         <p className="text-sm text-gray-500">📊 4 semanas seleccionadas, 16 días totales</p>
      </div>

      {/* 2. Progression Targets */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">2️⃣ ¿Qué quieres progresar?</label>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-200">Series</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                    <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm">
                        <option>+1</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>
             
             <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-200">Repeticiones</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                     <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm">
                        <option>+2</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>

              <div className="flex items-center justify-between opacity-60">
                <label className="flex items-center space-x-2 cursor-not-allowed">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" disabled />
                    <span className="text-gray-700 dark:text-gray-200">Carga</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                     <select disabled className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm">
                        <option>+5%</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="space-y-2">
         <label className="block font-medium text-gray-700 dark:text-gray-300">3️⃣ Filtrar ejercicios (opcional):</label>
         <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center space-x-2">
                <input type="radio" name="filter" id="all" className="text-blue-600" />
                <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-300">Aplicar a todos los ejercicios</label>
            </div>
            <div className="flex items-center space-x-2">
                <input type="radio" name="filter" id="tags" defaultChecked className="text-blue-600" />
                <label htmlFor="tags" className="text-sm text-gray-700 dark:text-gray-300">Aplicar solo a ejercicios con tags:</label>
            </div>
            <div className="ml-6 flex flex-wrap gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center border border-blue-200 dark:border-blue-800">
                    #Fuerza <button className="ml-1 hover:text-blue-600">×</button>
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center border border-blue-200 dark:border-blue-800">
                    #Hipertrofia <button className="ml-1 hover:text-blue-600">×</button>
                </span>
                <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">+ Agregar tag</button>
            </div>
            <p className="text-sm text-gray-500 ml-6">📊 24 ejercicios coinciden con estos filtros</p>
         </div>
      </div>
    </div>
  );
};
