import React, { Component } from 'react';
import s from './Searchbar.module.css';

class Searchbar extends Component {
  constructor() {
    super();
  }

  state = {
    searchQuery: '',
  };

  onInputChange = e => {
    this.setState({ searchQuery: e.currentTarget.value });
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.searchQuery);
  };

  render() {
    return (
      <header className={s.searchbar}>
        <form className={s.form} onSubmit={this.onFormSubmit}>
          <button type="submit" className={s.button}>
            <span className={s.label}>Search</span>
          </button>

          <input
            className={s.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.searchQuery}
            onChange={this.onInputChange}
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;
