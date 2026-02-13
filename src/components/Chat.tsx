import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Message } from '../types';

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isSystemPlan = message.type === 'plan';
  const isProgress = message.type === 'progress';
  const isChanges = message.type === 'changes';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-5 py-3
          ${
            isUser
              ? 'bg-blue-600 text-white'
              : isSystemPlan
              ? 'bg-blue-500/10 border border-blue-500/30 text-blue-200'
              : isProgress
              ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-200'
              : isChanges
              ? 'bg-green-500/10 border border-green-500/30 text-green-200'
              : 'bg-gray-800 text-gray-100'
          }
        `}
      >
        {!isUser && (isSystemPlan || isProgress || isChanges) && (
          <div className="flex items-center gap-2 mb-2">
            {isSystemPlan && (
              <>
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Plan</span>
              </>
            )}
            {isProgress && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
              </>
            )}
            {isChanges && (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Changes Applied</span>
              </>
            )}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-60 mt-2 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export function Chat() {
  const { messages, addMessage } = useApp();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');

    await addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsGenerating(true);

    setTimeout(async () => {
      await addMessage({
        role: 'system',
        content: 'I understand you want to: ' + userMessage + '\n\nLet me create a plan for that.',
        type: 'plan',
      });
    }, 500);

    setTimeout(async () => {
      await addMessage({
        role: 'system',
        content: 'Working on implementing the requested features...',
        type: 'progress',
      });
    }, 1500);

    setTimeout(async () => {
      await addMessage({
        role: 'system',
        content: 'Successfully updated:\n- Modified 3 components\n- Added new styles\n- Updated configuration',
        type: 'changes',
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isGenerating && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-800 rounded-2xl px-5 py-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              className="w-full bg-gray-800 text-gray-100 rounded-2xl px-5 py-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              rows={3}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute bottom-4 right-4 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
