const axios = require('axios').default;

const PHOTOS_PER_PAGE = 12;

async function fetchPhotos(searchQuery, page) {
  const instance = axios.create({
    baseURL: 'https://pixabay.com/api/',
    url: '',
    params: {
      key: '26076685-78cd58b795bf8e518af2b4a8a',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: PHOTOS_PER_PAGE,
    },
  });
  try {
    const response = await instance.get();
    return response;
  } catch (error) {
    console.error(error);
  }
}

export { fetchPhotos, PHOTOS_PER_PAGE };
