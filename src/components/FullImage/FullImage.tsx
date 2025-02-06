import { Photo } from '@/types/pexels';

import {
    imageWrapStyle,
    imageInfoStyle,
    photographerStyle,
} from './styles.css.ts';

type FullImageProps = {
  photo: Photo,
}

const FullImage = ({
  photo,
}: FullImageProps) => {
  return (
    <>
        <div className={imageInfoStyle}>
            <p>{photo.alt}</p>
            <p className={photographerStyle}>
                <span>Photographer:</span>
                {' '}
                <a href={photo.photographer_url} className="photographer-link" target="_blank" rel="noopener noreferrer">
                    {photo.photographer}
                </a>
            </p>
        </div>
        <div className={imageWrapStyle}>
            <img
                src={photo.src.large}
                alt={photo.alt}
            />
        </div>
    </>
  );
};

export default FullImage;
