import React from 'react';
import { ChevronDown, Save, Zap, User, Settings, Menu } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger (Visible only on small screens) */}
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo Area */}
        <div className="flex items-center gap-2 font-bold text-xl text-blue-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            FP
          </div>
          <span className="hidden sm:block">FitPro</span>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

        {/* Client Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
          <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
            ML
          </div>
          <span className="text-sm font-medium text-gray-700">María López</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Auto-save Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <Save className="w-3 h-3" />
          <span>Guardado hace 2s</span>
        </div>

        {/* FitCoach Toggle */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">FitCoach</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Actions */}
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <User className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
