import { supabase } from '../lib/supabase';
import { FileNode } from '../types';

interface DBFile {
  id: string;
  project_id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export async function createFile(
  projectId: string,
  file: Omit<FileNode, 'id'> & { parentId?: string }
): Promise<FileNode | null> {
  const { data, error } = await supabase
    .from('files')
    .insert({
      project_id: projectId,
      name: file.name,
      type: file.type,
      path: file.path,
      content: file.content,
      language: file.language,
      parent_id: file.parentId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating file:', error);
    return null;
  }

  return dbFileToFileNode(data);
}

export async function updateFile(
  fileId: string,
  updates: { content?: string; name?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from('files')
    .update(updates)
    .eq('id', fileId);

  if (error) {
    console.error('Error updating file:', error);
    return false;
  }

  return true;
}

export async function getFiles(projectId: string): Promise<FileNode[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .order('path', { ascending: true });

  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }

  return buildFileTree(data || []);
}

function dbFileToFileNode(dbFile: DBFile): FileNode {
  return {
    id: dbFile.id,
    name: dbFile.name,
    type: dbFile.type,
    path: dbFile.path,
    content: dbFile.content,
    language: dbFile.language,
  };
}

function buildFileTree(files: DBFile[]): FileNode[] {
  const fileMap = new Map<string, FileNode>();
  const rootFiles: FileNode[] = [];

  files.forEach((file) => {
    fileMap.set(file.id, dbFileToFileNode(file));
  });

  files.forEach((file) => {
    const node = fileMap.get(file.id)!;

    if (file.parent_id) {
      const parent = fileMap.get(file.parent_id);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    } else {
      rootFiles.push(node);
    }
  });

  return rootFiles;
}

export async function initializeDefaultFiles(projectId: string): Promise<void> {
  const defaultFiles = [
    {
      name: 'src',
      type: 'folder' as const,
      path: '/src',
      parentId: undefined,
    },
    {
      name: 'package.json',
      type: 'file' as const,
      path: '/package.json',
      language: 'json',
      content: `{
  "name": "ai-builder-project",
  "version": "1.0.0",
  "type": "module"
}`,
      parentId: undefined,
    },
  ];

  for (const file of defaultFiles) {
    await createFile(projectId, file);
  }

  const { data: srcFolder } = await supabase
    .from('files')
    .select('id')
    .eq('project_id', projectId)
    .eq('path', '/src')
    .maybeSingle();

  if (srcFolder) {
    const srcFiles = [
      {
        name: 'App.tsx',
        type: 'file' as const,
        path: '/src/App.tsx',
        language: 'typescript',
        content: `function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to AI Builder</h1>
        <p className="text-xl text-gray-600 mb-8">Start creating amazing applications with AI assistance</p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;`,
        parentId: srcFolder.id,
      },
      {
        name: 'index.css',
        type: 'file' as const,
        path: '/src/index.css',
        language: 'css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        parentId: srcFolder.id,
      },
    ];

    for (const file of srcFiles) {
      await createFile(projectId, file);
    }
  }
}
