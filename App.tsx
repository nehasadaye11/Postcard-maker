
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EditorPage from './components/Editor/EditorPage';
import ViewPage from './components/ViewPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/edit/:id" element={<EditorPage />} />
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
