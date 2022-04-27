import React, { Component } from 'react';
import SearchBar from '../components/Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from 'components/Button/Button';
import { ThreeDots } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  fetchPhotos,
  PHOTOS_PER_PAGE,
} from '../utils/PhotoService/PhotoService';
import Notification from './Notification/Notification';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    galleryItems: [],
    status: Status.IDLE,
    canLoadMore: false,
    showModal: false,
    modalImageId: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page, searchQuery } = this.state;
    const newQuery = prevState.searchQuery !== searchQuery;
    const nextPageLoad = prevState.page !== page;
    if (newQuery) {
      this.setState({ galleryItems: [], canLoadMore: false });
    }
    if (newQuery || nextPageLoad) {
      this.setState({ status: Status.PENDING });
      const data = await fetchPhotos(searchQuery, page);
      this.requestedPhotosAmount = data.data.totalHits;
      if (this.requestedPhotosAmount === 0) {
        this.setState({ status: Status.REJECTED });
        Notify.failure(
          `There is no photos on your search query: ${searchQuery}`
        );
        return;
      }
      if (newQuery) {
        Notify.success(
          `There is ${this.requestedPhotosAmount} photos on your query - ${this.state.searchQuery}`
        );
      }

      const canLoadMore = page * PHOTOS_PER_PAGE < this.requestedPhotosAmount;

      if (!canLoadMore) {
        Notify.info(
          `You have reached the end of found photos of your request - ${searchQuery}`
        );
      }
      const galleryItems = data.data.hits.map(
        ({ id, largeImageURL, webformatURL, tags }) => {
          return {
            id,
            largeImageURL,
            webformatURL,
            tags,
          };
        }
      );
      if (nextPageLoad) {
        this.setState(prevState => ({
          galleryItems: [...prevState.galleryItems, ...galleryItems],
          status: Status.RESOLVED,
          canLoadMore,
        }));
        this.nextPageLoad = false;
        return;
      }
      this.setState({ galleryItems, status: Status.RESOLVED, canLoadMore });
    }
  }

  handleSubmit = searchQuery => {
    this.setState({ searchQuery, page: 1 });
  };

  handleGalleryItemClick = id => {
    this.setState({ modalImageId: id });
    this.toggleModal();
  };

  setModalImageURL = id => {
    return this.state.galleryItems.find(galleryItem => galleryItem.id === id);
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  setNextPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { galleryItems, showModal, modalImageId, canLoadMore, status } =
      this.state;
    return (
      <>
        <SearchBar onSubmit={this.handleSubmit} />
        {status === Status.IDLE && (
          <Notification message="Input your search query to the field above" />
        )}
        {galleryItems && (
          <ImageGallery
            galleryItems={galleryItems}
            onGalleryItemClick={this.handleGalleryItemClick}
          />
        )}
        {showModal && (
          <Modal
            imageURL={this.setModalImageURL(modalImageId).largeImageURL}
            imageAlt={this.setModalImageURL(modalImageId).tags}
            onClose={this.toggleModal}
          />
        )}
        <div className="footerContainer">
          {canLoadMore && status !== Status.PENDING && (
            <Button onClick={this.setNextPage} />
          )}
          {status === Status.PENDING && (
            <ThreeDots color="#3f51b5" ariaLabel="loading" />
          )}
        </div>
      </>
    );
  }
}

export default App;
