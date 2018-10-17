const devHosts = [
  'localhost:8080',
  'dev.api.ceimbe.mb',
];
const BASE_URL_PAI = devHosts.includes(window.location.host) ? '//dev.api.ceimbe.mb/api/v1/' : '//ceimbe.mb/sisgeneros/api/v1/';

export default { BASE_URL_PAI };
