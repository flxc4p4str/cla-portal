const apiBase_dev = 'http://localhost:1977/';
const apiBase_svr = 'https://absapi.absolution1.com/';
const useDev = false; // false; // change this to true when running from code, and false when you want to use the deployed api

const apiBase = useDev ? apiBase_dev : apiBase_svr

export const environment = {
  production: false,
  apiBaseUrl: apiBase, // 'https://absapi.absolution1.com',
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