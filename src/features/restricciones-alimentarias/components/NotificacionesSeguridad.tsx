import { Badge } from '../../componentsreutilizables/Badge';
import { ShieldAlert } from 'lucide-react';

export function NotificacionesSeguridad() {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-yellow-50 border-yellow-200">
      <ShieldAlert className="w-5 h-5 text-yellow-700" />
      <div className="text-sm text-yellow-900">
        Las alertas de seguridad sanitaria se generan automáticamente al detectar ingredientes restringidos.
      </div>
      <Badge variant="warning">Automático</Badge>
    </div>
  );
}


