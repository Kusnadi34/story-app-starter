import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { allLocales } from '../../generated/locale-codes';
import { getLocale, localeNames, setLocaleFromUrl } from '../localization';

@customElement('app-header')
export class AppHeader extends LitElement {
  // ✅ Mematikan Shadow DOM agar styling dari luar bisa masuk
  createRenderRoot() {
    return this;
  }

  static styles = css``;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    const currentLocale = getLocale();

    return html`
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#home">${msg('Story App')}</a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" href="#home">${msg('Home')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#add">${msg('Add Story')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#profile">${msg('Profile')}</a>
              </li>
            </ul>

            <ul class="navbar-nav">
              <li class="nav-item dropdown relative">
                <button
                  class="nav-link dropdown-toggle flex items-center"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  ${currentLocale === 'en' ? '🌐 EN' : '🌐 ID'}
                </button>
                <div class="dropdown-menu absolute z-50" id="languageDropdownMenu">
                  <ul class="list-unstyled m-0">
                    ${allLocales.map(
                      (locale) => html`
                        <li>
                          <a
                            class="dropdown-item px-4 py-2 block ${
                              locale === currentLocale
                                ? 'bg-primary-50 text-primary-700'
                                : ''
                            }"
                            href="#"
                            @click=${this._switchLocale}
                            data-locale=${locale}
                          >
                            ${localeNames[locale]}
                          </a>
                        </li>
                      `,
                    )}
                  </ul>
                </div>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="#" @click=${this._handleLogout}>
                  ${msg('Logout')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  _switchLocale(e: Event) {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const locale = target.dataset.locale;

    if (locale && locale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', locale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
  }

  _handleLogout(e: Event) {
    e.preventDefault();
    if ((window as any).__logout) {
      (window as any).__logout();
    }
  }
}
