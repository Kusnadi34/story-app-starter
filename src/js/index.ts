import '../sass/main.scss';
import 'bootstrap';
import 'flowbite';

import { configureLocalization, LocalizeMixin } from '@lit/localize';
import { LitElement, html } from 'lit';

// Import semua komponen (TypeScript)
import './components/app-header.js';
import './components/story-list.js';
import './components/add-story-form.js';
import './components/profile-card.js';
import './components/app-footer.js';
import './components/login-form.js';
import './components/register-form.js';

import { isAuthenticated, logout, getUserName } from './services/authService.js';
import { getStories } from './services/storyService.js';

// Interface untuk tipe data Story
interface Story {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  createdAt: string;
}

interface I18nMap {
  [key: string]: string;
}

// Lokalisasi dengan XLIFF
const { getLocale, setLocale, msg, updateWhenLocaleChanges } =
  configureLocalization({
    sourceLocale: 'en',
    targetLocales: ['id'],
    loadLocale: async (locale: string) => {
      // Muat file hasil build dari XLIFF
      const data = await import(`../generated/locales/${locale}.js`);
      return data.default || data;
    },
  });

window.__litLocalize = { getLocale, setLocale, msg, updateWhenLocaleChanges };

// State global
let storiesData: Story[] = [];
let currentUser: string = '';

// Fungsi render utama
async function renderPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  const hash: string = window.location.hash || '#home';
  const t = (key: string): string => (window as any).__i18n?.[key] || key;

  // 1. Cek Autentikasi
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

  // 2. Sudah Login
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
            <div class="form-container max-w-2xl mx-auto">
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
async function initApp(): Promise<void> {
  // Set locale default
  await setLocale('en');
  const locale = getLocale();
  const data = await import(`../generated/locales/${locale}.js`);
  (window as any).__i18n = data.default || data;

  // Event listeners
  window.addEventListener('hashchange', () => {
    renderPage();
  });

  window.addEventListener('auth-changed', () => {
    storiesData = [];
    renderPage();
  });

  window.addEventListener('locale-changed', async (e: Event) => {
    const customEvent = e as CustomEvent<{ locale: string }>;
    const newLocale = customEvent.detail.locale;
    await setLocale(newLocale);
    const newData = await import(`../generated/locales/${newLocale}.js`);
    (window as any).__i18n = newData.default || newData;
    renderPage();
  });

  (window as any).__logout = () => {
    logout();
    storiesData = [];
    window.dispatchEvent(new CustomEvent('auth-changed'));
  };

  (window as any).__refreshStories = async () => {
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
