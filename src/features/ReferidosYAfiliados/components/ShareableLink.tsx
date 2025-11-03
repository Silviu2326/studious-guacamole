import React, { useState } from 'react';
import { Copy, Check, Share2, MessageCircle } from 'lucide-react';

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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Tu Enlace de Referido</h3>

      {code && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tu Código</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={code}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono font-bold text-lg text-center"
            />
            <button
              onClick={handleCopy}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tu Enlace Completo</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={handleCopy}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Compartir en</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Share2 className="w-5 h-5" />
            Facebook
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            <Share2 className="w-5 h-5" />
            Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

