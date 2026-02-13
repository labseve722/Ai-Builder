import { supabase } from '../lib/supabase';
import { DesignElement } from '../types';

interface DBDesignElement {
  id: string;
  project_id: string;
  element_id: string;
  type: string;
  content?: string;
  styles: Record<string, string>;
  parent_id?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export async function saveDesignElement(
  projectId: string,
  element: DesignElement,
  parentDbId?: string,
  position: number = 0
): Promise<string | null> {
  const { data, error } = await supabase
    .from('design_elements')
    .upsert({
      project_id: projectId,
      element_id: element.id,
      type: element.type,
      content: element.content,
      styles: element.styles,
      parent_id: parentDbId,
      position,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving design element:', error);
    return null;
  }

  return data.id;
}

export async function saveDesignElements(
  projectId: string,
  elements: DesignElement[]
): Promise<boolean> {
  await supabase
    .from('design_elements')
    .delete()
    .eq('project_id', projectId);

  async function saveElementRecursive(
    element: DesignElement,
    parentDbId?: string,
    position: number = 0
  ): Promise<void> {
    const dbId = await saveDesignElement(projectId, element, parentDbId, position);

    if (dbId && element.children) {
      for (let i = 0; i < element.children.length; i++) {
        await saveElementRecursive(element.children[i], dbId, i);
      }
    }
  }

  try {
    for (let i = 0; i < elements.length; i++) {
      await saveElementRecursive(elements[i], undefined, i);
    }
    return true;
  } catch (error) {
    console.error('Error saving design elements:', error);
    return false;
  }
}

export async function getDesignElements(projectId: string): Promise<DesignElement[]> {
  const { data, error } = await supabase
    .from('design_elements')
    .select('*')
    .eq('project_id', projectId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching design elements:', error);
    return [];
  }

  return buildDesignTree(data || []);
}

function dbElementToDesignElement(dbElement: DBDesignElement): DesignElement {
  return {
    id: dbElement.element_id,
    type: dbElement.type as DesignElement['type'],
    content: dbElement.content,
    styles: dbElement.styles,
  };
}

function buildDesignTree(elements: DBDesignElement[]): DesignElement[] {
  const elementMap = new Map<string, { element: DesignElement; dbId: string; parentId?: string }>();
  const rootElements: DesignElement[] = [];

  elements.forEach((dbEl) => {
    const element = dbElementToDesignElement(dbEl);
    elementMap.set(dbEl.id, {
      element,
      dbId: dbEl.id,
      parentId: dbEl.parent_id,
    });
  });

  elementMap.forEach(({ element, parentId }) => {
    if (parentId) {
      const parentData = Array.from(elementMap.values()).find((e) => e.dbId === parentId);
      if (parentData) {
        if (!parentData.element.children) {
          parentData.element.children = [];
        }
        parentData.element.children.push(element);
      }
    } else {
      rootElements.push(element);
    }
  });

  return rootElements;
}

export async function initializeDefaultDesign(projectId: string): Promise<void> {
  const defaultElements: DesignElement[] = [
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
                backgroundColor: '#3b82f6',
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

  await saveDesignElements(projectId, defaultElements);
}
