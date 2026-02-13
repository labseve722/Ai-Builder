import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FileNode } from '../types';

function FileTreeItem({
  node,
  level = 0,
  onSelect,
  selectedId,
}: {
  node: FileNode;
  level?: number;
  onSelect: (file: FileNode) => void;
  selectedId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else {
            onSelect(node);
          }
        }}
        className={`
          flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors
          ${isSelected ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {isFolder && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {!isFolder && <span className="w-4" />}

        {isFolder ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )
        ) : (
          <File className="w-4 h-4" />
        )}

        <span className="text-sm font-medium">{node.name}</span>
      </div>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CodeEditor() {
  const { files, selectedFile, setSelectedFile, updateFileContent } = useApp();
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSelectFile = (file: FileNode) => {
    setSelectedFile(file);
    setEditedContent(file.content || '');
    setHasChanges(false);
  };

  const handleContentChange = (content: string) => {
    setEditedContent(content);
    setHasChanges(content !== (selectedFile?.content || ''));
  };

  const handleSave = async () => {
    if (!selectedFile || !hasChanges) return;

    setIsSaving(true);
    await updateFileContent(selectedFile.id, editedContent);
    setHasChanges(false);
    setIsSaving(false);
  };

  return (
    <div className="flex h-full bg-gray-950">
      <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Files</h3>
        </div>

        <div className="py-2">
          {files.map((file) => (
            <FileTreeItem
              key={file.id}
              node={file}
              onSelect={handleSelectFile}
              selectedId={selectedFile?.id || null}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-2">
              <File className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500 ml-2">{selectedFile.path}</span>
            </div>

            <div className="flex-1 overflow-hidden">
              <textarea
                value={editedContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full bg-gray-950 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none"
                style={{
                  tabSize: 2,
                  lineHeight: '1.6',
                }}
                spellCheck={false}
              />
            </div>

            <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Language: {selectedFile.language || 'plaintext'}</span>
                <span>Lines: {editedContent.split('\n').length}</span>
                <span>Characters: {editedContent.length}</span>
                {hasChanges && <span className="text-yellow-400">• Unsaved changes</span>}
              </div>

              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-colors"
              >
                {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <File className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Select a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
