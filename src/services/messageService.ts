import { supabase } from '../lib/supabase';
import { Message } from '../types';

interface DBMessage {
  id: string;
  project_id: string;
  role: 'user' | 'system';
  content: string;
  type: 'plan' | 'progress' | 'changes' | 'normal';
  created_at: string;
}

export async function createMessage(
  projectId: string,
  message: Omit<Message, 'id' | 'timestamp'>
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      project_id: projectId,
      role: message.role,
      content: message.content,
      type: message.type || 'normal',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating message:', error);
    return null;
  }

  return {
    id: data.id,
    role: data.role,
    content: data.content,
    type: data.type,
    timestamp: new Date(data.created_at),
  };
}

export async function getMessages(projectId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return (data || []).map((msg: DBMessage) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    type: msg.type,
    timestamp: new Date(msg.created_at),
  }));
}
