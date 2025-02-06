import { useState, useRef, useEffect, useCallback } from 'react';
import {
  GRID_GAP,
  ROW_HEIGHT,
  VIRTUALIZATION_LIMIT,
  VIRT_PAGES_GAP,
  SCROLL_GAP,
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

const MasonryGrid = () => {
  const {
    photos,
    setPhotos,
    searchQuery,
  } = useStateContext();
  const [columnWidth, setColumnWidth] = useState(0);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [approximateItemHeight, setApproximateItemHeight] = useState(0);
  const [approximateViewHeight, setApproximateViewHeight] = useState(0);
  const [topVirtItemIndex, setTopVirtItemIndex] = useState(0);
  const [bottomVirtItemIndex, setBottomVirtItemIndex] = useState(0);
  const lastImageRef = useRef<HTMLDivElement & IntersectionObserver | null>(null);
  const mockRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const needVirtualisation = photos.length > VIRTUALIZATION_LIMIT;
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


  const setSizes = useCallback((
    wrapEl: HTMLDivElement | null,
    setItemHeight: React.Dispatch<React.SetStateAction<number>>,
    setWrapHeight: React.Dispatch<React.SetStateAction<number>>,
    totalLength: number,
  ) => {
    if (!wrapEl) {
      return;
    }

    const wrapElRect = wrapEl?.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const vTop = Math.max(wrapElRect.top, 0);
    const vBottom = Math.min(wrapElRect.bottom, viewportHeight);
    const wrapViewHeight = Math.max(vBottom - vTop, 0);

    setItemHeight(wrapElRect.height / totalLength);
    setWrapHeight(wrapViewHeight);
  }, [photos.length]);

  useEffect(() => {
    const handleResize = () => {
      const el = mockRef.current && mockRef || lastImageRef.current && lastImageRef;
      setColumnWidth(el?.current?.getBoundingClientRect().width || 0);
      if (needVirtualisation && wrapRef.current) {
        setSizes(wrapRef.current, setApproximateItemHeight, setApproximateViewHeight, photos.length);
        setLimits();
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lastImageRef.current, mockRef.current]);

  const setLimits = useCallback(() => {
    const currentViewIndex = Math.round(window.scrollY/approximateViewHeight);
  
    const topLimit = Math.max(0, Math.round((currentViewIndex - VIRT_PAGES_GAP) * approximateViewHeight / approximateItemHeight));
    const bottomLimit = Math.round((currentViewIndex + VIRT_PAGES_GAP) * approximateViewHeight / approximateItemHeight);

    setTopVirtItemIndex(topLimit);
    setBottomVirtItemIndex(bottomLimit);
  }, [approximateViewHeight, approximateItemHeight]);

  useEffect(() => {
    if (!needVirtualisation || !wrapRef.current) {
      return;
    }

    const onScroll = () => {
      if (Math.round(window.scrollY) % SCROLL_GAP !== 0) {
        return;
      }
      if (!approximateViewHeight) {
        setSizes(wrapRef.current, setApproximateItemHeight, setApproximateViewHeight, photos.length);
      }
      setLimits();
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [needVirtualisation, !approximateViewHeight, photos.length, columnWidth]);

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
