import React from 'react';
import s from './ImageGalleryItem.module.css';

export default function ImageGalleryItem({
  id,
  webformatURL,
  tags,
  onItemClick,
}) {
  return (
    <li className={s.ImageGalleryItem} onClick={() => onItemClick(id)}>
      <img className={s.ImageGalleryItemImage} src={webformatURL} alt={tags} />
    </li>
  );
}
