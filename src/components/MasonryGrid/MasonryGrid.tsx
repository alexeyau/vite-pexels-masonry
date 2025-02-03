import { useState, useRef, useLayoutEffect } from 'react';

import { GRID_GAP, ROW_HEIGHT } from '@/types/constants';
import { Photo } from '@/types/pexels';

import ImageItem from '../ImageItem';

import { masonryGridStyle, imageItemStyle } from './styles.css.ts';

type MasonryGridProps = {
    photos: Photo[],
}

const MasonryGrid = ({ photos }: MasonryGridProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [columnWidth, setColumnWidth] = useState(0);

  const lastImageRef = useRef<IntersectionObserver | null>(null);
  const firstImageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!firstImageRef.current) return;
  
      const firstImageWidth = firstImageRef.current.getBoundingClientRect().width;
  
      setColumnWidth(firstImageWidth);
    }

    handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
  }, []);

  return (
    <div className={masonryGridStyle}>
      {photos.map((photo, index) => {
        return (
          <ImageItem
            key={photo.id}
            photo={photo}
            className={imageItemStyle}
            columnWidth={columnWidth}
            ref={index === photos.length - 1 ? lastImageRef : (
              index === 0 ? firstImageRef : null
            )}
            rowHeight={GRID_GAP + ROW_HEIGHT}
          />
        );
      })}
      {/* {loading && <div className="loading">Loading...</div>} */}
    </div>
  );
};

export default MasonryGrid;
