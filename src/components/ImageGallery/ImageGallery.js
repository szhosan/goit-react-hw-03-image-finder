import React, { Component } from 'react';
import s from './ImageGallery.module.css';

class ImageGallery extends Component {
  state = {
    searchQuery: this.props.searchQuery,
  };

  componentDidMount() {}

  render() {
    return <ul className={s.ImageGallery}>{this.state.searchQuery}</ul>;
  }
}

export default ImageGallery;
