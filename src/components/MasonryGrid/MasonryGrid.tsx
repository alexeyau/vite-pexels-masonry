import { useState, useRef, useEffect } from 'react';

import {
  GRID_GAP,
  ROW_HEIGHT,
  VIRTUALIZATION_LIMIT,
  VIRT_GAP,
} from '@/types/constants';
import { Photo } from '@/types/pexels';

import ImageItem from '../ImageItem';

import {
  masonryGridStyle,
  imageItemStyle,
  loadingStyle,
  loadingMockStyle,
} from './styles.css.ts';

type MasonryGridProps = {
  photos: Photo[],
  handleScrollEnd: () => void,
  isLoading: boolean,
  hasMore: boolean,
}

const setSizes = (
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
}

const MasonryGrid = ({ photos, handleScrollEnd, isLoading, hasMore }: MasonryGridProps) => {
  const [columnWidth, setColumnWidth] = useState(0);
  const [approximateItemHeight, setApproximateItemHeight] = useState(0);
  const [approximateViewHeight, setApproximateViewHeight] = useState(0);

  const [topVirtItemIndex, setTopVirtItemIndex] = useState(0);
  const [bottomVirtItemIndex, setBottomVirtItemIndex] = useState(0);

  const lastImageRef = useRef<HTMLDivElement & IntersectionObserver | null>(null);
  const mockRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const needVirtualisation = photos.length > VIRTUALIZATION_LIMIT;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        handleScrollEnd();
      };
    });

    if (lastImageRef?.current) {
      observer.observe(lastImageRef.current);
      return () => observer.disconnect();
    }

  }, [photos.length]);

  useEffect(() => {
    const handleResize = () => {
      const el = mockRef.current && mockRef || lastImageRef.current && lastImageRef;
      setColumnWidth(el?.current?.getBoundingClientRect().width || 0);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lastImageRef.current, mockRef.current]);

  useEffect(() => {
    if (!needVirtualisation || !wrapRef.current) {
      return;
    }

    const onScroll = () => {
      if (!approximateViewHeight) {
        setSizes(wrapRef.current, setApproximateItemHeight, setApproximateViewHeight, photos.length);
      }
      const currentViewIndex = Math.round(window.scrollY/approximateViewHeight);

      setTopVirtItemIndex(Math.max(0, Math.round((currentViewIndex - VIRT_GAP) * approximateViewHeight / approximateItemHeight)));
      setBottomVirtItemIndex(Math.round((currentViewIndex + VIRT_GAP) * approximateViewHeight / approximateItemHeight));
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [needVirtualisation, !approximateViewHeight, photos.length]);

  return (
    <div className={masonryGridStyle} ref={wrapRef}>
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
          />
        );
      })}
      {isLoading && (
        <>
          <div className={loadingStyle} ref={mockRef}></div>
          <div className={loadingMockStyle}></div>
          <div className={loadingMockStyle}></div>
        </>
      )}
    </div>
  );
};

export default MasonryGrid;
