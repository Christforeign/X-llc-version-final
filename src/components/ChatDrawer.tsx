import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Shield, User, Clock, CheckCheck, X } from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { LiveChatRoom, ChatMessage } from '../models/types';

interface ChatDrawerProps {
  chatRoomId: string;
  title?: string;
  category?: LiveChatRoom['category'];
  onClose?: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ chatRoomId, title, category = 'direct', onClose }) => {
  const currentUser = authService.getCurrentUser();
  const [chatRoom, setChatRoom] = useState<LiveChatRoom>(db.getChatRoom(chatRoomId, title, category as LiveChatRoom['category']));
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setChatRoom(db.getChatRoom(chatRoomId, title, category as LiveChatRoom['category']));
    });
    return () => unsub();
  }, [chatRoomId, title, category]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRoom.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    db.addChatMessage(chatRoomId, {
      senderId: currentUser.id,
      senderEmail: currentUser.email,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: inputText.trim(),
    });

    setInputText('');

    // Simulate smart staff / trade party automated acknowledgement if in GSM or exchange room
    if (chatRoom.category === 'gsm' && currentUser.role === 'client') {
      setTimeout(() => {
        db.addChatMessage(chatRoomId, {
          senderId: 'usr-staff-01',
          senderEmail: 'tech.staff@xgroup.com',
          senderName: 'Jean-Marc Durand (Tech Lead)',
          senderRole: 'staff',
          message: 'Received your diagnostics note. Our USB-over-IP test bench is monitoring the serial handshake now.',
        });
      }, 1400);
    }
  };

  const handleAttachFile = () => {
    if (!currentUser) return;
    const dummyFiles = [
      { name: 'device_logcat_dump.txt', size: '340 KB', url: '#' },
      { name: 'screen_lock_photo.png', size: '1.8 MB', url: '#' },
      { name: 'customs_clearance_stamp.pdf', size: '920 KB', url: '#' },
    ];
    const picked = dummyFiles[Math.floor(Math.random() * dummyFiles.length)];

    db.addChatMessage(chatRoomId, {
      senderId: currentUser.id,
      senderEmail: currentUser.email,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: `Attached verification payload: ${picked.name} (${picked.size})`,
      attachments: [{ id: `att-${Date.now()}`, name: picked.name, size: picked.size, url: picked.url, type: 'document' }],
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[440px] text-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">{chatRoom.title}</h4>
            <p className="text-[10px] text-slate-400">Encrypted P2P / Staff Direct Pipeline</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/60">
        {chatRoom.messages.map((msg) => {
          const isMe = currentUser && msg.senderId === currentUser.id;
          const isSystem = msg.senderId === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-400">
                  {msg.message}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-[10px] font-semibold text-slate-400">{msg.senderName}</span>
                <span
                  className={`text-[8px] uppercase px-1 py-0.2 rounded font-bold ${
                    msg.senderRole === 'admin'
                      ? 'bg-rose-500/20 text-rose-300'
                      : msg.senderRole === 'staff'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {msg.senderRole}
                </span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}
              >
                <p>{msg.message}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/20 text-[10px] flex items-center space-x-1 text-cyan-200">
                    <Paperclip className="w-3 h-3" />
                    <span>File attached</span>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-400 mt-0.5 flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <button
          type="button"
          onClick={handleAttachFile}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Attach diagnostic file or receipt"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={currentUser ? 'Type secure response...' : 'Sign in to participate in chat'}
          disabled={!currentUser}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={!currentUser || !inputText.trim()}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
