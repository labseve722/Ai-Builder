import { Sparkles, Settings, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-semibold text-white">AI Builder</span>
        </div>
        <div className="h-6 w-px bg-gray-700 ml-2" />
        <span className="text-sm text-gray-400">Untitled Project</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          Deploy
        </button>
        <div className="h-6 w-px bg-gray-700" />
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <User className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
