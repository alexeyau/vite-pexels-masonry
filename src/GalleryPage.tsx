import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { searchPhotos } from '@/api/pexels'
import { Photo } from '@/types/pexels'
import MasonryGrid from '@/components/MasonryGrid/MasonryGrid'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './Gallery.css'

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(1);
  const initialized = useRef(false);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setCounter((count) => count + 1);
    try {
      const photos = await searchPhotos({ page: counter });
      setPhotos((prev) => [...prev, ...photos]);
      setHasMore(photos.length > 0);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // prevent recall in dev mode
    if (initialized.current) return;
    initialized.current = true;

    fetchPhotos();
  }, []);

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
      <h1>{isLoading && 'isLoading'}</h1>
      <h1>{hasMore && 'hasMore'}</h1>
      <form action="/search">
        <input type="text" name="q" />
      </form>
      <div className="card">
        {photos.length && <MasonryGrid photos={photos} />}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        <Link to='img/2'>LINK TO IMG@2</Link>
      </p>
    </>
  )
}

