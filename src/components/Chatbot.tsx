import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Msg = { role: 'user' | 'assistant'; content: string };

const Chatbot: React.FC<{ defaultLocality?: string }> = ({ defaultLocality }) => {
  const [open, setOpen] = useState(false);
  const [locality, setLocality] = useState(defaultLocality || '');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! Ask me about any locality or reported issues.' },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

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
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!open ? (
          <Button onClick={() => setOpen(true)} className="rounded-full h-12 w-12 text-lg">💬</Button>
        ) : (
          <Card className="w-96 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CityConnect Assistant
                <Button variant="ghost" onClick={() => setOpen(false)}>✕</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex gap-2">
                <Input
                  placeholder="Locality (optional)"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <div ref={listRef} className="h-64 overflow-y-auto space-y-2 border rounded p-2 bg-background">
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
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Type your question"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                />
                <Button onClick={send} disabled={loading}>Send</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Chatbot;
