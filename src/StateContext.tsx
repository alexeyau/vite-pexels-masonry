import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';

import { Photo } from '@/types/pexels';
import { DEFAULT_QUERY } from '@/types/constants';

interface StateContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  photos: Photo[];
  setPhotos: Dispatch<SetStateAction<Photo[]>>;
}

type StateContextProviderProps = {
  children?: ReactNode,
}

const StateContext = createContext<StateContextType>({
  searchQuery: DEFAULT_QUERY,
  setSearchQuery: () => {},
  photos: [],
  setPhotos: () => {},
});

export const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);
  const [photos, setPhotos] = useState<Photo[]>([]);

  return (
    <StateContext.Provider value={{ photos, setPhotos, searchQuery, setSearchQuery }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext should be used inside StateProvider');
  }
  return context;
};

export const usePhotoById = (id: number) => {
  const { photos } = useStateContext();
  return photos.find(photo => photo.id === id);
};
