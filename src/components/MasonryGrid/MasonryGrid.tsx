import { useState, useRef, useEffect, useCallback } from 'react';
import {
  GRID_GAP,
  ROW_HEIGHT,
  FIRST_IMAGES_AMOUNT,
} from '@/types/constants';
import { useStateContext } from '@/StateContext.tsx';
import { searchPhotos } from '@/api/pexels.ts';

import ImageItem from '../ImageItem';

import {
  masonryGridStyle,
  imageItemStyle,
  loadingStyle,
  loadingMockStyle,
  loadingMockAddStyle,
  emptyResultStyle,
} from './styles.css.ts';

import { useVirtualize } from '@/components/MasonryGrid/useVirtualize.ts';

const MasonryGrid = () => {
  const {
    photos,
    setPhotos,
    searchQuery,
  } = useStateContext();
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastImageRef = useRef<HTMLDivElement & IntersectionObserver | null>(null);
  const mockRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        photos: photosPart,
        totalResults,
      } = await searchPhotos({ page: pageNum, query: searchQuery });

      setPageNum((p) => p + 1);
      setPhotos((prev) => [...prev, ...(photosPart || [])]);
      setHasMore((photos.length + photosPart.length) < totalResults);

    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setPhotos, setHasMore, pageNum, setPageNum, photos, searchQuery]);

  useEffect(() => {
    // prevent recall in dev mode
    if (!initialized.current) {
      initialized.current = true;

      fetchPhotos();
    } else {
      if (searchQuery === currentSearchQuery) return;

      setCurrentSearchQuery(searchQuery);
      setPageNum(1);
      setPhotos([]);
      fetchPhotos();
      setHasMore(true);
    }
  }, [searchQuery, fetchPhotos]);


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        fetchPhotos();
      };
    });

    if (lastImageRef?.current) {
      observer.observe(lastImageRef.current);
      return () => observer.disconnect();
    }

  }, [photos.length, hasMore]);

  const {
    topVirtItemIndex,
    bottomVirtItemIndex,
    columnWidth,
  } = useVirtualize({
    mockRef,
    wrapRef,
    photosLength: photos.length,
    lastImageRef,
  });

  return (
    <div className={masonryGridStyle} ref={wrapRef}>
      {!isLoading && !photos.length && (
        <div className={emptyResultStyle}>
          No images found
        </div>
      )}
      {photos.map((photo, index) => {
        const hideByTop = index < topVirtItemIndex;
        const hideByBottom = !!bottomVirtItemIndex && (index > bottomVirtItemIndex);
        return (
          <ImageItem
            key={photo.id}
            photo={photo}
            hide={hideByTop || hideByBottom}
            className={imageItemStyle}
            columnWidth={columnWidth}
            ref={index === photos.length - 1 ? lastImageRef : null}
            rowHeight={GRID_GAP + ROW_HEIGHT}
            isCriticalImage={index < FIRST_IMAGES_AMOUNT}
          />
        );
      })}
      {isLoading && (
        <>
          <div className={loadingStyle} ref={mockRef}></div>
          <div className={loadingMockStyle}></div>
          <div className={loadingMockAddStyle}></div>
        </>
      )}
    </div>
  );
};

export default MasonryGrid;
