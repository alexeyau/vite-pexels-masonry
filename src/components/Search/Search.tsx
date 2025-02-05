import { useState } from 'react';

import {
  searchStyle,
  inputStyle
} from './styles.css.ts';
import { useStateContext } from '@/StateContext.tsx';


const Search = () => {
  const { setSearchQuery } = useStateContext();
  const [query, setQuery] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSearchQuery(query);
    }
  };

  return (
    <div className={searchStyle}>
      <input
        className={inputStyle}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search query"
      />
    </div>
  );
};

export default Search;
