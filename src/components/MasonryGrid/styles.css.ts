import { GRID_GAP, ROW_HEIGHT } from '@/types/constants';
import { style, globalStyle } from '@vanilla-extract/css';

export const masonryGridStyle = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridAutoRows: `minmax(${ROW_HEIGHT}px, auto)`,
    gridAutoFlow: 'dense',
    gap: `${GRID_GAP}px`,
});

export const imageItemStyle = style({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
});

export const loadingStyle = style({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
    background: '#eee',
    gridRow: 'span 4',
});

export const loadingMockStyle = style({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
    background: '#eee',
    gridRow: 'span 3',
});


globalStyle(`${imageItemStyle} img`, {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
});