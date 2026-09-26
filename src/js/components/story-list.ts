import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

@customElement('story-list')
export class StoryList extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    stories: { type: Array },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.stories = [];
    this.loading = false;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">${msg('Loading...')}</span>
          </div>
        </div>
      `;
    }

    if (!this.stories || this.stories.length === 0) {
      return html`<p class="text-center text-muted py-5">${msg('No stories available')}</p>`;
    }

    return html`
      <!-- ✅ PERBAIKAN: Hapus 'custom-grid', gunakan 'row g-2' -->
      <div class="row g-2">
        ${this.stories.map(
          (story) => html`
            <!-- ✅ PERBAIKAN: Gunakan col-12 col-sm-6 col-md-4 agar responsif -->
            <div class="col-12 col-sm-6 col-md-4">
              <!-- ✅ Tambahan 'h-100' agar tinggi kartu seragam -->
              <div class="card story-card h-100">
                <img
                  src="${story.photoUrl}"
                  class="card-img-top"
                  alt="${story.name}"
                  onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Image+Not+Found';"
                />
                <div class="card-body">
                  <h5 class="card-title">${story.name}</h5>
                  <p class="card-text">${story.description}</p>
                  <p class="story-date text-muted small">
                    ${new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
