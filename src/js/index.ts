import '../sass/main.scss';
import 'bootstrap';
import 'flowbite';

import './components/app-header';
import './components/story-list';
import './components/add-story-form';
import './components/profile-card';
import './components/app-footer';
import './components/login-form';
import './components/register-form';
import './components/locale-picker';

import { isAuthenticated, logout, getUserName } from './services/authService';
import { getStories } from './services/storyService';
import { setLocaleFromUrl } from './localization';

interface Story {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  createdAt: string;
}

let storiesData: Story[] = [];

async function renderPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  const hash: string = window.location.hash || '#home';

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
              <h1 class="hero-title" id="welcome-title"></h1>
              <p class="lead hero-subtitle" id="welcome-subtitle"></p>
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
              <h2 class="text-center mb-4 form-page-title" id="add-title"></h2>
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
      pageContent = `<h2 class="text-center" id="page-not-found"></h2>`;
  }

  app.innerHTML = `
    <app-header></app-header>
    <main class="py-4">${pageContent}</main>
    <app-footer></app-footer>
  `;
}

async function initApp(): Promise<void> {
  await setLocaleFromUrl();

  window.addEventListener('hashchange', () => {
    renderPage();
  });

  window.addEventListener('auth-changed', () => {
    storiesData = [];
    renderPage();
  });

  window.addEventListener('locale-changed', () => {
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
