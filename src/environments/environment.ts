const apiBase_dev = 'http://localhost:1977/';
const apiBase_svr = 'https://absapi.absolution1.com/';
const useDev = false // true; // false; // change this to true when running from code, and false when you want to use the deployed api

const apiBase = useDev ? apiBase_dev : apiBase_svr

export const environment = {
  production: false,
  apiBaseUrl: 'https://absapi.absolution1.com',
  apiBaseUrl2: 'https://api-tsms.abboptical.com/rwall-vm/api',
  tokenStorageKey: 'cla-portal_jwt',

  // maybe we should create an environment.dev.ts
  urlBase:       apiBase,
  urlBaseABS:    apiBase + 'api/',
  urlBaseABShub: apiBase ,
  urlBaseImages: apiBase + 'mystaticfiles/',
  signalrHubUrl: apiBase + 'signalrdemohub',
  signalrHubUrl2: apiBase + 'signalrhub',
  USER_ID: 'wjz'
};
