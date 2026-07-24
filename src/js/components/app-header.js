import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class AppHeader extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.isAuth = false;
    
    this._onAuthChange = this._onAuthChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('auth-changed', this._onAuthChange);
    this._checkAuth();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('auth-changed', this._onAuthChange);
  }

  _checkAuth() {
    this.isAuth = !!localStorage.getItem('token');
    this.requestUpdate();
  }

  _onAuthChange() {
    this._checkAuth();
  }

  render() {
    const currentLocale = window.__litLocalize?.getLocale() || 'en';

    return html`
      <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container">
          <a class="navbar-brand" href="#home">📖 ${msg('appTitle')}</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title">${msg('appTitle')}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                ${this.isAuth ? html`
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
                    <a class="nav-link" href="#" @click=${this._handleLogout}>${msg('logout')}</a>
                  </li>
                ` : html`
                  <li class="nav-item">
                    <a class="nav-link" href="#login">${msg('login')}</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#register">${msg('register')}</a>
                  </li>
                `}
                
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${currentLocale === 'en' ? '🌐 EN' : '🌐 ID'}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                    <li><a class="dropdown-item ${currentLocale === 'en' ? 'active' : ''}" href="#" @click=${this._switchLocale} data-locale="en">English</a></li>
                    <li><a class="dropdown-item ${currentLocale === 'id' ? 'active' : ''}" href="#" @click=${this._switchLocale} data-locale="id">Indonesia</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  _handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-changed'));
    window.location.hash = '#login';
    
    const offcanvas = document.querySelector('#offcanvasNavbar');
    if (offcanvas) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
  }

  _switchLocale(e) {
    e.preventDefault();
    const locale = e.currentTarget.dataset.locale;
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }));
    const offcanvas = document.querySelector('#offcanvasNavbar');
    if (offcanvas) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
  }
}

customElements.define('app-header', AppHeader);
