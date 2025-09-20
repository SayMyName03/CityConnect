import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Msg = { role: 'user' | 'assistant'; content: string };

const ChatPage: React.FC = () => {
  const [locality, setLocality] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! Ask me about any locality or reported issues.' },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, locality: locality || undefined }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'No reply.' }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Sorry, I had trouble reaching the assistant.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">CityConnect Assistant</h1>
      <div className="mb-4">
        <Input placeholder="Locality (optional)" value={locality} onChange={(e) => setLocality(e.target.value)} />
      </div>
      <div ref={listRef} className="h-96 overflow-y-auto space-y-2 border rounded p-2 bg-background mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={
              'inline-block px-3 py-2 rounded ' +
              (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')
            }>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-muted-foreground">Thinking…</div>}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type your question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <Button onClick={send} disabled={loading}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPage;
