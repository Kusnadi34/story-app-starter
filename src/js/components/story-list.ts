import { LitElement, html } from 'lit';

class StoryList extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    stories: { type: Array },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.stories = [];
    this.loading = false;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;
    }

    if (!this.stories || this.stories.length === 0) {
      return html`<p class="text-center text-muted py-5">No stories found.</p>`;
    }

    return html`
      <div class="row custom-grid">
        ${this.stories.map(
          (story) => html`
            <div class="col">
              <div class="card story-card">
                <img
                  src="${story.photoUrl}"
                  class="card-img-top"
                  alt="${story.name}"
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
          `
        )}
      </div>
    `;
  }
}

customElements.define('story-list', StoryList);
