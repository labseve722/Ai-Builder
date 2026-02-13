import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { DesignTool } from './components/DesignTool';
import { Preview } from './components/Preview';
import { CodeEditor } from './components/CodeEditor';
import { Loader2 } from 'lucide-react';

function App() {
  const { currentSection, isLoading } = useApp();

  const renderSection = () => {
    switch (currentSection) {
      case 'chat':
        return <Chat />;
      case 'design':
        return <DesignTool />;
      case 'preview':
        return <Preview />;
      case 'code':
        return <CodeEditor />;
      default:
        return <Chat />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default App;
