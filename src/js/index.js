import photoCardTpl from '../templates/photo-card.handlebars';
import ImagesApiService from './images-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.scss';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtnEl.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  imagesApiService.resetPage();
  imagesApiService.query = event.currentTarget.elements.searchQuery.value;

  clearGallery();
  loadMoreBtnShow();

  imagesApiService.onGetData().then(({ data }) => {
    if (data.totalHits !== 0) {
      const cards = photoCardTpl(data.hits);

      insertGalleryData(cards);
      loadMoreBtnHide();

      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    } else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
function onLoadMore() {
  imagesApiService.incrementPage();
  imagesApiService.onGetData().then(({ data }) => {
    const cards = photoCardTpl(data.hits);
    insertGalleryData(cards);
  });
}
function insertGalleryData(data) {
  refs.galleryEl.insertAdjacentHTML('beforeend', data);
}
function clearGallery() {
  refs.galleryEl.innerHTML = '';
}
function loadMoreBtnShow() {
  refs.loadMoreBtnEl.classList.add('is-hidden');
}
function loadMoreBtnHide() {
  refs.loadMoreBtnEl.classList.remove('is-hidden');
}
