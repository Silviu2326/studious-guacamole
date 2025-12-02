import React, { useState } from 'react';
import { Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

interface ShareableLinkProps {
  link: string;
  code?: string;
}

export const ShareableLink: React.FC<ShareableLinkProps> = ({ link, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedLink = encodeURIComponent(link);
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedLink}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedLink}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Tu Enlace de Referido</h3>

      {code && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tu Código
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={code}
              readOnly
              className="flex-1 rounded-xl bg-white text-slate-900 font-mono font-bold text-lg text-center ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="p-2"
            >
              {isCopied ? <Check size={20} /> : <Copy size={20} />}
            </Button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tu Enlace Completo
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="p-2"
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Compartir en</label>
        <div className="flex gap-2">
          <Button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            leftIcon={<MessageCircle size={20} />}
          >
            WhatsApp
          </Button>
          <Button
            onClick={() => handleShare('facebook')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            leftIcon={<Share2 size={20} />}
          >
            Facebook
          </Button>
          <Button
            onClick={() => handleShare('twitter')}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
            leftIcon={<Share2 size={20} />}
          >
            Twitter
          </Button>
        </div>
      </div>
    </Card>
  );
};

