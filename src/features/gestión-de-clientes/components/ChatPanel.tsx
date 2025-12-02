import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ChatMessage, ChatAttachment } from '../types';
import { getChatMessages, sendMessage, markMessagesAsRead } from '../api/chat';
import {
  Send,
  Paperclip,
  File,
  Image as ImageIcon,
  FileText,
  Download,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatPanelProps {
  clienteId: string;
  clienteName: string;
  trainerId: string;
  trainerName: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  clienteId,
  clienteName,
  trainerId,
  trainerName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
  }, [clienteId]);

  useEffect(() => {
    scrollToBottom();
    // Marcar mensajes como leídos cuando se cargan
    const unreadMessageIds = messages
      .filter(msg => !msg.read && msg.senderType === 'client')
      .map(msg => msg.id);
    if (unreadMessageIds.length > 0) {
      markMessagesAsRead(clienteId, unreadMessageIds);
    }
  }, [messages, clienteId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getChatMessages(clienteId);
      setMessages(data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() && selectedFiles.length === 0) return;

    setSending(true);
    try {
      const newMessage = await sendMessage(
        clienteId,
        trainerId,
        'trainer',
        trainerName,
        messageContent,
        selectedFiles.length > 0 ? selectedFiles : undefined
      );
      setMessages(prev => [...prev, newMessage]);
      setMessageContent('');
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatMessageTime = (timestamp: string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando conversación...</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {clienteName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{clienteName}</h3>
              <p className="text-xs text-gray-500">Conversación activa</p>
            </div>
          </div>
          <Badge variant="green">En línea</Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No hay mensajes aún</p>
            <p className="text-sm text-gray-400">Comienza la conversación enviando un mensaje</p>
          </div>
        ) : (
          messages.map((message) => {
            const isTrainer = message.senderType === 'trainer';
            return (
              <div
                key={message.id}
                className={`flex ${isTrainer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isTrainer
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold opacity-90">
                      {message.senderName}
                    </span>
                    <span
                      className={`text-xs opacity-70 ${
                        isTrainer ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            isTrainer
                              ? 'bg-blue-600/50 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {getFileIcon(attachment.fileType)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs opacity-70">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                          <a
                            href={attachment.url}
                            download={attachment.fileName}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg"
              >
                {getFileIcon(file.type)}
                <span className="text-xs text-gray-700 truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Eliminar"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            title="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </label>
          <div className="flex-1">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Escribe un mensaje..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={sending || (!messageContent.trim() && selectedFiles.length === 0)}
            className="px-4"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
};

