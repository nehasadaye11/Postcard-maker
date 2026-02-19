
import React, { useRef, useState, useEffect } from 'react';
import { PostcardDesign, PostcardElement } from '../../types';

interface CanvasProps {
  design: PostcardDesign;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<PostcardElement>) => void;
  deleteElement: (id: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  design, 
  selectedElementId, 
  setSelectedElementId, 
  updateElement,
  deleteElement 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isLandscape = design.orientation === 'landscape';
  const aspectRatio = isLandscape ? '6/4' : '4/6';

  const handleMouseDown = (e: React.MouseEvent, element: PostcardElement) => {
    setSelectedElementId(element.id);
    if (e.button !== 0) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - element.x,
      y: e.clientY - element.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, element: PostcardElement) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragOffset({
      x: e.clientX - element.width,
      y: e.clientY - element.height
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElementId) return;

    if (isDragging) {
      updateElement(selectedElementId, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing) {
      updateElement(selectedElementId, {
        width: Math.max(40, e.clientX - dragOffset.x),
        height: Math.max(40, e.clientY - dragOffset.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <div 
      id="postcard-canvas"
      className="relative craft-shadow bg-white overflow-hidden rounded-[4px] ring-8 ring-white transform transition-transform"
      style={{
        aspectRatio,
        width: '100%',
        maxWidth: isLandscape ? '800px' : '533px',
        backgroundColor: design.backgroundColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedElementId(null);
      }}
    >
      {/* Texture Layer */}
      {design.backgroundTexture && (
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundColor: design.backgroundTextureColor || '#FFFFFF',
            backgroundImage: `url(${design.backgroundTexture})`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply',
            opacity: 0.8
          }}
        />
      )}

      {/* Pattern Layer */}
      {design.backgroundPattern && (
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundColor: design.backgroundPatternColor || '#2D3047',
            WebkitMaskImage: `url("${design.backgroundPattern}")`,
            maskImage: `url("${design.backgroundPattern}")`,
            WebkitMaskRepeat: 'repeat',
            maskRepeat: 'repeat',
            WebkitMaskSize: 'auto',
            maskSize: 'auto',
            opacity: 0.4
          }}
        />
      )}

      {design.elements.map((el) => {
        const isSelected = el.id === selectedElementId;
        return (
          <div
            key={el.id}
            onMouseDown={(e) => handleMouseDown(e, el)}
            className={`absolute select-none group ${isSelected ? 'z-50' : 'z-10 cursor-pointer'}`}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
            }}
          >
            {isSelected && (
              <div className="absolute inset-0 ring-2 ring-[#2D3047] pointer-events-none animate-pulse"></div>
            )}
            
            <div className={`w-full h-full relative ${!isSelected && 'hover:ring-1 hover:ring-[#A8B5A2] transition-all'}`}>
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
                  draggable={false}
                  className="w-full h-full object-contain"
                  style={{
                    borderRadius: `${el.style.borderRadius}px`,
                    filter: `brightness(${el.style.brightness}%) contrast(${el.style.contrast}%)`,
                  }}
                />
              )}
            </div>

            {isSelected && (
              <div 
                className="absolute bottom-[-10px] right-[-10px] w-6 h-6 bg-white border-4 border-[#2D3047] rounded-full cursor-nwse-resize z-[60] shadow-md hover:scale-125 transition-transform"
                onMouseDown={(e) => handleResizeMouseDown(e, el)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
