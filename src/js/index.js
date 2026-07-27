import '../sass/main.scss';
import 'bootstrap';
import { configureLocalization } from '@lit/localize';

// Import semua komponen
import './components/app-header.js';
import './components/story-list.js';
import './components/add-story-form.js';
import './components/profile-card.js';
import './components/app-footer.js';
import './components/login-form.js';
import './components/register-form.js';

import { isAuthenticated, logout, getUserName } from './services/authService';
import { getStories } from './services/storyService';

// Fungsi untuk memuat file terjemahan via fetch (aman untuk GitHub Pages)
async function loadLocale(locale) {
  try {
    const response = await fetch(`locales/${locale}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Gagal memuat locale ${locale}:`, error);
    // Fallback ke en jika gagal
    if (locale !== 'en') {
      return loadLocale('en');
    }
    return {}; // fallback kosong
  }
}

// Konfigurasi Localization
const { getLocale, setLocale, msg, updateWhenLocaleChanges } =
  configureLocalization({
    sourceLocale: 'en',
    targetLocales: ['en', 'id'],
    loadLocale: async (locale) => {
      return await loadLocale(locale);
    },
  });

window.__litLocalize = { getLocale, setLocale, msg, updateWhenLocaleChanges };

let storiesData = [];
let currentUser = '';

async function renderPage() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#home';

  // 1. CEK AUTHENTIKASI
  if (!isAuthenticated()) {
    let authContent = '';
    if (hash === '#register') {
      authContent = '<register-form></register-form>';
    } else {
      authContent = '<login-form></login-form>';
    }
    app.innerHTML = `
      <div class="container auth-wrapper py-5">
        <div class="row justify-content-center">
          <div class="col-md-6">${authContent}</div>
        </div>
      </div>
    `;
    return;
  }

  // 2. SUDAH LOGIN
  currentUser = getUserName();

  // Ambil data stories jika di halaman home
  if (hash === '#home') {
    try {
      const response = await getStories();
      storiesData = response.data.listStory || [];
    } catch (error) {
      console.error('Gagal mengambil stories:', error);
      storiesData = [];
    }
  }

  const t = (key) => window.__i18n?.[key] || key;

  let pageContent = '';
  switch (hash) {
    case '#home':
      pageContent = `
        <div class="home-page">
          <div class="hero text-center">
            <div class="container">
              <h1 class="hero-title">${t('welcomeTitle')}</h1>
              <p class="lead hero-subtitle">${t('welcomeSubtitle')}</p>
            </div>
          </div>
          <div class="container">
            <story-list stories='${JSON.stringify(storiesData)}'></story-list>
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
    default:
      pageContent = `<h2 class="text-center">${t('pageNotFound')}</h2>`;
  }

  app.innerHTML = `
    <app-header></app-header>
    <main class="py-4">${pageContent}</main>
    <app-footer></app-footer>
  `;
}

// Inisialisasi Aplikasi
async function initApp() {
  // Set locale awal (en)
  await setLocale('en');
  const locale = getLocale();
  
  // Muat terjemahan awal via fetch
  const data = await loadLocale(locale);
  window.__i18n = data;

  window.addEventListener('hashchange', () => {
    renderPage();
  });

  window.addEventListener('auth-changed', () => {
    storiesData = [];
    renderPage();
  });

  // Event listener untuk perubahan bahasa (dari header)
  window.addEventListener('locale-changed', async (e) => {
    const newLocale = e.detail.locale;
    await setLocale(newLocale);
    const newData = await loadLocale(newLocale);
    window.__i18n = newData;
    renderPage();
  });

  window.__logout = () => {
    logout();
    storiesData = [];
    window.dispatchEvent(new CustomEvent('auth-changed'));
  };

  window.__refreshStories = async () => {
    try {
      const response = await getStories();
      storiesData = response.data.listStory || [];
      renderPage();
    } catch (error) {
      console.error('Refresh stories gagal:', error);
    }
  };

  renderPage();
}

initApp();
