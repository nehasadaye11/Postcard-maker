
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import { PostcardDesign, PostcardElement, HistoryState } from '../../types';
import { INITIAL_POSTCARD } from '../../constants';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [design, setDesign] = useState<PostcardDesign>({ ...INITIAL_POSTCARD, id: id || 'new' });
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: { ...INITIAL_POSTCARD, id: id || 'new' },
    future: []
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Initialize from storage if exists
  useEffect(() => {
    const saved = localStorage.getItem(`postcard_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDesign(parsed);
        setHistory(h => ({ ...h, present: parsed }));
      } catch (e) {
        console.error("Failed to load saved design", e);
      }
    }
  }, [id]);

  // Auto-save logic
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAutoSaving(true);
      localStorage.setItem(`postcard_${id}`, JSON.stringify({ ...design, updatedAt: new Date().toISOString() }));
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 5000);
    return () => clearInterval(timer);
  }, [design, id]);

  const pushToHistory = useCallback((newDesign: PostcardDesign) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newDesign,
      future: []
    }));
    setDesign(newDesign);
  }, []);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future]
    });
    setDesign(previous);
  }, [history]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture
    });
    setDesign(next);
  }, [history]);

  const updateDesign = (updates: Partial<PostcardDesign>) => {
    const updated = { ...design, ...updates };
    pushToHistory(updated);
  };

  const addElement = (element: PostcardElement) => {
    const updated = { ...design, elements: [...design.elements, element] };
    pushToHistory(updated);
    setSelectedElementId(element.id);
  };

  const updateElement = (elementId: string, updates: Partial<PostcardElement>) => {
    const updatedElements = design.elements.map(el => 
      el.id === elementId ? { ...el, ...updates, style: { ...el.style, ...(updates.style || {}) } } : el
    );
    updateDesign({ elements: updatedElements });
  };

  const deleteElement = (elementId: string) => {
    const updatedElements = design.elements.filter(el => el.id !== elementId);
    updateDesign({ elements: updatedElements });
    setSelectedElementId(null);
  };

  const duplicateElement = (elementId: string) => {
    const el = design.elements.find(e => e.id === elementId);
    if (!el) return;
    const newEl = { ...el, id: `el-${Date.now()}`, x: el.x + 20, y: el.y + 20 };
    addElement(newEl);
  };

  // Keyboard shortcuts for efficiency
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;
      
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteElement(selectedElementId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateElement(selectedElementId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, deleteElement, duplicateElement, undo, redo]);

  return (
    <div className="h-screen flex flex-col bg-[#F5EBE0]">
      <Toolbar 
        design={design} 
        undo={undo} 
        redo={redo} 
        canUndo={history.past.length > 0} 
        canRedo={history.future.length > 0}
        isAutoSaving={isAutoSaving}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar addElement={addElement} design={design} updateDesign={updateDesign} />
        
        <main className="flex-1 overflow-auto relative p-8 flex items-center justify-center bg-[#FDFCFB] paper-texture">
          <Canvas 
            design={design} 
            selectedElementId={selectedElementId} 
            setSelectedElementId={setSelectedElementId} 
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        </main>

        <PropertiesPanel 
          selectedElement={design.elements.find(e => e.id === selectedElementId) || null}
          updateElement={updateElement}
          deleteElement={deleteElement}
          duplicateElement={duplicateElement}
        />
      </div>
    </div>
  );
};

export default EditorPage;
