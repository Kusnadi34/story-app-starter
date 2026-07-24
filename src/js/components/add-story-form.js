import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import api from '../services/api.js';

class AddStoryForm extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.isSubmitting = false;
    this.feedbackMessage = '';
    this.feedbackType = ''; 
  }

  render() {
    return html`
      ${this.feedbackMessage ? html`
        <div class="alert alert-${this.feedbackType} alert-dismissible fade show" role="alert">
          ${this.feedbackMessage}
          <button type="button" class="btn-close" @click=${() => { this.feedbackMessage = ''; this.requestUpdate(); }}></button>
        </div>
      ` : ''}

      <form class="custom-form needs-validation" novalidate @submit=${this._handleSubmit}>
        <div class="mb-3">
          <label for="description" class="form-label">${msg('formDescription')}</label>
          <textarea class="form-control" id="description" rows="3" required></textarea>
          <div class="invalid-feedback">${msg('formDescRequired')}</div>
        </div>
        <div class="mb-3">
          <label for="photo" class="form-label">${msg('formPhoto')}</label>
          <input type="file" class="form-control" id="photo" accept="image/*" required>
          <div class="invalid-feedback">${msg('formPhotoRequired')}</div>
        </div>
        <button type="submit" class="btn btn-submit w-100" ?disabled=${this.isSubmitting}>
          ${this.isSubmitting ? html`<span class="spinner-border spinner-border-sm me-2"></span>` : ''}
          ${msg('formSubmit')}
        </button>
      </form>
    `;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const description = form.querySelector('#description').value;
    const photoFile = form.querySelector('#photo').files[0];

    
    if (!form.checkValidity() || !photoFile) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoFile);

    this.isSubmitting = true;
    this.feedbackMessage = '';
    this.requestUpdate();

    try {
      const response = await api.post('/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Add story success:', response.data);
      this.feedbackType = 'success';
      this.feedbackMessage = msg('formSuccess');
      
      form.reset();
      form.classList.remove('was-validated');
      
      
      window.dispatchEvent(new CustomEvent('story-added'));
      
    } catch (error) {
      console.log('Add story error:', error);
      const msgError = error.response?.data?.message || 'Gagal menambah cerita.';
      this.feedbackType = 'danger';
      this.feedbackMessage = msgError;
    } finally {
      this.isSubmitting = false;
      this.requestUpdate();
    }
  }
}

customElements.define('add-story-form', AddStoryForm);