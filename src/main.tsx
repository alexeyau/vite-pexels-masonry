import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Gallery from './Gallery.tsx'
const Image = lazy(() => import('./Image'));

import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/img/2" element={<Image />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
