'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, User, UserCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ otherUserId, otherUserName, onClose }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?userId=${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // 5초마다 간이 폴링
    return () => clearInterval(interval);
  }, [otherUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: otherUserId, content: newMessage }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-[200] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black text-xs">
            {otherUserName[0]}
          </div>
          <div>
            <p className="text-sm font-black">{otherUserName} 작가님</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Artist Consultation</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 min-h-[400px] max-h-[500px] p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading Chats...</span>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.senderId === (session.user as any).id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-gray-300 mt-1 font-bold">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
             <UserCheck className="h-10 w-10 mb-4" />
             <p className="text-xs font-bold leading-relaxed px-10 italic">
               작가님께 무엇이든 물어보세요!<br/>작품의 질감, 프레임 디테일 등 상담이 가능합니다.
             </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          placeholder="메시지를 입력하세요..." 
          className="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <button 
          type="submit"
          disabled={!newMessage.trim() || isSending}
          className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-primary transition-all active:scale-95 disabled:opacity-30"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
