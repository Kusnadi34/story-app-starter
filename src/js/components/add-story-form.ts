import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
// Sesuaikan import service dengan yang ada di proyekmu
import { addStory } from '../services/storyService'; 

@customElement('add-story-form')
export class AddStoryForm extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.loading = false;
    this.error = '';
  }

  render() {
    return html`
      <div class="add-story-form">
        <h2 class="text-center mb-4">${msg('Add Story')}</h2>
        ${this.error ? html`<div class="alert alert-danger">${this.error}</div>` : ''}
        
        <form @submit=${this._handleSubmit}>
          <div class="mb-3">
            <label for="description" class="form-label">${msg('Description')}</label>
            <textarea id="description" class="form-control" required></textarea>
          </div>
          
          <div class="mb-3">
            <label for="photo" class="form-label">${msg('Photo')}</label>
            <input type="file" id="photo" class="form-control" accept="image/*" required />
          </div>

          <button type="submit" class="btn btn-primary w-100" ?disabled=${this.loading}>
            ${this.loading ? msg('Loading...') : msg('Submit')}
          </button>
        </form>
      </div>
    `;
  }

  async _handleSubmit(e: Event) {
    e.preventDefault();
    this.error = '';
    this.loading = true;

    const form = e.target as HTMLFormElement;
    const description = (form.querySelector('#description') as HTMLTextAreaElement).value;
    const photoInput = form.querySelector('#photo') as HTMLInputElement;
    const photo = photoInput.files?.[0];

    if (!photo) {
      this.error = msg('Photo is required');
      this.loading = false;
      return;
    }

    try {
      // Logika upload cerita
      // await addStory(description, photo);
      alert(msg('Story added successfully'));
      form.reset();
    } catch (err: any) {
      this.error = err.message || msg('Failed to add story');
    } finally {
      this.loading = false;
    }
  }
}
