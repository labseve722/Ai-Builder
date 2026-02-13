import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Section, Message, FileNode, DesignElement, ViewportMode } from '../types';
import { createProject, getProject, updateProject, Project } from '../services/projectService';
import { createMessage, getMessages } from '../services/messageService';
import { getFiles, updateFile, initializeDefaultFiles } from '../services/fileService';
import { getDesignElements, saveDesignElements, initializeDefaultDesign } from '../services/designService';

interface AppContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  selectedFile: FileNode | null;
  setSelectedFile: (file: FileNode | null) => void;
  updateFileContent: (fileId: string, content: string) => Promise<void>;
  designElements: DesignElement[];
  setDesignElements: (elements: DesignElement[]) => void;
  saveDesign: () => Promise<void>;
  selectedElement: DesignElement | null;
  setSelectedElement: (element: DesignElement | null) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  previewCode: string;
  setPreviewCode: (code: string) => void;
  currentProject: Project | null;
  isLoading: boolean;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [previewCode, setPreviewCode] = useState<string>('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeProject();
  }, []);

  async function initializeProject() {
    setIsLoading(true);

    let projectId = localStorage.getItem('currentProjectId');
    let project: Project | null = null;

    if (projectId) {
      project = await getProject(projectId);
    }

    if (!project) {
      project = await createProject('Untitled Project');
      if (project) {
        localStorage.setItem('currentProjectId', project.id);
        await initializeDefaultFiles(project.id);
        await initializeDefaultDesign(project.id);

        await createMessage(project.id, {
          role: 'system',
          content: 'Hello! I\'m your AI assistant. I can help you build amazing applications. What would you like to create today?',
          type: 'normal',
        });
      }
    }

    if (project) {
      setCurrentProject(project);
      await loadProjectData(project.id);
    }

    setIsLoading(false);
  }

  async function loadProjectData(projectId: string) {
    const [loadedMessages, loadedFiles, loadedDesign] = await Promise.all([
      getMessages(projectId),
      getFiles(projectId),
      getDesignElements(projectId),
    ]);

    setMessages(loadedMessages);
    setFiles(loadedFiles);
    setDesignElements(loadedDesign);
  }

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentProject) return;

    const newMessage = await createMessage(currentProject.id, message);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const updateFileContent = async (fileId: string, content: string) => {
    if (!currentProject) return;

    const success = await updateFile(fileId, { content });
    if (success) {
      const updatedFiles = await getFiles(currentProject.id);
      setFiles(updatedFiles);
    }
  };

  const saveDesign = async () => {
    if (!currentProject) return;

    await saveDesignElements(currentProject.id, designElements);
  };

  useEffect(() => {
    if (currentProject && designElements.length > 0) {
      const timeoutId = setTimeout(() => {
        saveDesign();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [designElements, currentProject]);

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
        updateFileContent,
        designElements,
        setDesignElements,
        saveDesign,
        selectedElement,
        setSelectedElement,
        viewportMode,
        setViewportMode,
        previewCode,
        setPreviewCode,
        currentProject,
        isLoading,
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
