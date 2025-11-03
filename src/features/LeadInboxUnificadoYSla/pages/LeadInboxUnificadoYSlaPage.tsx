import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LeadInboxContainer } from '../components/LeadInboxContainer';
import { Inbox, Zap } from 'lucide-react';

export const LeadInboxUnificadoYSlaPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Inbox size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Lead Inbox Unificado & SLA
                </h1>
                <p className="text-gray-600">
                  Centraliza todas tus conversaciones de leads
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión Centralizada</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Una única bandeja de entrada para todos tus leads de Instagram, Facebook, web, WhatsApp y email. 
                Con SLAs configurables para responder a tiempo.
              </p>
            </div>
          </div>
        </div>
        <LeadInboxContainer />
      </div>
    </div>
  );
};

export default LeadInboxUnificadoYSlaPage;

