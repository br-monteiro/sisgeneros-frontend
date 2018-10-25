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

const getDataUser = () => fn.getLocalStorage('dataUser');

const getDefaultUserOmId = () => {
  let currentOm = fn.getLocalStorage('currentOm');
  if (currentOm.id) {
    return currentOm.id;
  }
  try {
    const omId = getDataUser().userProfile.find(i => i.default === 'yes').militaryOrganizationId;
    currentOm = parseInt(omId, 10);
  } catch (e) {
    console.error(`Error: ${e}`);
    currentOm = 0;
  }
  fn.setLocalStorage('currentOm', { id: currentOm });
  return currentOm;
};

export default { isLoggedIn, registerUser, getDataUser, removeUser, getDefaultUserOmId };
