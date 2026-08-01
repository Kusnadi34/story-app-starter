import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { login } from '../services/authService';

class LoginForm extends LitElement {
  createRenderRoot() { return this; }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.error = '';
    this.loading = false;
  }

  static properties = {
    error: { type: String },
    loading: { type: Boolean },
  };

  render() {
    return html`
      <div class="auth-form">
        <h2 class="text-center mb-4">${msg('loginTitle')}</h2>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        <form @submit=${this._handleLogin}>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3 position-relative">
            <label for="password" class="form-label">${msg('password')}</label>
            <input type="password" class="form-control" id="password" required minlength="8" />
            <span class="password-toggle" @click=${this._togglePassword} style="position:absolute; right:15px; top:44px; cursor:pointer;">👁️</span>
          </div>
          <button type="submit" class="btn btn-submit w-100" ?disabled=${this.loading}>
            ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : msg('loginButton')}
          </button>
        </form>
        <p class="text-center mt-3">
          ${msg('noAccount')} <a href="#register" class="text-primary">${msg('registerHere')}</a>
        </p>
      </div>
    `;
  }

  // ... methods tetap sama
}
customElements.define('login-form', LoginForm);
