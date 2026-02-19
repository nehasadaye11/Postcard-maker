
import React, { useEffect, useRef, useState } from 'react';
import { PostcardElement } from '../../types';
import { COLORS, FONTS } from '../../constants';
import { GoogleGenAI } from "@google/genai";

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
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'label')) {
      textAreaRef.current?.focus();
    }
  }, [selectedElement?.id]);

  const enhanceText = async () => {
    if (!selectedElement?.content) return;
    setIsEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this postcard message to be warmer, cozier, and more charming. Keep it short (max 20 words). Original: "${selectedElement.content}"`,
        config: { temperature: 0.8 }
      });
      const enhanced = response.text?.replace(/"/g, '') || selectedElement.content;
      updateElement(selectedElement.id, { content: enhanced });
    } catch (e) {
      console.error("AI enhancement failed", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-72 bg-[#F2EDE9] border-l-2 border-[#D5B9B2] p-6 flex flex-col items-center justify-center text-center shadow-inner">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 text-[#D5B9B2] shadow-sm animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-[#2D3047] mb-2 uppercase tracking-widest">Select an Item</h4>
        <p className="text-[11px] font-bold text-[#4A4E69] italic opacity-60">Tap anything on your canvas to start customizing its magic.</p>
      </div>
    );
  }

  const isText = selectedElement.type === 'text' || selectedElement.type === 'label';

  return (
    <div className="w-72 bg-[#F2EDE9] border-l-2 border-[#D5B9B2] overflow-y-auto p-6 space-y-8 custom-scroll shadow-inner">
      <div className="flex items-center justify-between border-b border-[#D5B9B2]/50 pb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2D3047]">Element Settings</h3>
        <div className="flex gap-3">
           <button onClick={() => duplicateElement(selectedElement.id)} title="Duplicate" className="text-[#81B29A] hover:text-[#58816c] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a4 4 0 00-4 4v5H5V5z" />
            </svg>
          </button>
          <button onClick={() => deleteElement(selectedElement.id)} title="Delete" className="text-[#E29578] hover:text-[#b36d54] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {isText && (
        <section className="space-y-6">
          <div className="relative">
            <label className="text-[11px] font-bold uppercase text-[#2D3047] block mb-2 tracking-wide">Your Message</label>
            <textarea
              ref={textAreaRef}
              className="w-full p-4 bg-white border-2 border-[#D5B9B2] rounded-2xl text-sm font-medium text-[#2D3047] resize-none focus:border-[#A8B5A2] focus:ring-1 focus:ring-[#A8B5A2] focus:outline-none transition-all shadow-sm"
              rows={4}
              value={selectedElement.content}
              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
            />
            <button
              onClick={enhanceText}
              disabled={isEnhancing}
              className={`absolute bottom-3 right-3 px-4 py-1.5 bg-[#2D3047] text-white text-[10px] font-bold uppercase rounded-full hover:scale-105 transition-all shadow-md disabled:opacity-50 flex items-center gap-1`}
            >
              {isEnhancing ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : '✨ Cozy AI'}
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#2D3047] block mb-2 tracking-wide">Font Style</label>
            <select
              className="w-full p-3 bg-white border-2 border-[#D5B9B2] rounded-xl text-sm text-[#2D3047] focus:border-[#A8B5A2] focus:outline-none cursor-pointer mb-4 shadow-sm"
              value={selectedElement.style.fontFamily}
              onChange={(e) => updateElement(selectedElement.id, { style: { fontFamily: e.target.value } })}
            >
              {FONTS.map(f => <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>{f.name}</option>)}
            </select>
            
            <div className="flex items-center justify-between mb-1">
               <label className="text-[10px] font-bold uppercase text-[#4A4E69]">Size</label>
               <span className="text-[10px] font-bold text-[#2D3047]">{selectedElement.style.fontSize}px</span>
            </div>
            <input type="range" min="8" max="120" value={selectedElement.style.fontSize} onChange={(e) => updateElement(selectedElement.id, { style: { fontSize: parseInt(e.target.value) } })} className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#2D3047]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase text-[#2D3047] tracking-wide">Text Color</label>
              <label className="cursor-pointer" title="Custom Color">
                <input 
                  type="color" 
                  className="w-0 h-0 opacity-0 absolute" 
                  value={selectedElement.style.color || '#2D3047'} 
                  onChange={(e) => updateElement(selectedElement.id, { style: { color: e.target.value } })} 
                />
                <div className="w-8 h-8 rounded-full border-2 border-[#D5B9B2] bg-white flex items-center justify-center text-[#2D3047] shadow-sm hover:scale-110 transition-transform hover:border-[#2D3047]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {Object.values(COLORS).map(color => (
                <button
                  key={color}
                  onClick={() => updateElement(selectedElement.id, { style: { color } })}
                  className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm ${selectedElement.style.color === color ? 'border-[#2D3047] scale-110 ring-1 ring-[#2D3047]' : 'border-white hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => updateElement(selectedElement.id, { style: { textAlign: align } })}
                className={`flex-1 py-2 rounded-lg border-2 text-[10px] font-bold uppercase transition-all ${selectedElement.style.textAlign === align ? 'bg-[#2D3047] text-white border-[#2D3047]' : 'bg-white text-[#2D3047] border-[#D5B9B2]/30'}`}
              >
                {align}
              </button>
            ))}
          </div>
        </section>
      )}

      {!isText && (
        <section className="space-y-6">
           <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#D5B9B2]/30">
              <label className="text-[11px] font-bold uppercase text-[#2D3047] block mb-3 tracking-wide">Rounding</label>
              <input type="range" min="0" max="200" value={selectedElement.style.borderRadius} onChange={(e) => updateElement(selectedElement.id, { style: { borderRadius: parseInt(e.target.value) } })} className="w-full h-2 bg-[#F5EBE0] rounded-lg appearance-none cursor-pointer accent-[#2D3047]" />
           </div>
           
           <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#D5B9B2]/30">
              <label className="text-[11px] font-bold uppercase text-[#2D3047] block mb-3 tracking-wide">Brightness</label>
              <input type="range" min="0" max="200" value={selectedElement.style.brightness} onChange={(e) => updateElement(selectedElement.id, { style: { brightness: parseInt(e.target.value) } })} className="w-full h-2 bg-[#F5EBE0] rounded-lg appearance-none cursor-pointer accent-[#2D3047]" />
           </div>

           <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#D5B9B2]/30">
              <label className="text-[11px] font-bold uppercase text-[#2D3047] block mb-3 tracking-wide">Contrast</label>
              <input type="range" min="0" max="200" value={selectedElement.style.contrast} onChange={(e) => updateElement(selectedElement.id, { style: { contrast: parseInt(e.target.value) } })} className="w-full h-2 bg-[#F5EBE0] rounded-lg appearance-none cursor-pointer accent-[#2D3047]" />
           </div>
        </section>
      )}

      <div className="pt-8 border-t border-[#D5B9B2]/50 text-center">
        <p className="text-[10px] text-[#4A4E69] font-bold uppercase tracking-widest italic opacity-50">Cozy Hand-finished Details</p>
      </div>
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #D5B9B2; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PropertiesPanel;
