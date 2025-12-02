import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, ChatMessage, InteractionChannel } from '../types';
import { ChatService } from '../services/chatService';
import {
  Send,
  MessageSquare,
  Mail,
  Phone,
  Paperclip,
  Smile,
  Clock
} from 'lucide-react';

interface LeadChatProps {
  lead: Lead;
  onMessageSent?: () => void;
}

export const LeadChat: React.FC<LeadChatProps> = ({ lead, onMessageSent }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<InteractionChannel>('whatsapp');

  useEffect(() => {
    loadMessages();
    // Simular polling para nuevos mensajes (en producción sería WebSocket)
    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [lead.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await ChatService.getChatHistory(lead.id);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await ChatService.sendMessage(lead.id, {
        channel: selectedChannel,
        content: newMessage,
        userId: user?.id || 'unknown',
        userName: user?.name || 'Usuario'
      });

      setNewMessage('');
      await loadMessages();
      onMessageSent?.();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days}d`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter(m => !m.read && m.direction === 'inbound').length;

  const channelOptions: InteractionChannel[] = ['whatsapp', 'email', 'sms'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#334155]">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
            Chat con {lead.name}
          </h3>
          {unreadCount > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {unreadCount} mensaje(s) no leído(s)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {channelOptions.map(channel => (
            <button
              key={channel}
              type="button"
              onClick={() => setSelectedChannel(channel)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedChannel === channel
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-[#1E1E2E] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A2A3E]'
              }`}
            >
              {channel === 'whatsapp' && <MessageSquare className="w-4 h-4 inline mr-1" />}
              {channel === 'email' && <Mail className="w-4 h-4 inline mr-1" />}
              {channel === 'sms' && <Phone className="w-4 h-4 inline mr-1" />}
              {channel}
            </button>
          ))}
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#1E1E2E]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-[#94A3B8]">
              No hay mensajes aún. Inicia la conversación.
            </p>
          </div>
        ) : (
          messages.map(message => {
            const isOutbound = message.direction === 'outbound';
            const isImportant = message.important;

            return (
              <div
                key={message.id}
                className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOutbound
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-[#2A2A3E] text-gray-900 dark:text-[#F1F5F9] border border-gray-200 dark:border-[#334155]'
                  } ${isImportant ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {isImportant && (
                    <div className="text-xs font-semibold mb-1 text-yellow-600 dark:text-yellow-400">
                      ⭐ Importante
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className={`flex items-center gap-2 mt-1 text-xs ${
                    isOutbound ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(message.timestamp)}</span>
                    {message.direction === 'outbound' && message.read && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-4 border-t border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E1E2E]">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Escribe un mensaje por ${selectedChannel}...`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-600 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#2A2A3E] rounded-lg"
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-600 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#2A2A3E] rounded-lg"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
};

