import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { register } from '../services/authService';

class RegisterForm extends LitElement {
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
        <h2 class="text-center mb-4">${msg('registerTitle')}</h2>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        <form @submit=${this._handleRegister}>
          <div class="mb-3">
            <label for="name" class="form-label">${msg('name')}</label>
            <input type="text" class="form-control" id="name" required />
          </div>
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
            ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : msg('registerButton')}
          </button>
        </form>
        <p class="text-center mt-3">
          ${msg('haveAccount')} <a href="#login" class="text-primary">${msg('loginHere')}</a>
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
      window.location.hash = '#login';
      alert(msg('registerSuccess'));
    } catch (err: any) {
      this.error = err.response?.data?.message || msg('registerError');
    } finally {
      this.loading = false;
    }
  }

  _togglePassword(e: Event) {
    const input = this.querySelector('#password') as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

customElements.define('register-form', RegisterForm);
