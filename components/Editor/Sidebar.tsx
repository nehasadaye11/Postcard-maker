
import React, { useState } from 'react';
import { PostcardDesign, PostcardElement, ElementType } from '../../types';
import { COLORS, PATTERNS, TEXTURES, STICKERS, TEMPLATES } from '../../constants';

interface SidebarProps {
  addElement: (el: PostcardElement) => void;
  design: PostcardDesign;
  updateDesign: (updates: Partial<PostcardDesign>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ addElement, design, updateDesign }) => {
  const [activeTab, setActiveTab] = useState<'craft' | 'stickers' | 'templates'>('craft');

  const createTextElement = (content: string, type: ElementType = 'text') => {
    const newEl: PostcardElement = {
      id: `el-${Date.now()}`,
      type,
      x: 250,
      y: 160,
      width: 300,
      height: 80,
      content,
      style: {
        fontSize: type === 'label' ? 24 : 32,
        color: '#2D3047',
        fontFamily: type === 'label' ? 'Special Elite' : 'Indie Flower',
        textAlign: 'center'
      }
    };
    addElement(newEl);
  };

  const addSticker = (url: string) => {
    const newEl: PostcardElement = {
      id: `el-${Date.now()}`,
      type: 'image',
      x: 340,
      y: 200,
      width: 120,
      height: 120,
      content: url,
      style: { borderRadius: 0, brightness: 100, contrast: 100, borderWidth: 0, borderColor: '#FFFFFF' }
    };
    addElement(newEl);
  };

  const applyTemplate = (template: any) => {
    updateDesign({
      backgroundColor: template.backgroundColor,
      elements: template.elements.map((el: any) => ({ ...el, id: `tel-${Math.random()}` }))
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newEl: PostcardElement = {
          id: `el-${Date.now()}`,
          type: 'image',
          x: 100,
          y: 100,
          width: 250,
          height: 200,
          content: event.target?.result as string,
          style: { borderRadius: 12, brightness: 100, contrast: 100, borderWidth: 4, borderColor: '#FFFFFF' }
        };
        addElement(newEl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-[#F2EDE9] border-r-2 border-[#D5B9B2] flex flex-col h-full overflow-hidden shadow-inner">
      <div className="flex bg-[#D5B9B2]/30 border-b-2 border-[#D5B9B2]">
        {(['craft', 'stickers', 'templates'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#F2EDE9] text-[#2D3047] border-b-2 border-[#2D3047]' : 'text-[#4A4E69] hover:bg-[#D5B9B2]/50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-10 custom-scroll">
        {activeTab === 'craft' && (
          <>
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047] mb-5 border-b border-[#D5B9B2]/50 pb-2">Craft Elements</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => createTextElement('Lovely Message...')} className="craft-btn group">
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform text-[#2D3047]">✎</span>
                  <span className="text-[10px] font-bold uppercase text-[#2D3047]">Add Text</span>
                </button>
                <label className="craft-btn cursor-pointer group">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform text-[#2D3047]">📷</span>
                  <span className="text-[10px] font-bold uppercase text-[#2D3047]">Photo</span>
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047] mb-5 border-b border-[#D5B9B2]/50 pb-2">Text Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'To:', text: 'To:' },
                  { label: 'From:', text: 'From:' },
                  { label: 'Love,', text: 'Love,' },
                  { label: 'Date:', text: `Date: ${new Date().toLocaleDateString()}` }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => createTextElement(item.text, 'label')}
                    className="py-2 px-3 bg-white border-2 border-[#D5B9B2]/50 rounded-xl text-[11px] font-bold text-[#2D3047] hover:border-[#2D3047] hover:bg-[#FDFCFB] transition-all shadow-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 border-b border-[#D5B9B2]/50 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047]">Paper Color</h3>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 group" title="Custom Color">
                    <input 
                      type="color" 
                      className="w-0 h-0 opacity-0 absolute" 
                      value={design.backgroundColor} 
                      onChange={(e) => updateDesign({ backgroundColor: e.target.value })} 
                    />
                    <div className="w-8 h-8 rounded-full border-2 border-[#D5B9B2] bg-white flex items-center justify-center text-[#2D3047] shadow-sm hover:scale-110 transition-transform hover:border-[#2D3047]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                  </label>
                  <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: design.backgroundColor }}></div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(COLORS).map(([name, code]) => (
                  <button
                    key={name}
                    onClick={() => updateDesign({ backgroundColor: code })}
                    title={name}
                    className={`w-9 h-9 rounded-full border-2 transition-all shadow-sm ${design.backgroundColor === code ? 'ring-2 ring-[#2D3047] ring-offset-2 scale-105' : 'border-white hover:scale-110'}`}
                    style={{ backgroundColor: code }}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 border-b border-[#D5B9B2]/50 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047]">1. Pattern Section</h3>
                <label className="cursor-pointer flex items-center gap-2 group" title="Pattern Color">
                  <input 
                    type="color" 
                    className="w-0 h-0 opacity-0 absolute" 
                    value={design.backgroundPatternColor || '#2D3047'} 
                    onChange={(e) => updateDesign({ backgroundPatternColor: e.target.value })} 
                  />
                  <div className="w-8 h-8 rounded-lg border-2 border-[#D5B9B2] bg-white flex items-center justify-center text-[#2D3047] shadow-sm hover:scale-110 transition-transform hover:border-[#2D3047]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PATTERNS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateDesign({ backgroundPattern: p.url })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all bg-white shadow-sm ${design.backgroundPattern === p.url ? 'border-[#2D3047] ring-1 ring-[#2D3047]' : 'border-[#D5B9B2]/30 hover:border-[#A8B5A2]'}`}
                  >
                    <div className="h-8 w-full rounded bg-gray-100 relative overflow-hidden">
                      {p.url && (
                        <div 
                          className="absolute inset-0" 
                          style={{ 
                            backgroundColor: design.backgroundPatternColor || '#2D3047',
                            WebkitMaskImage: `url("${p.url}")`,
                            maskImage: `url("${p.url}")`,
                            WebkitMaskRepeat: 'repeat',
                            maskRepeat: 'repeat',
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                            opacity: 0.8
                          }}
                        />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-[#2D3047] truncate w-full text-center">{p.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 border-b border-[#D5B9B2]/50 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047]">2. Texture Section</h3>
                <label className="cursor-pointer flex items-center gap-2 group" title="Texture Color">
                  <input 
                    type="color" 
                    className="w-0 h-0 opacity-0 absolute" 
                    value={design.backgroundTextureColor || '#FFFFFF'} 
                    onChange={(e) => updateDesign({ backgroundTextureColor: e.target.value })} 
                  />
                  <div className="w-8 h-8 rounded-lg border-2 border-[#D5B9B2] bg-white flex items-center justify-center text-[#2D3047] shadow-sm hover:scale-110 transition-transform hover:border-[#2D3047]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEXTURES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateDesign({ backgroundTexture: t.url })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all bg-white shadow-sm ${design.backgroundTexture === t.url ? 'border-[#2D3047] ring-1 ring-[#2D3047]' : 'border-[#D5B9B2]/30 hover:border-[#A8B5A2]'}`}
                  >
                    <div className="h-10 w-full rounded bg-gray-100 relative overflow-hidden">
                      {t.url && (
                        <div 
                          className="absolute inset-0" 
                          style={{ 
                            backgroundColor: design.backgroundTextureColor || '#FFFFFF',
                            backgroundImage: `url(${t.url})`,
                            backgroundRepeat: 'repeat',
                            mixBlendMode: 'multiply',
                            opacity: 0.8
                          }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-[#2D3047]">{t.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'stickers' && (
          <section>
             <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047] mb-5 border-b border-[#D5B9B2]/50 pb-2">Sticker Box</h3>
             <div className="grid grid-cols-2 gap-4">
              {STICKERS.map(s => (
                <button
                  key={s.id}
                  onClick={() => addSticker(s.url)}
                  className="bg-[#E9E4DE] p-4 rounded-2xl border-2 border-transparent hover:border-[#2D3047] hover:bg-white hover:shadow-md transition-all group flex flex-col items-center shadow-inner"
                >
                  <img 
                    src={s.url} 
                    alt={s.label} 
                    className="w-full h-auto max-h-16 object-contain group-hover:scale-110 transition-transform drop-shadow-sm" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/plasticine/200/star.png'; }}
                  />
                  <span className="text-[10px] font-bold uppercase text-[#4A4E69] mt-3">{s.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'templates' && (
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047] mb-5 border-b border-[#D5B9B2]/50 pb-2">Layout Templates</h3>
            <div className="space-y-4">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className="w-full p-4 bg-white border-2 border-[#D5B9B2]/30 rounded-2xl hover:border-[#A8B5A2] hover:shadow-lg text-left transition-all group"
                >
                  <div className="h-24 w-full rounded-lg mb-3 flex items-center justify-center text-2xl font-accent text-white shadow-inner overflow-hidden relative" style={{ backgroundColor: t.backgroundColor }}>
                    <div className="absolute inset-0 opacity-10 paper-texture"></div>
                    <span className="relative z-10 drop-shadow-md">Aa</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#2D3047]">{t.name}</span>
                    <span className="text-[9px] font-bold text-[#A8B5A2] uppercase">Apply</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .craft-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: white;
          border-radius: 1.25rem;
          border-bottom: 4px solid #D5B9B2;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          color: #2D3047;
        }
        .craft-btn:hover {
          transform: translateY(1px);
          border-bottom-width: 3px;
          background: #fafafa;
        }
        .craft-btn:active {
          transform: translateY(4px);
          border-bottom-width: 0px;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #D5B9B2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
