import { forwardRef } from 'react';

import { Photo } from '@/types/pexels';

type ImageItemProps = {
  photo: Photo,
  className: string,
  columnWidth: number,
  rowHeight: number,
  hide: boolean,
}

const getSize = (photo: Photo, itemWidth: number, rowHeight: number): number => {
  if (photo.width === 0) return 1;

  const aspectRatio = photo.width / photo.height;
  const actualHeaght = itemWidth / aspectRatio;
  return Math.max(
    Math.ceil(actualHeaght / (rowHeight)),
    1,
  );
}

const ImageItem = forwardRef(({
  photo,
  className,
  columnWidth,
  rowHeight,
  hide,
}: ImageItemProps, ref: any) => {
  return (
    <div
      className={className}
      ref={ref}
      style={{
        gridRow: 'span ' + getSize(photo, columnWidth, rowHeight),
      }}
    >
      {!hide && (
        <img
          src={photo.src.medium}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

export default ImageItem;
