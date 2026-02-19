
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostcardDesign } from '../../types';
import * as htmlToImage from 'https://esm.sh/html-to-image@1.11.11';
import jsPDF from 'https://esm.sh/jspdf@2.5.1';

interface ToolbarProps {
  design: PostcardDesign;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isAutoSaving: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ design, undo, redo, canUndo, canRedo, isAutoSaving }) => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a truly shareable link by encoding the design data
  const getShareableLink = () => {
    try {
      const dataStr = JSON.stringify(design);
      // Use URL safe base64 encoding
      const encodedData = btoa(encodeURIComponent(dataStr));
      const url = new URL(window.location.href);
      url.hash = `#/view/${design.id}?data=${encodedData}`;
      return url.toString();
    } catch (e) {
      console.error("Failed to generate link", e);
      return `${window.location.origin}/#/view/${design.id}`;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async () => {
    const canvas = document.getElementById('postcard-canvas');
    if (!canvas) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(canvas, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${design.name || 'my-postcard'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Sorry, image export failed. Try again!');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = async () => {
    const canvas = document.getElementById('postcard-canvas');
    if (!canvas) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toJpeg(canvas, { quality: 0.95, pixelRatio: 2 });
      const isLandscape = design.orientation === 'landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'in',
        format: [6, 4]
      });
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, isLandscape ? 6 : 4, isLandscape ? 4 : 6);
      pdf.save(`${design.name || 'my-postcard'}.pdf`);
    } catch (err) {
      console.error('PDF Export failed', err);
      alert('Sorry, PDF export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-16 bg-[#FDFCFB] border-b-2 border-[#D5B9B2] flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#2D3047] font-bold hover:text-[#A8B5A2] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Home
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <button 
            onClick={undo} 
            disabled={!canUndo}
            className={`p-2 rounded-lg ${canUndo ? 'text-[#2D3047] hover:bg-gray-100' : 'text-gray-300'}`}
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo}
            className={`p-2 rounded-lg ${canRedo ? 'text-[#2D3047] hover:bg-gray-100' : 'text-gray-300'}`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="h-6 w-px bg-gray-300"></div>
        <span className="text-sm font-bold text-[#4A4E69] italic">
          {isAutoSaving ? 'Saving...' : 'All changes saved'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowShareModal(true)}
          className="px-6 py-2 bg-[#81B29A] text-white font-bold rounded-full shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
        >
          Share Postcard
        </button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
            {isExporting && (
              <div className="absolute inset-0 bg-white/80 z-[110] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#A8B5A2] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-[#2D3047]">Preparing your masterpiece...</p>
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-accent text-[#2D3047]">Ready to share?</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-[#4A4E69] font-medium leading-relaxed">Your design is ready for the world. Copy the link below or download it to keep forever.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Shareable Link</label>
              <div className="flex gap-2 p-2 bg-gray-50 rounded-xl border-2 border-[#D5B9B2]/30 group focus-within:border-[#A8B5A2] transition-colors">
                <input 
                  type="text" 
                  readOnly 
                  value={getShareableLink()} 
                  className="flex-1 bg-transparent text-xs font-mono px-2 text-[#2D3047] outline-none"
                />
                <button 
                  onClick={handleCopyLink}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${copied ? 'bg-[#81B29A] text-white' : 'bg-[#A8B5A2] text-white hover:bg-[#97a38f]'}`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={downloadImage}
                className="group flex flex-col items-center gap-3 p-4 border-2 border-[#D5B9B2] rounded-[20px] hover:border-[#A8B5A2] hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-[#F4F1DE] rounded-full flex items-center justify-center text-[#E29578] group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#2D3047]">PNG Image</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Best for web</div>
                </div>
              </button>
              
              <button 
                onClick={downloadPDF}
                className="group flex flex-col items-center gap-3 p-4 border-2 border-[#D5B9B2] rounded-[20px] hover:border-[#A8B5A2] hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-[#F4F1DE] rounded-full flex items-center justify-center text-[#E29578] group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#2D3047]">PDF Print</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Ready to mail</div>
                </div>
              </button>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-4 bg-[#2D3047] text-white font-bold rounded-xl uppercase tracking-widest hover:bg-[#3D405B] transition-colors shadow-lg active:translate-y-px"
            >
              Back to Crafting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
