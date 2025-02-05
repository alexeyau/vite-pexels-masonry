import {
  Link,
  useParams,
} from 'react-router-dom';

import FullImage from '@/components/FullImage/FullImage';
import { usePhotoById } from '@/StateContext';

export default function ImagePage() {
  const { id } = useParams<{ id: string }>();
  const photo = usePhotoById(Number(id));

  return (
    <>
      <p>
        <Link to='/'>
          <span>← </span>
          BACK
        </Link>
      </p>
      {photo ? <FullImage photo={photo} /> : 'Photo not found'}
    </>
  )
}

