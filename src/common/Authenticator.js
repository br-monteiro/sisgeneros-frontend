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

export default { isLoggedIn, registerUser };