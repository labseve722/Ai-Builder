import { createContext, useContext, useState, ReactNode } from 'react';
import { Section, Message, FileNode, DesignElement, ViewportMode } from '../types';

interface AppContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  selectedFile: FileNode | null;
  setSelectedFile: (file: FileNode | null) => void;
  designElements: DesignElement[];
  setDesignElements: (elements: DesignElement[]) => void;
  selectedElement: DesignElement | null;
  setSelectedElement: (element: DesignElement | null) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  previewCode: string;
  setPreviewCode: (code: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFiles: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        id: '2',
        name: 'App.tsx',
        type: 'file',
        path: '/src/App.tsx',
        language: 'typescript',
        content: `function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to AI Builder</h1>
        <p className="text-xl text-gray-600 mb-8">Start creating amazing applications with AI assistance</p>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;`,
      },
      {
        id: '3',
        name: 'index.css',
        type: 'file',
        path: '/src/index.css',
        language: 'css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
    ],
  },
  {
    id: '4',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    language: 'json',
    content: `{
  "name": "ai-builder-project",
  "version": "1.0.0",
  "type": "module"
}`,
  },
];

const initialDesignElements: DesignElement[] = [
  {
    id: 'root',
    type: 'container',
    styles: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
      padding: '32px',
    },
    children: [
      {
        id: 'card',
        type: 'container',
        styles: {
          backgroundColor: '#ffffff',
          padding: '48px',
          borderRadius: '16px',
          width: '100%',
        },
        children: [
          {
            id: 'title',
            type: 'text',
            content: 'Welcome to AI Builder',
            styles: {
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 24px 0',
            },
          },
          {
            id: 'description',
            type: 'text',
            content: 'Start creating amazing applications with AI assistance',
            styles: {
              fontSize: '20px',
              color: '#4b5563',
              margin: '0 0 32px 0',
            },
          },
          {
            id: 'cta-button',
            type: 'button',
            content: 'Get Started',
            styles: {
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
            },
          },
        ],
      },
    ],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Hello! I\'m your AI assistant. I can help you build amazing applications. What would you like to create today?',
      timestamp: new Date(),
      type: 'normal',
    },
  ]);
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>(initialDesignElements);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [previewCode, setPreviewCode] = useState<string>('');

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        messages,
        addMessage,
        files,
        setFiles,
        selectedFile,
        setSelectedFile,
        designElements,
        setDesignElements,
        selectedElement,
        setSelectedElement,
        viewportMode,
        setViewportMode,
        previewCode,
        setPreviewCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
