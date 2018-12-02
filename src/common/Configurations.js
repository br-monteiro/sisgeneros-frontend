const devHosts = [
  'localhost:8080',
  'dev.api.ceimbe.mb',
];

const DEV_HOST = '//dev.api.ceimbe.mb/api/v1/';

const PRD_HOST = '//www.ceimbe.mb/app/sisgeneros/api/v1/';

const BASE_URL_PAI = devHosts.includes(window.location.host) ? DEV_HOST : PRD_HOST;

export default { BASE_URL_PAI };
