import fn from './Functions';

const isLoggedIn = () => {
  const dataUser = fn.getLocalStorage('dataUser');
  if (dataUser && dataUser.satatus === 'loggedIn' && dataUser.token) {
    return true;
  }
  return false;
};

const registerUser = (data) => {
  const dataUser = data.data.data;
  dataUser.satatus = 'loggedIn';
  fn.setLocalStorage('dataUser', dataUser);
};

const removeUser = () => {
  fn.setLocalStorage('dataUser', {});
};

// const dialog = (//)

const commonDialog = (component, rawResponse, schemaMesage) => {
  const response = rawResponse.response;
  if (response) {
    const data = response.data;
    const httpCode = response.status;
    const message = data.message;
    const status = data.status;
    const details = data.details;

    if (httpCode === 401 && message === 'User with expired authentication') {
      removeUser();
      component.$router.push('/login');
    }

    if (httpCode === 400 && typeof component.dialog === 'function') {
      rawResponse.dialog();
    }
  }
};

const getDataUser = () => fn.getLocalStorage('dataUser');

export default { isLoggedIn, registerUser, getDataUser, removeUser, commonDialog };
