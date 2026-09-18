import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { login } from '../services/authService';

@customElement('login-form')
export class LoginForm extends LitElement {
  createRenderRoot() {
    return this;
  }

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
        <h2 class="text-center mb-4">${msg('Login')}</h2>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        <form @submit=${this._handleLogin}>
          <div class="mb-3">
            <label for="email" class="form-label">${msg('Email')}</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3 position-relative">
            <label for="password" class="form-label">${msg('Password')}</label>
            <input type="password" class="form-control" id="password" required />
            <span class="password-toggle" @click=${this._togglePassword}>👁️</span>
          </div>
          <button type="submit" class="btn btn-submit w-100" ?disabled=${this.loading}>
            ${this.loading ? html`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${msg('Loading...')}` : msg('Login')}
          </button>
        </form>
        <p class="text-center mt-3">
          ${msg("Don't have an account?")} <a href="#register" class="text-decoration-none">${msg('Register here')}</a>
        </p>
      </div>
    `;
  }

  // ... methods tetap sama
}

