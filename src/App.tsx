import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { DesignTool } from './components/DesignTool';
import { Preview } from './components/Preview';
import { CodeEditor } from './components/CodeEditor';

function App() {
  const { currentSection } = useApp();

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
