import '../sass/main.scss';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import { configureLocalization, getLocale, setLocale } from '@lit/localize';
import api from './services/api.js';


import './components/app-header.js';
import './components/story-list.js';
import './components/add-story-form.js';
import './components/profile-card.js';
import './components/app-footer.js';
import './components/login-form.js';
import './components/register-form.js';


const { getLocale, setLocale, msg, updateWhenLocaleChanges } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['en', 'id'],
  loadLocale: async (locale) => {
    const data = await import(`../locales/${locale}.json`);
    return data.default;
  },
});

window.__litLocalize = { getLocale, setLocale, msg, updateWhenLocaleChanges };


let allStories = [];
let isLoadingStories = false;


function isAuthenticated() {
  return !!localStorage.getItem('token');
}


async function fetchStories() {
  if (!isAuthenticated()) return;
  
  isLoadingStories = true;
  renderPage(); 
  
  try {
    const response = await api.get('/stories');
    allStories = response.data.listStory || [];
    console.log('Stories fetched:', allStories.length);
  } catch (error) {
    console.error('Fetch stories error:', error);
    allStories = [];
  } finally {
    isLoadingStories = false;
    renderPage();
  }
}


function renderPage() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#home';
  const isAuth = isAuthenticated();

  
  if (!isAuth && hash !== '#login' && hash !== '#register') {
    window.location.hash = '#login';
    return;
  }

  
  if (isAuth && (hash === '#login' || hash === '#register')) {
    window.location.hash = '#home';
    return;
  }

  const t = (key) => {
    if (window.__i18n && window.__i18n[key]) {
      return window.__i18n[key];
    }
    return key;
  };

  let pageContent = '';

  switch (hash) {
    case '#home':
      let storiesHtml = '';
      if (isLoadingStories) {
        storiesHtml = `
          <div class="text-center py-5">
            <div class="spinner-border text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">${t('loadingStories')}</p>
          </div>
        `;
      } else if (allStories.length === 0) {
        storiesHtml = `<p class="text-center">${t('noStories')}</p>`;
      } else {
        
        storiesHtml = `<story-list id="storyListComponent"></story-list>`;
      }

      pageContent = `
        <div class="home-page">
          <div class="hero text-center">
            <div class="container">
              <h1 class="hero-title">${t('welcomeTitle')}</h1>
              <p class="lead hero-subtitle">${t('welcomeSubtitle')}</p>
            </div>
          </div>
          <div class="container">
            ${storiesHtml}
          </div>
        </div>
      `;
      break;

    case '#add':
      pageContent = `
        <div class="add-page">
          <div class="container">
            <div class="form-container">
              <h2 class="text-center mb-4 form-page-title">${t('addTitle')}</h2>
              <add-story-form></add-story-form>
            </div>
          </div>
        </div>
      `;
      break;

    case '#profile':
      pageContent = `
        <div class="profile-page">
          <div class="container">
            <profile-card></profile-card>
          </div>
        </div>
      `;
      break;

    case '#login':
      pageContent = `
        <div class="auth-page">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-6 col-lg-5">
                <login-form></login-form>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case '#register':
      pageContent = `
        <div class="auth-page">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-6 col-lg-5">
                <register-form></register-form>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    default:
      pageContent = `<h2 class="text-center">${t('pageNotFound')}</h2>`;
  }

  app.innerHTML = `
    <app-header></app-header>
    <main class="py-4">
      ${pageContent}
    </main>
    <app-footer></app-footer>
  `;

  
  if (hash === '#home' && !isLoadingStories && allStories.length > 0) {
    const storyListEl = document.getElementById('storyListComponent');
    if (storyListEl) {
      storyListEl.stories = allStories;
    }
  }
}


async function initApp() {
  await setLocale('en');
  const locale = getLocale();
  const data = await import(`../locales/${locale}.json`);
  window.__i18n = data.default;

  
  if (isAuthenticated()) {
    await fetchStories();
  }

  renderPage();

  
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#home' && isAuthenticated()) {
      fetchStories();
    } else {
      renderPage();
    }
  });

  
  window.addEventListener('auth-changed', () => {
    renderPage();
  });

  
  window.addEventListener('locale-changed', async (e) => {
    const newLocale = e.detail.locale;
    await setLocale(newLocale);
    const newData = await import(`../locales/${newLocale}.json`);
    window.__i18n = newData.default;
    renderPage();
  });
}

initApp();