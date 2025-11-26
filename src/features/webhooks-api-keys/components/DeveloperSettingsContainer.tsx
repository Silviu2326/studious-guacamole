import React, { useState } from 'react';
import { Tabs } from '../../../components/componentsreutilizables';
import { ApiKeysManager } from './ApiKeysManager';
import { WebhooksManager } from './WebhooksManager';
import { Key, Webhook as WebhookIcon } from 'lucide-react';

export const DeveloperSettingsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api_keys' | 'webhooks'>('api_keys');

  const tabs = [
    {
      id: 'api_keys',
      label: 'API Keys',
      icon: <Key className="w-4 h-4" />,
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: <WebhookIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'api_keys' | 'webhooks')}
        variant="underline"
        size="lg"
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div>
        {activeTab === 'api_keys' && <ApiKeysManager />}
        {activeTab === 'webhooks' && <WebhooksManager />}
      </div>
    </div>
  );
};

