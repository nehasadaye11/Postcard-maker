
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const newId = 'postcard-' + Math.random().toString(36).substr(2, 9);
    navigate(`/edit/${newId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8 bg-white/60 backdrop-blur-md p-12 rounded-[32px] craft-shadow border-4 border-white">
        <header className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-[#A8B5A2] p-4 rounded-full shadow-lg animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-accent text-[#2D3047]">Cozy Postcard Studio</h1>
          <p className="text-xl text-[#4A4E69] font-bold">Let's make something lovely together.</p>
        </header>

        <div className="relative group">
          <button
            onClick={handleStart}
            className="px-12 py-4 bg-[#E29578] text-white text-2xl font-bold rounded-full shadow-[0_8px_0_#b36d54] hover:shadow-[0_4px_0_#b36d54] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2"
          >
            Start Creating
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { title: 'Craft Tools', desc: 'Drag & drop elements' },
            { title: 'Soft Textures', desc: 'Warm, cozy aesthetic' },
            { title: 'Share Joy', desc: 'Digital or print ready' }
          ].map((feature, i) => (
            <div key={i} className="bg-white/40 p-6 rounded-2xl border border-white">
              <h3 className="font-bold text-[#2D3047] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#4A4E69] font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="mt-12 text-[#2D3047] font-bold flex items-center gap-2">
        <span>Handcrafted for thinkers & dreamers</span>
        <span className="text-red-500">❤</span>
      </footer>
    </div>
  );
};

export default LandingPage;
