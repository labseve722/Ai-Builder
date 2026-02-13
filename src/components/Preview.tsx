import { Monitor, Tablet, Smartphone, RotateCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewportMode, DesignElement } from '../types';

const viewportSizes: Record<ViewportMode, { width: string; height: string }> = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' },
};

function renderPreviewElement(element: DesignElement): JSX.Element {
  const Tag = element.type === 'button' ? 'button' : 'div';

  return (
    <Tag key={element.id} style={element.styles}>
      {element.content}
      {element.children?.map((child) => renderPreviewElement(child))}
    </Tag>
  );
}

export function Preview() {
  const { viewportMode, setViewportMode, designElements } = useApp();

  const viewportButtons: { mode: ViewportMode; icon: typeof Monitor; label: string }[] = [
    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>

          <div className="flex items-center gap-2">
            {viewportButtons.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewportMode(mode)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${
                    viewportMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }
                `}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}

            <div className="w-px h-6 bg-gray-700 mx-2" />

            <button
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
              title="Refresh"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-900 p-8">
        <div className="flex items-center justify-center min-h-full">
          <div
            className="bg-white shadow-2xl transition-all duration-300"
            style={{
              width: viewportSizes[viewportMode].width,
              height: viewportSizes[viewportMode].height,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div className="w-full h-full overflow-auto">
              {designElements.map((element) => renderPreviewElement(element))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border-t border-gray-800 px-6 py-3">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>
            Viewport: {viewportSizes[viewportMode].width} × {viewportSizes[viewportMode].height}
          </span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
