
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostcardDesign } from '../../types';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

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

  const getShareableLink = () => {
    try {
      const compactElements = design.elements.filter(e => e.content.length < 10000);
      const minimalDesign = { ...design, elements: compactElements };
      const dataStr = JSON.stringify(minimalDesign);
      const encodedData = btoa(encodeURIComponent(dataStr));
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}#/view/${design.id}?data=${encodedData}`;
    } catch (e) {
      console.error("Link generation failed", e);
      return `${window.location.origin}/#/view/${design.id}`;
    }
  };

  const prepareForExport = async () => {
    setIsExporting(true);
    // Wait for fonts to be definitely ready
    await document.fonts.ready;
    const canvas = document.getElementById('postcard-canvas');
    if (!canvas) throw new Error("Canvas not found");
    return canvas;
  };

  const downloadImage = async () => {
    try {
      const canvas = await prepareForExport();
      const dataUrl = await htmlToImage.toPng(canvas, { 
        quality: 1.0, 
        pixelRatio: 3,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `cozy-postcard-${design.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert("Something went wrong during export. Try again!");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const canvas = await prepareForExport();
      const dataUrl = await htmlToImage.toPng(canvas, { 
        quality: 1.0, 
        pixelRatio: 3 
      });
      
      const isLandscape = design.orientation === 'landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'px',
        format: isLandscape ? [800, 533] : [533, 800]
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save(`cozy-postcard-${design.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
      alert("Failed to create PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-16 bg-[#FDFCFB] border-b-2 border-[#D5B9B2] flex items-center justify-between px-6 z-50 shadow-sm no-print">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/')} 
          className="font-accent text-2xl text-[#2D3047] hover:text-[#A8B5A2] transition-colors flex items-center gap-2"
        >
          Studio
        </button>
        <div className="h-8 w-px bg-[#D5B9B2]"></div>
        <div className="flex gap-2">
          <button 
            onClick={undo} 
            disabled={!canUndo} 
            title="Undo"
            className={`p-2 rounded-xl border-2 transition-all ${canUndo ? 'text-[#2D3047] border-[#D5B9B2]/30 hover:bg-white hover:border-[#2D3047]' : 'text-gray-300 border-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo} 
            title="Redo"
            className={`p-2 rounded-xl border-2 transition-all ${canRedo ? 'text-[#2D3047] border-[#D5B9B2]/30 hover:bg-white hover:border-[#2D3047]' : 'text-gray-300 border-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-[#E29578] animate-ping' : 'bg-[#81B29A]'}`}></div>
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E69]">
            {isAutoSaving ? 'Drafting...' : 'Saved to Desk'}
          </span>
        </div>
      </div>

      <button 
        onClick={() => setShowShareModal(true)} 
        className="px-8 py-2.5 bg-[#2D3047] text-white font-bold rounded-full shadow-lg hover:bg-[#3D405B] hover:translate-y-[-1px] transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden border-4 border-[#F5EBE0]">
             {isExporting && (
                <div className="absolute inset-0 bg-white/95 z-[110] flex flex-col items-center justify-center space-y-5">
                  <div className="w-16 h-16 border-4 border-[#2D3047] border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-[#2D3047] text-lg font-accent text-center px-4">Gathering your craft supplies...</p>
                </div>
              )}
            
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-accent text-[#2D3047]">Special Delivery!</h2>
              <p className="text-sm font-bold text-[#4A4E69] italic">Your postcard is ready for the world.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadImage} 
                  className="py-5 bg-[#E29578] text-white font-bold rounded-2xl hover:bg-[#d48467] transition-all shadow-[0_5px_0_#b36d54] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image
                </button>
                <button 
                  onClick={downloadPdf} 
                  className="py-5 bg-[#81B29A] text-white font-bold rounded-2xl hover:bg-[#6fa088] transition-all shadow-[0_5px_0_#5a8c75] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  PDF Document
                </button>
              </div>
              
              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Shareable Link</label>
                <div className="p-4 bg-[#F9F7F5] rounded-2xl border-2 border-[#D5B9B2]/30 flex items-center gap-3 shadow-inner">
                  <input readOnly value={getShareableLink()} className="flex-1 bg-transparent text-[11px] font-mono outline-none text-[#2D3047] overflow-hidden" />
                  <button 
                    onClick={() => { navigator.clipboard.writeText(getShareableLink()); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                    className={`px-5 py-2 text-[10px] font-bold uppercase rounded-full transition-all ${copied ? 'bg-[#81B29A] text-white' : 'text-[#2D3047] hover:bg-[#D5B9B2]/20 border border-[#2D3047]/20'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            
            <button onClick={() => setShowShareModal(false)} className="w-full text-center text-xs font-bold uppercase text-gray-400 hover:text-[#2D3047] transition-colors py-2">
              Back to Crafting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
