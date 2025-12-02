import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const ChannelHealthWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const channels = [
    { name: 'WhatsApp API', status: 'healthy' },
    { name: 'Email Server', status: 'healthy' },
    { name: 'SMS Gateway', status: 'warning' },
  ];

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className={`${ds.typography.bodySmall} font-semibold uppercase tracking-wider text-gray-500 mb-3`}>System Status</h3>
      <div className="space-y-3">
        {channels.map((channel, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className={`text-sm ${ds.color.textPrimary}`}>{channel.name}</span>
            {channel.status === 'healthy' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {channel.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
            {channel.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
          </div>
        ))}
      </div>
    </Card>
  );
};
