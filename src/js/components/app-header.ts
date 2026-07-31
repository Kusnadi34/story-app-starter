import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

declare global {
  interface Window {
    __litLocalize: any;
    __logout: () => void;
  }
  const bootstrap: any;
}

class AppHeader extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    const currentLocale: string = window.__litLocalize?.getLocale() || 'en';
    const isLoggedIn: boolean = !!localStorage.getItem('accessToken');
    const userName: string = localStorage.getItem('userName') || '';

    return html`
      <nav class="navbar navbar-expand-lg custom-navbar shadow-md">
        <div class="container">
          <a class="navbar-brand text-2xl font-playfair font-bold" href="#home">📖 ${msg('appTitle')}</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
          >
            <div class="offcanvas-header bg-primary-50">
              <h5 class="offcanvas-title font-playfair">${msg('appTitle')}</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 items-center gap-2">
                ${isLoggedIn
                  ? html`
                      <li class="nav-item">
                        <a class="nav-link" href="#home">${msg('navHome')}</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#add">${msg('navAdd')}</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#profile">${msg('navProfile')}</a>
                      </li>
                      <li class="nav-item">
                        <span class="nav-link text-success font-medium">👤 ${userName}</span>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link text-red-600 hover:text-red-800" href="#" @click=${this._handleLogout}
                          >${msg('logout')}</a
                        >
                      </li>
                    `
                  : ''}
                <!-- Dropdown Bahasa dengan Flowbite -->
                <li class="nav-item dropdown relative">
                  <button
                    class="nav-link dropdown-toggle flex items-center gap-1"
                    id="languageDropdown"
                    data-dropdown-toggle="languageDropdownMenu"
                    type="button"
                  >
                    ${currentLocale === 'en' ? '🌐 EN' : '🌐 ID'}
                  </button>
                  <div
                    class="dropdown-menu absolute z-50 hidden bg-white shadow-lg rounded-lg py-2 min-w-[120px]"
                    id="languageDropdownMenu"
                  >
                    <ul>
                      <li>
                        <a
                          class="dropdown-item px-4 py-2 hover:bg-gray-100 block ${currentLocale === 'en'
                            ? 'bg-primary-50 text-primary'
                            : ''}"
                          href="#"
                          @click=${this._switchLocale}
                          data-locale="en"
                          >English</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item px-4 py-2 hover:bg-gray-100 block ${currentLocale === 'id'
                            ? 'bg-primary-50 text-primary'
                            : ''}"
                          href="#"
                          @click=${this._switchLocale}
                          data-locale="id"
                          >Indonesia</a
                        >
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  _switchLocale(e: Event) {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const locale = target.dataset.locale;
    if (locale) {
      window.dispatchEvent(
        new CustomEvent('locale-changed', { detail: { locale } })
      );
      const offcanvas = document.querySelector('#offcanvasNavbar');
      if (offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
    }
  }

  _handleLogout(e: Event) {
    e.preventDefault();
    if (window.__logout) window.__logout();
    const offcanvas = document.querySelector('#offcanvasNavbar');
    if (offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
  }
}

customElements.define('app-header', AppHeader);
