import { GRID_GAP, ROW_HEIGHT } from '@/types/constants';
import { style, globalStyle } from '@vanilla-extract/css';

const itemStyles = {
    overflow: 'hidden',
    borderRadius: '3px',
    background: '#eee',
};

export const masonryGridStyle = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridAutoRows: `minmax(${ROW_HEIGHT}px, auto)`,
    gridAutoFlow: 'dense',
    gap: `${GRID_GAP}px`,
});

export const imageItemStyle = style({
    ...itemStyles,
    position: 'relative',
});

export const loadingStyle = style({
    ...itemStyles,
    position: 'relative',
    gridRow: 'span 4',
    animation: 'backgroundAnimation 0.9s infinite alternate',
});

export const loadingMockStyle = style({
    ...itemStyles,
    position: 'relative',
    gridRow: 'span 3',
    animation: 'backgroundAnimation 0.9s infinite alternate',
    animationDelay: '0.3s',
});

export const loadingMockAddStyle = style({
    ...itemStyles,
    position: 'relative',
    gridRow: 'span 3',
    animation: 'backgroundAnimation 0.9s infinite alternate',
    animationDelay: '0.6s',
});

export const emptyResultStyle = style({
    fontSize: '14px'
});


globalStyle(`${imageItemStyle} img`, {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
});