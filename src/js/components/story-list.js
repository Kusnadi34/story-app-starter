import { LitElement, html } from 'lit';

class StoryList extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      stories: { type: Array }
    };
  }

  constructor() {
    super();
    this.stories = [];
  }

  
  setStories(newStories) {
    this.stories = newStories;
    this.requestUpdate();
  }

  render() {
    if (!this.stories || this.stories.length === 0) {
      return html`<p class="text-center">Belum ada cerita.</p>`;
    }

    return html`
      <div class="row custom-grid">
        ${this.stories.map(story => html`
          <div class="col-md-4 col-sm-6 mb-4">
            <div class="card story-card">
              <img src="${story.photoUrl}" class="card-img-top" alt="${story.name}" loading="lazy">
              <div class="card-body">
                <h5 class="card-title">${story.name}</h5>
                <p class="card-text">${story.description}</p>
                <p class="story-date text-muted small">${new Date(story.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('story-list', StoryList);