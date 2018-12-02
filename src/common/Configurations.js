const devHosts = [
  'localhost:8080',
  'dev.api.ceimbe.mb',
];

const DEV_HOST_API = '//dev.api.ceimbe.mb/api/v1/';

const PRD_HOST_API = '//www.ceimbe.mb/app/sisgeneros/api/v1/';

const DEV_HOST_APP = '//localhost:8080/';

const PRD_HOST_APP = '//www.ceimbe.mb/app/sisgeneros/';

const BASE_URL_API = devHosts.includes(window.location.host) ? DEV_HOST_API : PRD_HOST_API;

const BASE_URL_APP = devHosts.includes(window.location.host) ? DEV_HOST_APP : PRD_HOST_APP;

export default { BASE_URL_API, BASE_URL_APP };
