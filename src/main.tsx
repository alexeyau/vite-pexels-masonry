import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GalleryPage from './GalleryPage.tsx'
const ImagePage = lazy(() => import('./ImagePage'));

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/img/2" element={<ImagePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
