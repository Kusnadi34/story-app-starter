import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
// ✅ PERBAIKAN: Impor allLocales dari generated/locale-codes
import { allLocales } from '../../generated/locale-codes';
import { getLocale, localeNames, setLocaleFromUrl } from '../localization';

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = css`
    /* Tambahkan styling khusus jika diperlukan,
       meskipun kamu sudah pakai Bootstrap & Tailwind di class */
  `;

  constructor() {
    super();
    // Wajib dipanggil agar komponen ini ikut re-render saat bahasa diganti
    updateWhenLocaleChanges(this);
  }

  render() {
    const currentLocale = getLocale(); // Ambil locale saat ini

    return html`
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">${msg('Story App')}</a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" href="#/">${msg('Home')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/add">${msg('Add Story')}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/profile">${msg('Profile')}</a>
              </li>
            </ul>

            <ul class="navbar-nav">
              <!-- Dropdown Bahasa -->
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

              <!-- Tombol Logout -->
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
      // Perbarui URL dengan parameter ?lang=...
      const url = new URL(window.location.href);
      url.searchParams.set('lang', locale);
      window.history.pushState(null, '', url.toString());

      // Panggil fungsi dari localization.ts (tidak perlu custom event lagi)
      setLocaleFromUrl();
    }
  }

  _handleLogout(e: Event) {
    e.preventDefault();
    if ((window as any).__logout) {
      (window as any).__logout();
    }

    // Tutup offcanvas jika ada
    const offcanvas = document.querySelector('#offcanvas');
    if (offcanvas) {
      // Asumsi menggunakan Bootstrap 5
      const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  }
}
           
