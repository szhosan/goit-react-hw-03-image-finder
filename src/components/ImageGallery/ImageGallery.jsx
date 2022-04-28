import React, { Component } from 'react';
import s from './ImageGallery.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import { Events, animateScroll as scroll } from 'react-scroll';
import PropTypes from 'prop-types';

class ImageGallery extends Component {
  componentDidMount() {
    Events.scrollEvent.register('begin', function () {
      //console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function () {
      //console.log('end', arguments);
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.galleryItems.length !== this.props.galleryItems.length) {
      scroll.scrollToBottom();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  onGalleryClick = id => {
    this.props.onGalleryItemClick(id);
  };

  render() {
    const { galleryItems } = this.props;
    return (
      <>
        <ul className={s.ImageGallery}>
          {galleryItems.map(({ id, webformatURL, tags }) => {
            return (
              <ImageGalleryItem
                key={id}
                id={id}
                webformatURL={webformatURL}
                tags={tags}
                onItemClick={() => this.onGalleryClick(id)}
              />
            );
          })}
        </ul>
      </>
    );
  }
}

ImageGallery.propTypes = {
  galleryItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  ),
};

export default ImageGallery;
