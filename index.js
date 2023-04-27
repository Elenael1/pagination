import axios from 'axios';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';


const px_URL = 'https://pixabay.com/api/';
const KEY = '35764954-2405a3f467b19321b37277e48';
const paramaters = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=5'

const refs = {
input: document.querySelector('.input'),
gallery: document.querySelector('.gallery'),
button: document.querySelector('.button'),
}

refs.input.addEventListener('input', debounce(onInput, 300) )

function onInput(e) {
    const value = e.target.value.trim();
    
    if (value === '') {
        refs.gallery.innerHTML = '';
        Notiflix.Notify.info('Введіть данні');
        return;
    }
}


let page = 1;

async function fetch(q = 'car', page = 1) {
  try {
    const fetch = await axios.get(
      `${px_URL}?key=${KEY}&q=${q}&page=${page}${paramaters}`
    );
    const response = fetch.data;
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

refs.input.addEventListener('input', debounce(onInput, 300));
refs.button.addEventListener('click', onClick);

async function render(data) {
  const markUp = data
    .map(({ comments, downloads, likes, webformatURL, tags }) => {
      return `<img src="${webformatURL}" alt="${tags}">
      <div>comments: ${comments} </div>
      <div>download: ${downloads}</div>
      <div> likes:${likes} </div>`;
    })
    .join(' ');

  return markUp;
}

async function onInput(e) {
  const value = e.target.value.trim();

  if (value === '') {
    refs.button.classList.add('is-hidden');
    refs.gallery.innerHTML = '';
    Notiflix.Notify.info('Введіть данні');
    return;
  }

  const data = await fetch(value);

  const markUp = await render(data.hits);

  if (markUp !== '') {
    refs.button.classList.remove('is-hidden');
  }

  refs.gallery.insertAdjacentHTML('beforeend', markUp);
}

async function onClick(e) {
  const value = refs.input.value.trim();
  page += 1;

  const data = await fetch(value, page);

  const images = data.total - page * 5;
}









