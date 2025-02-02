import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { searchPhotos } from '@/api/pexels'
import { Photo } from '@/types/pexels'

import './Gallery.css'

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const initialPhotos = await searchPhotos({});
      setPhotos(initialPhotos);
    }

    loadPhotos();
  }, [])

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
      <h1>Vite + React</h1>
      <div className="card">
        {photos.length}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        <Link to='img/2'>LINK TO IMG@2</Link>
      </p>
    </>
  )
}

