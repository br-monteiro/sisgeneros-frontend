const jsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
};
const stringfy = (value) => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return '{}';
  }
};

const getLocalStorage = (key) => {
  const localStorage = window.localStorage;
  let sgStorage = localStorage.getItem('sgStorage');
  if (!sgStorage) {
    sgStorage = {};
    localStorage.setItem('sgStorage', '{}');
  } else {
    sgStorage = jsonParse(sgStorage);
  }

  if (key && sgStorage[key]) {
    return sgStorage[key];
  }
  return sgStorage;
};

const setLocalStorage = (key, value) => {
  const localStorage = window.localStorage;
  const sgStorage = getLocalStorage();
  sgStorage[key] = value;
  localStorage.setItem('sgStorage', stringfy(sgStorage));
};

const toInt = (value) => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) return 0;
  return parsedValue;
};

const clickPagination = (page, component) => {
  if (component && typeof component.fetchData === 'function') {
    /* eslint-disable */
    page = component.$route.query.page && !page ? component.$route.query.page : page;
    /* eslint-enable */
    const parsedPage = toInt(page);

    if (page && parsedPage === component.current) return;

    if (parsedPage) {
      if (/([&?]page=)(\d+)/.test(window.location.hash)) {
        window.location.hash = window.location.hash.replace(/([&?]page=)(\d+)/, `$1${parsedPage}`);
      } else {
        window.location.hash += `?page=${parsedPage}`;
      }
    }

    /* eslint-disable */
    component.current = parsedPage;
    /* eslint-enable */
    component.fetchData(parsedPage);
  }
};

const formatDate = (value) => {
  if (value) {
    return value.split('-').reverse().join('-');
  }
  return value;
};

export default {
  jsonParse,
  stringfy,
  getLocalStorage,
  setLocalStorage,
  toInt,
  clickPagination,
  formatDate,
};
