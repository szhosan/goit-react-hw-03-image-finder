import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';
import PropTypes from 'prop-types';

const modalRef = document.querySelector('#modal-root');

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleClose);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleClose);
  }

  handleClose = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleCloseClick = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <div className={s.Overlay} onClick={this.handleCloseClick}>
        <div className={s.Modal}>
          <img src={this.props.imageURL} alt={this.props.imageAlt} />
        </div>
      </div>,
      modalRef
    );
  }
}

Modal.propTypes = {
  imageURL: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
