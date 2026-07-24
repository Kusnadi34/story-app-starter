import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import api from '../services/api.js';

class RegisterForm extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.isLoading = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.showPassword = false;
  }

  render() {
    return html`
      <div class="auth-container">
        <h2 class="text-center mb-4">${msg('registerTitle')}</h2>
        
        ${this.successMessage ? html`
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${this.successMessage}
            <button type="button" class="btn-close" @click=${() => this.successMessage = ''}></button>
          </div>
        ` : ''}

        ${this.errorMessage ? html`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${this.errorMessage}
            <button type="button" class="btn-close" @click=${() => this.errorMessage = ''}></button>
          </div>
        ` : ''}

        <form @submit=${this._handleRegister} class="custom-form">
          <div class="mb-3">
            <label for="registerName" class="form-label">${msg('nameLabel')}</label>
            <input type="text" class="form-control" id="registerName" required>
          </div>

          <div class="mb-3">
            <label for="registerEmail" class="form-label">${msg('emailLabel')}</label>
            <input type="email" class="form-control" id="registerEmail" required>
          </div>

          <div class="mb-3 position-relative">
            <label for="registerPassword" class="form-label">${msg('passwordLabel')}</label>
            <div class="input-group">
              <input 
                type="${this.showPassword ? 'text' : 'password'}" 
                class="form-control" 
                id="registerPassword" 
                required 
                minlength="8"
              >
              <button class="btn btn-outline-secondary" type="button" @click=${this._togglePassword}>
                <i class="bi ${this.showPassword ? 'bi-eye-slash' : 'bi-eye'}"></i>
              </button>
            </div>
            <div class="invalid-feedback">${msg('passwordMin8')}</div>
          </div>

          <button type="submit" class="btn btn-submit w-100" ?disabled=${this.isLoading}>
            ${this.isLoading ? html`<span class="spinner-border spinner-border-sm me-2"></span>` : ''}
            ${msg('registerButton')}
          </button>
        </form>

        <p class="text-center mt-3">
          ${msg('haveAccount')} <a href="#login">${msg('loginHere')}</a>
        </p>
      </div>
    `;
  }

  _togglePassword() {
    this.showPassword = !this.showPassword;
    this.requestUpdate();
  }

  async _handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('#registerName').value;
    const email = form.querySelector('#registerEmail').value;
    const password = form.querySelector('#registerPassword').value;

    if (password.length < 8) {
      this.errorMessage = msg('passwordMin8');
      this.requestUpdate();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.requestUpdate();

    try {
      const response = await api.post('/register', { name, email, password });
      console.log('Register success:', response.data);
      this.successMessage = msg('registerSuccess');
      
      form.reset();
      
      
      setTimeout(() => {
        window.location.hash = '#login';
      }, 2000);
    } catch (error) {
      console.log('Register error:', error);
      const msgError = error.response?.data?.message || 'Registrasi gagal, coba lagi.';
      this.errorMessage = msgError;
    } finally {
      this.isLoading = false;
      this.requestUpdate();
    }
  }
}

customElements.define('register-form', RegisterForm);