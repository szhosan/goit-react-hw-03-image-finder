const axios = require('axios').default;

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    this.PHOTOS_PER_PAGE = 12;
  }

  async getPhotos() {
    const instance = axios.create({
      baseURL: 'https://pixabay.com/api/',
      url: '',
      params: {
        key: '26076685-78cd58b795bf8e518af2b4a8a',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: this.PHOTOS_PER_PAGE,
      },
    });

    try {
      const response = await instance.get();
      this.totalHits = response.data.totalHits;
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get currentPage() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  areAllRequestedPhotosShown() {
    if (this.page * this.PHOTOS_PER_PAGE > this.totalHits) {
      return true;
    } else return false;
  }
}
