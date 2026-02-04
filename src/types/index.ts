export type Section = 'chat' | 'design' | 'preview' | 'code';

export interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
  type?: 'plan' | 'progress' | 'changes' | 'normal';
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  language?: string;
}

export interface DesignElement {
  id: string;
  type: 'text' | 'container' | 'button' | 'image' | 'input';
  content?: string;
  styles: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
  };
  children?: DesignElement[];
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
