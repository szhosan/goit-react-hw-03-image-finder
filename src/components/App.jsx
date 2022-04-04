import React, { Component } from 'react';
import Searchbar from '../components/Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

class App extends Component {
  state = {
    searchQuery: '',
  };

  handleSubmit = searchQuery => {
    this.setState({ searchQuery });
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        {this.state.searchQuery && (
          <ImageGallery searchQuery={this.state.searchQuery} />
        )}
      </>
    );
  }
}

export default App;
