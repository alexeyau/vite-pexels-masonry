import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

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
    <Link
      to={`img/${photo.id}`}
      className={className}
      ref={ref}
      style={{
        gridRow: 'span ' + getSize(photo, columnWidth, rowHeight),
        backgroundColor: photo.avg_color,
      }}
    >
        <img
          src={photo.src.medium}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          style={{display: hide ? 'none' : 'block'}}
        />
    </Link>
  );
});

export default ImageItem;
