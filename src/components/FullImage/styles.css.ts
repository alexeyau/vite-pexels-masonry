import { style, globalStyle } from '@vanilla-extract/css';

export const imageWrapStyle = style({
    display: 'flex',
    minHeight: '40vh',
    justifyContent: 'center',
    alignItems: 'center',
});

globalStyle(`${imageWrapStyle} img`, {
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    objectFit: 'cover',
});

export const imageInfoStyle = style({
    maxWidth: '90vw',
    padding: '10px',
});

export const photographerStyle = style({
    color: '#777',
});