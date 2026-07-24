import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import api from '../services/api.js';

class LoginForm extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.isLoading = false;
    this.errorMessage = '';
    this.showPassword = false;
  }

  render() {
    return html`
      <div class="auth-container">
        <h2 class="text-center mb-4">${msg('loginTitle')}</h2>
        
        ${this.errorMessage ? html`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${this.errorMessage}
            <button type="button" class="btn-close" @click=${() => this.errorMessage = ''}></button>
          </div>
        ` : ''}

        <form @submit=${this._handleLogin} class="custom-form">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">${msg('emailLabel')}</label>
            <input type="email" class="form-control" id="loginEmail" required>
          </div>

          <div class="mb-3 position-relative">
            <label for="loginPassword" class="form-label">${msg('passwordLabel')}</label>
            <div class="input-group">
              <input 
                type="${this.showPassword ? 'text' : 'password'}" 
                class="form-control" 
                id="loginPassword" 
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
            ${msg('loginButton')}
          </button>
        </form>

        <p class="text-center mt-3">
          ${msg('noAccount')} <a href="#register">${msg('registerHere')}</a>
        </p>
      </div>
    `;
  }

  _togglePassword() {
    this.showPassword = !this.showPassword;
    this.requestUpdate();
  }

  async _handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;

    
    if (password.length < 8) {
      this.errorMessage = msg('passwordMin8');
      this.requestUpdate();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.requestUpdate();

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      
      window.dispatchEvent(new CustomEvent('auth-changed'));
      
      
      window.location.hash = '#home';
    } catch (error) {
      console.log('Login error:', error);
      const msgError = error.response?.data?.message || 'Login gagal, coba lagi.';
      this.errorMessage = msgError;
    } finally {
      this.isLoading = false;
      this.requestUpdate();
    }
  }
}

customElements.define('login-form', LoginForm);