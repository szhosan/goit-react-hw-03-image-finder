import React, { Component } from 'react';
import s from './ImageGallery.module.css';
import PhotoApiService from '../PhotoService/PhotoService';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import Button from 'components/Button/Button';
import Modal from '../Modal/Modal';
import { Grid } from 'react-loader-spinner';
import { Events, animateScroll as scroll } from 'react-scroll';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  state = {
    galleryItems: [],
    status: Status.IDLE,
    loadNextPage: false,
    canLoadMore: false,
    showModal: false,
    modalImageID: null,
  };

  instance = new PhotoApiService();

  async componentDidMount() {
    Events.scrollEvent.register('begin', function () {
      //console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function () {
      //console.log('end', arguments);
    });

    this.instance.searchQuery = this.props.searchQuery;
    this.setGalleryItemsData(await this.instance.getPhotos());
  }

  async componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.searchQuery;
    const nextQuery = this.props.searchQuery;

    if (prevQuery !== nextQuery) {
      this.setState({ status: Status.PENDING });
      this.instance.searchQuery = nextQuery;
      this.instance.resetPage();
      this.setGalleryItemsData(await this.instance.getPhotos(), false);
    }
    if (this.state.loadNextPage) {
      this.setState({ status: Status.PENDING, loadNextPage: false });
      this.setGalleryItemsData(await this.instance.getPhotos(), true);
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
    console.log('Toggle modal');
  };

  setGalleryItemsData({ data }, nextPageLoading) {
    if (data.totalHits === 0) {
      return;
    }
    const result = data.hits.map(
      ({ id, largeImageURL, webformatURL, tags }) => {
        return {
          id,
          largeImageURL,
          webformatURL,
          tags,
        };
      }
    );
    const canLoadNextPage = !this.instance.areAllRequestedPhotosShown();
    if (nextPageLoading) {
      this.setState(prevState => {
        return {
          galleryItems: [...prevState.galleryItems, ...result],
          status: Status.RESOLVED,
          canLoadMore: canLoadNextPage,
          loadNextPage: false,
        };
      });
      return;
    }
    this.setState({
      galleryItems: result,
      status: Status.RESOLVED,
      canLoadMore: canLoadNextPage,
      loadNextPage: false,
    });
  }

  setNextPage = () => {
    this.instance.incrementPage();
    this.setState({ loadNextPage: true });
    scroll.scrollToBottom();
  };

  onGalleryClick = id => {
    this.setState({ modalImageID: id });
    this.toggleModal();
  };

  setModalImageURL = () => {
    console.log('Imageurl');
    if (this.setModalImageURL) {
      const galletyItem = this.state.galleryItems.find(
        item => item.id === this.state.modalImageID
      );
      return galletyItem;
    }
  };

  render() {
    return (
      <>
        {this.state.showModal && (
          <Modal
            imageURL={this.setModalImageURL().largeImageURL}
            imageAlt={this.setModalImageURL().tags}
            onClose={this.toggleModal}
          />
        )}
        <ul className={s.ImageGallery}>
          {this.state.galleryItems.map(({ id, webformatURL, tags }) => {
            return (
              <ImageGalleryItem
                key={id}
                id={id}
                webformatURL={webformatURL}
                tags={tags}
                onItemClick={this.onGalleryClick}
              />
            );
          })}
        </ul>
        <div className={s.footerContainer}>
          {this.state.canLoadMore && this.state.status !== Status.PENDING && (
            <Button onClick={this.setNextPage} />
          )}
          {this.state.status === Status.PENDING && (
            <Grid color="#3f51b5" ariaLabel="loading" height={80} width={80} />
          )}
        </div>
      </>
    );
  }
}

export default ImageGallery;
