import { MessageSquare, Palette, Eye, Code } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Section } from '../types';

const navItems: { id: Section; icon: typeof MessageSquare; label: string }[] = [
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'design', icon: Palette, label: 'Design' },
  { id: 'preview', icon: Eye, label: 'Preview' },
  { id: 'code', icon: Code, label: 'Code' },
];

export function Sidebar() {
  const { currentSection, setCurrentSection } = useApp();

  return (
    <aside className="w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-2">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setCurrentSection(id)}
          className={`
            w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all
            ${
              currentSection === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }
          `}
          title={label}
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </aside>
  );
}
