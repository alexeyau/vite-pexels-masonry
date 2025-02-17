import { useState, useEffect, useCallback, MutableRefObject } from 'react';

import {
  VIRTUALIZATION_LIMIT,
  VIRT_PAGES_GAP,
  SCROLL_GAP,
} from '@/types/constants';

interface UseVirtualizeProps {
  wrapRef: MutableRefObject<HTMLDivElement | null>;
  mockRef: MutableRefObject<HTMLDivElement | null>;
  lastImageRef: MutableRefObject<HTMLDivElement | null>;
  photosLength: number,
}

interface UseVirtualizeReturn {
  topVirtItemIndex: number;
  bottomVirtItemIndex: number;
  columnWidth: number;
}

export const useVirtualize = ({ photosLength, mockRef, wrapRef, lastImageRef }: UseVirtualizeProps): UseVirtualizeReturn => {

  const [topVirtItemIndex, setTopVirtItemIndex] = useState(0);
  const [bottomVirtItemIndex, setBottomVirtItemIndex] = useState(0);
  const [approximateItemHeight, setApproximateItemHeight] = useState(0);
  const [approximateViewHeight, setApproximateViewHeight] = useState(0);
  const [columnWidth, setColumnWidth] = useState(0);

  const needVirtualisation = photosLength > VIRTUALIZATION_LIMIT;

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
  }, [photosLength]);

  useEffect(() => {
    const handleResize = () => {
      const el = mockRef.current && mockRef || lastImageRef.current && lastImageRef;
      setColumnWidth(el?.current?.getBoundingClientRect().width || 0);
      if (needVirtualisation && wrapRef.current) {
        setSizes(wrapRef.current, setApproximateItemHeight, setApproximateViewHeight, photosLength);
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
        setSizes(wrapRef.current, setApproximateItemHeight, setApproximateViewHeight, photosLength);
      }
      setLimits();
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [needVirtualisation, !approximateViewHeight, photosLength, columnWidth]);

  return {
    topVirtItemIndex,
    bottomVirtItemIndex,
    columnWidth,
  };
}