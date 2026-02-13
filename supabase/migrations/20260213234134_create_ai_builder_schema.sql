/*
  # AI Builder Application Schema

  ## Overview
  Creates the complete database schema for the AI Builder application, enabling users to create, manage, and persist their development projects with chat history, file management, and visual design tools.

  ## New Tables
  
  ### projects
  - `id` (uuid, primary key) - Unique project identifier
  - `name` (text) - Project name
  - `description` (text, nullable) - Project description
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### messages
  - `id` (uuid, primary key) - Unique message identifier
  - `project_id` (uuid, foreign key) - References projects table
  - `role` (text) - Message role: 'user' or 'system'
  - `content` (text) - Message content
  - `type` (text) - Message type: 'plan', 'progress', 'changes', or 'normal'
  - `created_at` (timestamptz) - Message timestamp
  
  ### files
  - `id` (uuid, primary key) - Unique file identifier
  - `project_id` (uuid, foreign key) - References projects table
  - `name` (text) - File or folder name
  - `type` (text) - 'file' or 'folder'
  - `path` (text) - Full file path
  - `content` (text, nullable) - File content (null for folders)
  - `language` (text, nullable) - Programming language for syntax highlighting
  - `parent_id` (uuid, nullable) - Parent folder reference for hierarchical structure
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### design_elements
  - `id` (uuid, primary key) - Element identifier (matches client-side ID)
  - `project_id` (uuid, foreign key) - References projects table
  - `element_id` (text) - Client-side element ID
  - `type` (text) - Element type: 'text', 'container', 'button', 'image', 'input'
  - `content` (text, nullable) - Element text content
  - `styles` (jsonb) - CSS styles as JSON object
  - `parent_id` (uuid, nullable) - Parent element reference for nesting
  - `position` (integer) - Order position among siblings
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Currently open access for development (authentication will be added later)
  - Future: Will restrict based on user ownership
  
  ### Indexes
  - Foreign key indexes for optimal join performance
  - Path indexes for file tree queries
  - Position indexes for ordered element retrieval

  ## Notes
  - JSONB used for flexible style storage in design_elements
  - Hierarchical structures supported via parent_id for files and design_elements
  - Timestamps automatically managed with triggers
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Untitled Project',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'system')),
  content text NOT NULL,
  type text DEFAULT 'normal' CHECK (type IN ('plan', 'progress', 'changes', 'normal')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'folder')),
  path text NOT NULL,
  content text,
  language text,
  parent_id uuid REFERENCES files(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, path)
);

CREATE TABLE IF NOT EXISTS design_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  element_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'container', 'button', 'image', 'input')),
  content text,
  styles jsonb DEFAULT '{}'::jsonb,
  parent_id uuid REFERENCES design_elements(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, element_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_parent_id ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_files_path ON files(path);
CREATE INDEX IF NOT EXISTS idx_design_elements_project_id ON design_elements(project_id);
CREATE INDEX IF NOT EXISTS idx_design_elements_parent_id ON design_elements(parent_id);
CREATE INDEX IF NOT EXISTS idx_design_elements_position ON design_elements(position);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_elements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to projects"
  ON projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to messages"
  ON messages
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to files"
  ON files
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to design_elements"
  ON design_elements
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_elements_updated_at BEFORE UPDATE ON design_elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
