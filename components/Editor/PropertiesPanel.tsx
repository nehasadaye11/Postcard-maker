
import React, { useEffect, useRef } from 'react';
import { PostcardElement } from '../../types';
import { COLORS, FONTS } from '../../constants';

interface PropertiesPanelProps {
  selectedElement: PostcardElement | null;
  updateElement: (id: string, updates: Partial<PostcardElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement, 
  updateElement, 
  deleteElement, 
  duplicateElement 
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the text area when a text element is selected for efficiency
  useEffect(() => {
    if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'label')) {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    }
  }, [selectedElement?.id]);

  if (!selectedElement) {
    return (
      <div className="w-72 bg-[#E9E4DE] border-l-2 border-[#D5B9B2] p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-4 text-[#D5B9B2]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <p className="text-sm font-bold text-[#4A4E69] italic">Select an element on the canvas to customize it.</p>
      </div>
    );
  }

  const isText = selectedElement.type === 'text' || selectedElement.type === 'label';
  const isImage = selectedElement.type === 'image';

  return (
    <div className="w-72 bg-[#E9E4DE] border-l-2 border-[#D5B9B2] overflow-y-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047]">Edit Element</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1.5 bg-white/50 rounded-lg text-[#2D3047] hover:bg-white hover:text-[#A8B5A2] transition-colors" 
            title="Duplicate (Ctrl+D)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a4 4 0 00-4 4v6H5V5z" />
            </svg>
          </button>
          <button 
            onClick={() => deleteElement(selectedElement.id)}
            className="p-1.5 bg-white/50 rounded-lg text-[#2D3047] hover:bg-red-50 hover:text-red-600 transition-colors" 
            title="Delete (Del)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {isText && (
        <section className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Text Content</label>
            <textarea
              ref={textAreaRef}
              className="w-full p-3 bg-white border-2 border-[#D5B9B2] rounded-xl text-sm font-medium text-[#2D3047] resize-none focus:border-[#A8B5A2] focus:outline-none shadow-sm transition-all"
              rows={3}
              value={selectedElement.content}
              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
              placeholder="Type something lovely..."
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Font Family</label>
            <select
              className="w-full p-2.5 bg-white border-2 border-[#D5B9B2] rounded-lg text-sm text-[#2D3047] shadow-sm focus:border-[#A8B5A2] focus:outline-none transition-all cursor-pointer"
              value={selectedElement.style.fontFamily}
              onChange={(e) => updateElement(selectedElement.id, { style: { fontFamily: e.target.value } })}
            >
              {FONTS.map(f => <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Size & Alignment</label>
            <div className="flex items-center gap-4 mb-3">
              <input 
                type="range" min="8" max="120" 
                value={selectedElement.style.fontSize} 
                onChange={(e) => updateElement(selectedElement.id, { style: { fontSize: parseInt(e.target.value) } })}
                className="flex-1 accent-[#A8B5A2] h-1.5 bg-white rounded-full appearance-none cursor-pointer"
              />
              <span className="text-xs font-bold text-[#2D3047] w-10 text-right">{selectedElement.style.fontSize}px</span>
            </div>
            <div className="flex bg-white rounded-lg border-2 border-[#D5B9B2] overflow-hidden shadow-sm">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => updateElement(selectedElement.id, { style: { textAlign: align } })}
                  className={`flex-1 py-1.5 text-xs font-bold capitalize transition-colors ${selectedElement.style.textAlign === align ? 'bg-[#A8B5A2] text-white' : 'text-[#2D3047] hover:bg-gray-50'}`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-2">Color</label>
            <div className="flex flex-wrap gap-2.5 items-center">
              {Object.values(COLORS).map(color => (
                <button
                  key={color}
                  onClick={() => updateElement(selectedElement.id, { style: { color } })}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${selectedElement.style.color === color ? 'border-[#2D3047] scale-110 shadow-md ring-2 ring-[#2D3047]/10' : 'border-white hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="relative w-7 h-7 group">
                <input 
                  type="color" 
                  value={selectedElement.style.color}
                  onChange={(e) => updateElement(selectedElement.id, { style: { color: e.target.value } })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="w-full h-full rounded-full border-2 border-dashed border-[#A8B5A2] flex items-center justify-center bg-white pointer-events-none group-hover:bg-gray-50 transition-colors"
                  title="Custom Text Color"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#A8B5A2]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isImage && (
        <section className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Rounded Corners</label>
            <input 
              type="range" min="0" max="100" 
              value={selectedElement.style.borderRadius} 
              onChange={(e) => updateElement(selectedElement.id, { style: { borderRadius: parseInt(e.target.value) } })}
              className="w-full accent-[#A8B5A2] h-1.5 bg-white rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Brightness</label>
            <input 
              type="range" min="0" max="200" 
              value={selectedElement.style.brightness} 
              onChange={(e) => updateElement(selectedElement.id, { style: { brightness: parseInt(e.target.value) } })}
              className="w-full accent-[#A8B5A2] h-1.5 bg-white rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Contrast</label>
            <input 
              type="range" min="0" max="200" 
              value={selectedElement.style.contrast} 
              onChange={(e) => updateElement(selectedElement.id, { style: { contrast: parseInt(e.target.value) } })}
              className="w-full accent-[#A8B5A2] h-1.5 bg-white rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#4A4E69] block mb-1">Paper Border</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" min="0" max="20" 
                value={selectedElement.style.borderWidth} 
                onChange={(e) => updateElement(selectedElement.id, { style: { borderWidth: parseInt(e.target.value) } })}
                className="flex-1 accent-[#A8B5A2] h-1.5 bg-white rounded-full appearance-none cursor-pointer"
              />
              <button 
                className="w-9 h-9 rounded-lg border-2 border-white shadow-sm ring-1 ring-[#D5B9B2] transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: selectedElement.style.borderColor }}
                onClick={() => updateElement(selectedElement.id, { style: { borderColor: selectedElement.style.borderColor === '#FFFFFF' ? '#F5EBE0' : '#FFFFFF' } })}
              />
            </div>
          </div>
        </section>
      )}

      <div className="pt-8 border-t border-[#D5B9B2]/30 text-center">
        <p className="text-[10px] text-[#4A4E69] font-medium italic">“Every piece you add makes it more special.”</p>
      </div>
    </div>
  );
};

export default PropertiesPanel;
