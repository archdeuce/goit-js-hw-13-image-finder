const API_KEY = '19294514-cad9d9492229c8304ad27e22b';
const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

function fetchQuery(searchQuery, page, quantity) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&key=${API_KEY}&q=${searchQuery}&page=${page}&per_page=${quantity}`,
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .catch();
}

export default fetchQuery;
