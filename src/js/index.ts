import '../sass/main.scss';
import 'bootstrap';
import 'flowbite';

import { configureLocalization } from '@lit/localize';

// Import semua komponen (ubah .js menjadi .ts)
import './components/app-header.ts';
import './components/story-list.ts';
import './components/add-story-form.ts';
import './components/profile-card.ts';
import './components/app-footer.ts';
import './components/login-form.ts';
import './components/register-form.ts';

import { isAuthenticated, logout, getUserName } from './services/authService.ts';
import { getStories } from './services/storyService.ts';

// Interface untuk tipe data Story
interface Story {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  createdAt: string;
}

// Fungsi untuk memuat file terjemahan dengan fetch
async function loadLocale(locale: string) {
  try {
    const response = await fetch(`locales/${locale}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Gagal memuat locale ${locale}:`, error);
    if (locale !== 'en') {
      return loadLocale('en');
    }
    return {};
  }
}

// Konfigurasi Lokalisasi
const { getLocale, setLocale, msg, updateWhenLocaleChanges } =
  configureLocalization({
    sourceLocale: 'en',
    targetLocales: ['id'],
    loadLocale: async (locale: string) => {
      return await loadLocale(locale);
    },
  });

window.__litLocalize = { getLocale, setLocale, msg, updateWhenLocaleChanges };

let storiesData: Story[] = [];
let currentUser: string = '';

async function renderPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  const hash: string = window.location.hash || '#home';
  const t = (key: string): string => (window as any).__i18n?.[key] || key;

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

  currentUser = getUserName();

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

async function initApp(): Promise<void> {
  await setLocale('en');
  const locale = getLocale();
  const data = await loadLocale(locale);
  (window as any).__i18n = data;

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
    const newData = await loadLocale(newLocale);
    (window as any).__i18n = newData;
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
