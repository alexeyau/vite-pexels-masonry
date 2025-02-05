import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { StateContextProvider } from '@/StateContext.tsx';
import ErrorBoundary from '@/components/ErrorBoundary.tsx';

import GalleryPage from './GalleryPage.tsx';
const ImagePage = lazy(() => import('./ImagePage'));

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <StateContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/img/:id" element={<ImagePage />} />
          </Routes>
        </BrowserRouter>
      </StateContextProvider>
    </ErrorBoundary>
  </StrictMode>,
)
