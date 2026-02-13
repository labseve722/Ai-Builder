import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export async function createProject(name: string, description?: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert({ name, description })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating project:', error);
    return false;
  }

  return true;
}

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing projects:', error);
    return [];
  }

  return data || [];
}
