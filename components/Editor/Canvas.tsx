
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isLandscape = design.orientation === 'landscape';
  const aspectRatio = isLandscape ? '6/4' : '4/6';
  const maxWidth = isLandscape ? 800 : 533;
  const maxHeight = isLandscape ? 533 : 800;

  const handleMouseDown = (e: React.MouseEvent, element: PostcardElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
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
    if (!isDragging && !isResizing) return;
    if (!selectedElementId) return;

    if (isDragging) {
      updateElement(selectedElementId, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing) {
      updateElement(selectedElementId, {
        width: Math.max(20, e.clientX - dragOffset.x),
        height: Math.max(20, e.clientY - dragOffset.y)
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
      ref={containerRef}
      className="relative craft-shadow bg-white overflow-hidden transition-all duration-300 rounded-[4px]"
      style={{
        aspectRatio,
        width: '100%',
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        backgroundColor: design.backgroundColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => setSelectedElementId(null)}
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

      {/* Elements Layer */}
      {design.elements.map((el) => {
        const isSelected = el.id === selectedElementId;
        
        return (
          <div
            key={el.id}
            onMouseDown={(e) => handleMouseDown(e, el)}
            className={`absolute cursor-move select-none group transition-all ${
              isSelected 
                ? 'ring-[3px] ring-[#E29578] ring-offset-2 z-50 shadow-xl' 
                : 'hover:ring-2 hover:ring-[#A8B5A2] z-10'
            }`}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
            }}
          >
            {el.type === 'text' || el.type === 'label' ? (
              <div 
                className={`w-full h-full flex items-center justify-center p-2 break-words transition-all`}
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
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{
                  borderRadius: `${el.style.borderRadius}px`,
                  filter: `brightness(${el.style.brightness}%) contrast(${el.style.contrast}%)`,
                  border: el.style.borderWidth ? `${el.style.borderWidth}px solid ${el.style.borderColor}` : 'none'
                }}
              />
            )}

            {isSelected && (
              <>
                {/* Resize Handle - More prominent for efficiency */}
                <div 
                  className="absolute bottom-[-10px] right-[-10px] w-6 h-6 bg-white border-[3px] border-[#E29578] rounded-full cursor-nwse-resize z-[60] shadow-md hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeMouseDown(e, el)}
                />
                
                {/* Delete Button - Quick access */}
                <button
                  className="absolute top-[-14px] right-[-14px] w-8 h-8 bg-[#E29578] text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all z-[60] shadow-md scale-90 hover:scale-100"
                  onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                  title="Remove Element"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
          </div>
        );
      })}

      {/* Grid Lines for alignment */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full border-[0.5px] border-black" style={{ backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)' }}></div>
      </div>
    </div>
  );
};

export default Canvas;
