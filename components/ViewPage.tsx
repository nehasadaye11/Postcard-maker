
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PostcardDesign } from '../types';

const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [design, setDesign] = useState<PostcardDesign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to load from the URL data parameter (Real Sharing)
    const searchParams = new URLSearchParams(location.search);
    const encodedData = searchParams.get('data');

    if (encodedData) {
      try {
        const decodedStr = decodeURIComponent(atob(encodedData));
        const parsed = JSON.parse(decodedStr);
        setDesign(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to decode shared data", e);
      }
    }

    // 2. Fallback to Local Storage (Same browser history)
    const saved = localStorage.getItem(`postcard_${id}`);
    if (saved) {
      try {
        setDesign(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load local design", e);
      }
    }
    setLoading(false);
  }, [id, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#A8B5A2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-[#2D3047] italic">Opening your mail...</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="text-6xl animate-float">✉</div>
        <h1 className="text-2xl font-bold text-[#3D405B]">Postcard not found...</h1>
        <p className="text-gray-600 font-medium">Maybe it was lost in the mail or the link is incomplete?</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-[#E29578] text-white font-bold rounded-full uppercase tracking-widest shadow-lg hover:translate-y-[-2px] transition-all"
        >
          Create My Own
        </button>
      </div>
    );
  }

  const isLandscape = design.orientation === 'landscape';
  const aspectRatio = isLandscape ? '6/4' : '4/6';
  const maxWidth = isLandscape ? 800 : 533;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[#F5EBE0] paper-texture">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-12">
        <header className="text-center space-y-3">
          <div className="inline-block bg-[#A8B5A2] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">Special Delivery</div>
          <h1 className="text-5xl font-accent text-[#2D3047]">A little hello for you</h1>
          <p className="text-[#4A4E69] font-bold italic opacity-70">Sent from Cozy Postcard Studio</p>
        </header>

        <div 
          className="relative craft-shadow bg-white overflow-hidden rounded-[4px] ring-8 ring-white"
          style={{
            aspectRatio,
            width: '100%',
            maxWidth: `${maxWidth}px`,
            backgroundColor: design.backgroundColor,
          }}
        >
          {/* Customizable Pattern Overlay Layer */}
          {design.backgroundPattern && design.backgroundPattern !== '' && (
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                backgroundColor: design.backgroundPatternColor || '#2D3047',
                WebkitMaskImage: `url(${design.backgroundPattern})`,
                maskImage: `url(${design.backgroundPattern})`,
                WebkitMaskRepeat: 'repeat',
                maskRepeat: 'repeat',
                opacity: 0.5,
                mixBlendMode: 'multiply'
              }}
            />
          )}

          {design.elements.map((el) => (
            <div
              key={el.id}
              className="absolute select-none"
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
              }}
            >
              {el.type === 'text' || el.type === 'label' ? (
                <div 
                  className="w-full h-full flex items-center justify-center p-2 break-words"
                  style={{
                    fontSize: `${el.style.fontSize}px`,
                    color: el.style.color,
                    fontFamily: el.style.fontFamily,
                    textAlign: el.style.textAlign || 'center',
                  }}
                >
                  {el.content}
                </div>
              ) : (
                <img 
                  src={el.content} 
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: `${el.style.borderRadius}px`,
                    filter: `brightness(${el.style.brightness}%) contrast(${el.style.contrast}%)`,
                    border: el.style.borderWidth ? `${el.style.borderWidth}px solid ${el.style.borderColor}` : 'none'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 sm:flex-row flex-col w-full sm:w-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex-1 px-10 py-4 bg-[#81B29A] text-white font-bold rounded-full hover:shadow-xl hover:translate-y-[-2px] transition-all uppercase tracking-widest text-sm"
          >
            Create Your Own
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 px-10 py-4 bg-white text-[#2D3047] border-2 border-[#D5B9B2] font-bold rounded-full hover:bg-gray-50 transition-all uppercase tracking-widest text-sm"
          >
            Save as PDF
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Made with love in the craft studio</p>
      </div>
    </div>
  );
};

export default ViewPage;
