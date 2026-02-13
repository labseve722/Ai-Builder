import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DesignElement } from '../types';
import { X } from 'lucide-react';

function renderElement(
  element: DesignElement,
  onSelect: (el: DesignElement) => void,
  selectedId: string | null
): JSX.Element {
  const isSelected = element.id === selectedId;
  const Tag = element.type === 'button' ? 'button' : 'div';

  return (
    <Tag
      key={element.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
      style={element.styles}
      className={`
        transition-all cursor-pointer relative
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : 'hover:ring-1 hover:ring-gray-600'}
      `}
    >
      {element.content}
      {element.children?.map((child) => renderElement(child, onSelect, selectedId))}
    </Tag>
  );
}

function PropertiesPanel({
  element,
  onUpdate,
  onClose,
}: {
  element: DesignElement;
  onUpdate: (updates: Partial<DesignElement>) => void;
  onClose: () => void;
}) {
  const updateStyle = (key: string, value: string) => {
    onUpdate({
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Properties</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="pb-3 border-b border-gray-800">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Element Type</label>
          <p className="text-sm text-white mt-1 capitalize">{element.type}</p>
        </div>

        {(element.type === 'text' || element.type === 'button') && (
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
              Content
            </label>
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.styles.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={element.styles.backgroundColor || ''}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.styles.color || '#000000'}
              onChange={(e) => updateStyle('color', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={element.styles.color || ''}
              onChange={(e) => updateStyle('color', e.target.value)}
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Font Size
          </label>
          <input
            type="text"
            value={element.styles.fontSize || ''}
            onChange={(e) => updateStyle('fontSize', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="16px"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Font Weight
          </label>
          <select
            value={element.styles.fontWeight || 'normal'}
            onChange={(e) => updateStyle('fontWeight', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Padding
          </label>
          <input
            type="text"
            value={element.styles.padding || ''}
            onChange={(e) => updateStyle('padding', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8px or 8px 16px"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Margin
          </label>
          <input
            type="text"
            value={element.styles.margin || ''}
            onChange={(e) => updateStyle('margin', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8px or 8px 16px"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Border Radius
          </label>
          <input
            type="text"
            value={element.styles.borderRadius || ''}
            onChange={(e) => updateStyle('borderRadius', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8px"
          />
        </div>

        {element.type === 'container' && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                Display
              </label>
              <select
                value={element.styles.display || 'block'}
                onChange={(e) => updateStyle('display', e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="block">Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="inline-block">Inline Block</option>
              </select>
            </div>

            {element.styles.display === 'flex' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                    Flex Direction
                  </label>
                  <select
                    value={element.styles.flexDirection || 'row'}
                    onChange={(e) => updateStyle('flexDirection', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                    Justify Content
                  </label>
                  <select
                    value={element.styles.justifyContent || 'flex-start'}
                    onChange={(e) => updateStyle('justifyContent', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                    Align Items
                  </label>
                  <select
                    value={element.styles.alignItems || 'stretch'}
                    onChange={(e) => updateStyle('alignItems', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stretch">Stretch</option>
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Width
          </label>
          <input
            type="text"
            value={element.styles.width || ''}
            onChange={(e) => updateStyle('width', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="auto or 100% or 200px"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
            Height
          </label>
          <input
            type="text"
            value={element.styles.height || ''}
            onChange={(e) => updateStyle('height', e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="auto or 100% or 200px"
          />
        </div>
      </div>
    </div>
  );
}

export function DesignTool() {
  const { designElements, setDesignElements, selectedElement, setSelectedElement } = useApp();
  const [showProperties, setShowProperties] = useState(false);

  const handleSelectElement = (element: DesignElement) => {
    setSelectedElement(element);
    setShowProperties(true);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>): DesignElement[] => {
    return designElements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates };
      }
      if (el.children) {
        return { ...el, children: updateElement(id, updates) as DesignElement[] };
      }
      return el;
    });
  };

  const handleUpdateElement = (updates: Partial<DesignElement>) => {
    if (!selectedElement) return;
    const updated = updateElement(selectedElement.id, updates);
    setDesignElements(updated);
    const findElement = (els: DesignElement[], id: string): DesignElement | null => {
      for (const el of els) {
        if (el.id === id) return el;
        if (el.children) {
          const found = findElement(el.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    const updatedElement = findElement(updated, selectedElement.id);
    if (updatedElement) {
      setSelectedElement(updatedElement);
    }
  };

  return (
    <div className="flex h-full bg-gray-950">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Visual Editor</h2>
            <p className="text-gray-400 text-sm">
              Click on any element to edit its properties in real-time
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 min-h-[600px]">
            {designElements.map((element) =>
              renderElement(element, handleSelectElement, selectedElement?.id || null)
            )}
          </div>
        </div>
      </div>

      {showProperties && selectedElement && (
        <PropertiesPanel
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onClose={() => {
            setShowProperties(false);
            setSelectedElement(null);
          }}
        />
      )}
    </div>
  );
}
