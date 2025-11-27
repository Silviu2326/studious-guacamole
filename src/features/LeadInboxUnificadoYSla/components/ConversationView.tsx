import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Smile, 
  MessageSquare,
  Instagram,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Sparkles,
  User
} from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ConversationMessage } from '../types';
import { ConversationService } from '../services/conversationService';
import { TemplatePickerModal } from './TemplatePickerModal';
import { useAuth } from '../../../context/AuthContext';

interface ConversationViewProps {
  leadId: string;
  leadName: string;
  channel: 'instagram' | 'whatsapp';
  onClose: () => void;
  onViewLead?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  leadId,
  leadName,
  channel,
  onClose,
  onViewLead
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadConversation();
  }, [leadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    setLoading(true);
    try {
      const data = await ConversationService.getConversation(leadId);
      setMessages(data);
      await ConversationService.markAsRead(leadId);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const sentMessage = await ConversationService.sendMessage(
        leadId,
        newMessage.trim(),
        channel,
        user?.id || 'unknown',
        user?.name || 'Usuario'
      );

      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleTemplateSelect = (templateContent: string) => {
    setNewMessage(templateContent);
    setShowTemplatePicker(false);
    textareaRef.current?.focus();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    return messageDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getChannelIcon = () => {
    switch (channel) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getChannelColor = () => {
    switch (channel) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'whatsapp':
        return 'bg-green-500';
    }
  };

  const getChannelName = () => {
    switch (channel) {
      case 'instagram':
        return 'Instagram Direct';
      case 'whatsapp':
        return 'WhatsApp';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${getChannelColor()} text-white px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
                {getChannelIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{leadName}</h2>
                <p className="text-sm text-white/90">{getChannelName()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onViewLead && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onViewLead();
                    onClose();
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver ficha
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando conversación...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No hay mensajes aún</p>
                <p className="text-sm text-gray-500 mt-2">Inicia la conversación con {leadName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOutbound = message.direction === 'outbound';
                const showAvatar = index === 0 || messages[index - 1].direction !== message.direction;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${isOutbound ? 'order-2' : 'order-1'}`}
                    >
                      {showAvatar && !isOutbound && (
                        <p className="text-xs text-gray-500 mb-1 px-1">{leadName}</p>
                      )}
                      {showAvatar && isOutbound && message.userName && (
                        <p className="text-xs text-gray-500 mb-1 px-1 text-right">{message.userName}</p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isOutbound
                            ? channel === 'instagram'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-green-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</p>
                        {isOutbound && (
                          <>
                            {message.readAt ? (
                              <div className="flex items-center gap-1 ml-1" title={`Visto ${formatTimestamp(message.readAt)}`}>
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-500 font-medium">Visto</span>
                              </div>
                            ) : (
                              <Check className="w-3 h-3 text-gray-400 ml-1" title="Enviado" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end gap-3">
            {/* Template Button */}
            <button
              onClick={() => setShowTemplatePicker(true)}
              className="p-3 hover:bg-purple-50 text-purple-600 rounded-xl transition-colors flex-shrink-0"
              title="Usar plantilla"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder={`Escribe tu mensaje a ${leadName}...`}
                className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 placeholder-gray-500 resize-none focus:outline-none"
                rows={1}
                style={{ maxHeight: '120px' }}
                disabled={sending}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                className="p-3 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors flex-shrink-0"
                title="Adjuntar archivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                variant="primary"
                size="sm"
                loading={sending}
                className="!rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-2 px-1">
            <p className="text-xs text-gray-500">
              <strong>Enter</strong> para enviar • <strong>Shift + Enter</strong> para nueva línea
            </p>
          </div>
        </div>
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <TemplatePickerModal
          leadName={leadName}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </div>
  );
};

