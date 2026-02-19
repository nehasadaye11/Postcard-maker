
import React from 'react';
import { PostcardDesign, PostcardElement, ElementType } from '../../types';
import { COLORS, PATTERNS } from '../../constants';

interface SidebarProps {
  addElement: (el: PostcardElement) => void;
  design: PostcardDesign;
  updateDesign: (updates: Partial<PostcardDesign>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ addElement, design, updateDesign }) => {
  const createTextElement = (content: string, type: ElementType = 'text') => {
    const newEl: PostcardElement = {
      id: `el-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 60,
      content,
      style: {
        fontSize: type === 'label' ? 16 : 24,
        color: '#2D3047',
        fontFamily: type === 'label' ? 'Gochi Hand' : 'Quicksand',
        textAlign: 'center'
      }
    };
    addElement(newEl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newEl: PostcardElement = {
          id: `el-${Date.now()}`,
          type: 'image',
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          content: event.target?.result as string,
          style: {
            borderRadius: 0,
            brightness: 100,
            contrast: 100,
            borderWidth: 0,
            borderColor: '#FFFFFF'
          }
        };
        addElement(newEl);
      };
      reader.readAsDataURL(file);
    }
  };

  const activePatternColor = design.backgroundPatternColor || '#2D3047';

  return (
    <div className="w-72 bg-[#E9E4DE] border-r-2 border-[#D5B9B2] overflow-y-auto p-4 flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
          Craft Tools
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => createTextElement('Lovely Message')}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border-b-4 border-[#D5B9B2] hover:translate-y-[2px] hover:border-b-2 active:translate-y-1 active:border-b-0 transition-all text-[#2D3047]"
          >
            <div className="w-8 h-8 flex items-center justify-center text-xl font-bold">T</div>
            <span className="text-[10px] font-bold mt-1 uppercase">Add Text</span>
          </button>
          
          <label className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border-b-4 border-[#D5B9B2] hover:translate-y-[2px] hover:border-b-2 cursor-pointer transition-all text-[#2D3047]">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#A8B5A2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-bold mt-1 uppercase">Upload Image</span>
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047] mb-3">Labels</h3>
        <div className="flex flex-wrap gap-2">
          {['To:', 'From:', 'Date:', 'Love,'].map(label => (
            <button 
              key={label}
              onClick={() => createTextElement(label, 'label')}
              className="px-3 py-1 bg-[#F4F1DE] border border-[#D5B9B2] rounded-md text-sm font-sketch text-[#2D3047] hover:bg-white transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047] mb-3">Background Color</h3>
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(COLORS).map(([name, code]) => (
            <button
              key={name}
              onClick={() => updateDesign({ backgroundColor: code })}
              className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${design.backgroundColor === code ? 'border-[#2D3047]' : 'border-white/50'}`}
              style={{ backgroundColor: code }}
              title={name}
            />
          ))}
          <div className="relative w-8 h-8 group">
            <input 
              type="color" 
              value={design.backgroundColor}
              onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="w-full h-full rounded-full border-2 border-dashed border-[#A8B5A2] flex items-center justify-center bg-white pointer-events-none group-hover:bg-gray-50"
              title="Custom Color"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A8B5A2]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047] mb-3">Pattern Overlay</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PATTERNS.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => updateDesign({ backgroundPattern: pattern.url })}
              className={`p-2 rounded-lg text-left text-[10px] font-bold border-2 transition-all ${design.backgroundPattern === pattern.url ? 'border-[#2D3047] bg-white text-[#2D3047]' : 'border-white/50 bg-white/20 text-[#2D3047]'}`}
            >
              <div 
                className="h-8 w-full mb-1 rounded bg-[#E9E4DE] paper-texture mix-blend-multiply opacity-80" 
                style={{ 
                  backgroundImage: pattern.url ? `url(${pattern.url})` : 'none',
                  backgroundColor: design.backgroundPattern === pattern.url ? activePatternColor : 'transparent'
                }}
              ></div>
              {pattern.label}
            </button>
          ))}
        </div>

        {design.backgroundPattern && design.backgroundPattern !== '' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-[10px] font-bold uppercase text-gray-400">Pattern Color</h4>
            <div className="flex flex-wrap gap-2 items-center">
              {Object.entries(COLORS).map(([name, code]) => (
                <button
                  key={name}
                  onClick={() => updateDesign({ backgroundPatternColor: code })}
                  className={`w-6 h-6 rounded-full border transition-transform active:scale-95 ${design.backgroundPatternColor === code ? 'border-[#2D3047]' : 'border-white/50'}`}
                  style={{ backgroundColor: code }}
                  title={name}
                />
              ))}
              <div className="relative w-6 h-6 group">
                <input 
                  type="color" 
                  value={activePatternColor}
                  onChange={(e) => updateDesign({ backgroundPatternColor: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="w-full h-full rounded-full border-2 border-dashed border-[#A8B5A2] flex items-center justify-center bg-white pointer-events-none group-hover:bg-gray-50"
                  title="Custom Pattern Color"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#A8B5A2]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D3047] mb-3">Layout Presets</h3>
        <div className="space-y-2">
          <button 
            onClick={() => updateDesign({ orientation: design.orientation === 'landscape' ? 'portrait' : 'landscape' })}
            className="w-full py-2 bg-[#A8B5A2] text-white rounded-lg text-xs font-bold uppercase shadow-sm active:translate-y-px"
          >
            Rotate: {design.orientation}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
