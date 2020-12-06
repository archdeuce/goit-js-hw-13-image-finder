import imageCard from '../templates/imageCard.hbs';
import fetchQuery from './apiService';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core';

const debounce = require('lodash.debounce');
let pageNumber = 0;
let itemPerPage = 0;

const refs = {
  userInput: document.querySelector('#search-form > input'),
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('#js-gallery-container > ul'),
  loadmoreBtn: document.querySelector('#js-loadmore-btn'),
  loadmoreSpinner: document.querySelector('#js-loadmore-btn > .spinner'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxImage: document.querySelector('.lightbox__image'),
  lightboxBtn: document.querySelector('button[data-action="close-lightbox"]'),
};

refs.searchForm.addEventListener('submit', e => e.preventDefault());

const setDefaultValue = () => {
  pageNumber = 0;
  itemPerPage = 8;
};

const getUserInput = () => {
  return refs.userInput.value;
};

const getData = () => {
  btnHide();
  clearMarkup();
  setDefaultValue();
  getMoreData();
};

const getMoreData = () => {
  const userInput = getUserInput();

  if (userInput.trim().length === 0) {
    return;
  }

  pageNumber++;
  showSpinner();

  fetchQuery(userInput, pageNumber, itemPerPage)
    .then(({ hits }) => {
      btnHide();

      if (hits.length === 0) {
        showError('Nothing found.');
      } else if (hits.length < itemPerPage) {
        showError('No more results.');
      } else {
        btnShow();
      }

      hideSpinner();
      renderMarkup(hits);
    })
    .catch(console.log);
};

const btnHide = () => {
  refs.loadmoreBtn.classList.add('is-hidden');
};

const btnShow = () => {
  refs.loadmoreBtn.classList.remove('is-hidden');
};

const showSpinner = () => {
  refs.loadmoreSpinner.classList.remove('is-hidden');
};

const hideSpinner = () => {
  refs.loadmoreSpinner.classList.add('is-hidden');
};

const showError = msg => {
  new error({
    dir1: 'up',
    text: msg,
    delay: 2000,
  });
};

const renderMarkup = hits => {
  refs.galleryContainer.insertAdjacentHTML('beforeEnd', getGalleryMarkup(hits));
  pageScroll();
};

const clearMarkup = () => {
  refs.galleryContainer.innerHTML = '';
};

const getGalleryMarkup = array => {
  return array.map(card => imageCard(card)).join('');
};

const pageScroll = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};

const openModalWindow = e => {
  e.preventDefault();

  if (!e.target.classList.contains('card-image')) {
    return;
  }

  refs.lightboxImage.src = e.target.dataset.source;
  refs.lightbox.classList.toggle('is-open');
  document.addEventListener('keydown', closeModalWindowEscapeKey);
};

const closeModalWindow = e => {
  refs.lightboxImage.src = '';
  refs.lightbox.classList.remove('is-open');
};

const closeModalWindowEscapeKey = e => {
  if (e.keyCode == 27) {
    closeModalWindow('Escape');
  }

  document.removeEventListener('keydown', closeModalWindowEscapeKey);
};

setDefaultValue();
getData();

refs.userInput.addEventListener('input', debounce(getData, 500));
refs.loadmoreBtn.addEventListener('click', debounce(getMoreData, 500));
refs.galleryContainer.addEventListener('click', openModalWindow);
refs.lightboxOverlay.addEventListener('click', closeModalWindow);
refs.lightboxBtn.addEventListener('click', closeModalWindow);
