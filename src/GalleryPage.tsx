import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { searchPhotos } from '@/api/pexels'
import { Photo } from '@/types/pexels'
import MasonryGrid from '@/components/MasonryGrid/MasonryGrid'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './Gallery.css'

export default function GalleryPage() {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const initialized = useRef(false);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const {
        photos,
        totalResults,
      } = await searchPhotos({ page });

      setAllPhotos((prev) => [...prev, ...photos]);

      setHasMore((allPhotos.length + photos.length) < totalResults);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // prevent recall in dev mode
    if (initialized.current && page === 1) return;
    initialized.current = true;

    fetchPhotos();
  }, [page]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <form action="/search">
        <input type="text" name="q" />
      </form>
      <div className="card">
        <MasonryGrid
          photos={allPhotos}
          isLoading={isLoading}
          hasMore={hasMore}
          handleScrollEnd={() => {
            setPage((p) => p + 1);
          }}
        />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        <Link to='img/2'>LINK TO IMG@2</Link>
      </p>
    </>
  )
}

