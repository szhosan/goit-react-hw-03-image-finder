import React from 'react';
import s from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

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

ImageGalleryItem.propTypes = {
  id: PropTypes.number.isRequired,
  webformatURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
};
