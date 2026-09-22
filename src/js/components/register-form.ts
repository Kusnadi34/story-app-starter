import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { register } from '../services/authService';

@customElement('register-form')
export class RegisterForm extends LitElement {
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
        <h2 class="text-center mb-4">${msg('Register')}</h2>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        <form @submit=${this._handleRegister}>
          <div class="mb-3">
            <label for="name" class="form-label">${msg('Name')}</label>
            <input type="text" class="form-control" id="name" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">${msg('Email')}</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3 position-relative">
            <label for="password" class="form-label">${msg('Password')}</label>
            <input type="password" class="form-control" id="password" required minlength="8" />
            <span class="password-toggle" @click=${this._togglePassword}>👁️</span>
          </div>
          <button type="submit" class="btn btn-submit w-100" ?disabled=${this.loading}>
            ${this.loading ? html`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${msg('Loading...')}` : msg('Register')}
          </button>
        </form>
        <p class="text-center mt-3">
          ${msg("Already have an account?")} <a href="#login" class="text-decoration-none">${msg('Login here')}</a>
        </p>
      </div>
    `;
  }

  async _handleRegister(e: Event) {
    e.preventDefault();
    this.error = '';
    this.loading = true;

    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#name') as HTMLInputElement).value;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    try {
      await register(name, email, password);
      alert(msg('Registration successful'));
      // ✅ Arahkan ke login setelah register berhasil
      window.location.hash = '#login';
    } catch (err: any) {
      this.error = err.response?.data?.message || msg('Registration failed');
    } finally {
      this.loading = false;
    }
  }

  _togglePassword() {
    const input = this.querySelector('#password') as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }
}
