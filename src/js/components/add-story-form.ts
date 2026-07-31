import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { addStory } from '../services/storyService';

class AddStoryForm extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.loading = false;
    this.error = '';
    this.success = false;
  }

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    success: { type: Boolean },
  };

  render() {
    return html`
      <form class="custom-form needs-validation" novalidate @submit=${this._handleSubmit}>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        ${this.success ? html`<div class="alert alert-success">${msg('formSuccess')}</div>` : ''}
        <div class="mb-3">
          <label for="description" class="form-label">${msg('formDescription')}</label>
          <textarea class="form-control" id="description" rows="3" required></textarea>
          <div class="invalid-feedback">${msg('formDescRequired')}</div>
        </div>
        <div class="mb-3">
          <label for="photo" class="form-label">${msg('formPhoto')}</label>
          <input type="file" class="form-control" id="photo" accept="image/*" required />
          <div class="invalid-feedback">${msg('formPhotoRequired')}</div>
        </div>
        <button type="submit" class="btn btn-submit w-100" ?disabled=${this.loading}>
          ${this.loading
            ? html`<span class="spinner-border spinner-border-sm"></span>`
            : msg('formSubmit')}
        </button>
      </form>
    `;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    this.error = '';
    this.success = false;
    this.loading = true;

    const description = form.querySelector('#description').value;
    const photoFile = form.querySelector('#photo').files[0];

    try {
      await addStory(description, photoFile);
      this.success = true;
      form.reset();
      form.classList.remove('was-validated');
      if (window.__refreshStories) window.__refreshStories();
    } catch (err) {
      this.error = err.response?.data?.message || msg('formError');
    } finally {
      this.loading = false;
    }
  }
}

customElements.define('add-story-form', AddStoryForm);
