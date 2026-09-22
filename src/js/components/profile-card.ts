import { LitElement, html } from 'lit'; // 'css' tidak diperlukan lagi
import { customElement } from 'lit/decorators.js';
import { msg, str, updateWhenLocaleChanges } from '@lit/localize';
import { getUserName } from '../services/authService';

@customElement('profile-card')
export class ProfileCard extends LitElement {
  // ✅ Tetap nonaktifkan Shadow DOM agar styling dari _profile.scss bisa masuk
  createRenderRoot() {
    return this;
  }

  // ❌ Hapus static styles karena kita menggunakan SCSS global

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    const name = getUserName() || 'Nana Kusnadi';
    const photoUrl = 'images/IMG_20260720_190745.jpg';

    return html`
      <div class="profile-page">
        <div class="profile-container">
          <img src="${photoUrl}" alt="${name}" class="profile-avatar">
          <h3>${name}</h3>
          <p class="profile-title">${msg('Frontend Engineering')}</p>
          <p class="profile-bio">${msg(str`Welcome back, ${name}!`)}</p>
          <div class="profile-detail">
            <span>📧 nanakusnadi035@gmail.com</span>
          </div>
          <div>
            ${['JavaScript', 'Webpack', 'Lit', 'Bootstrap'].map(skill => html`
              <span class="skill-badge">${skill}</span>
            `)}
          </div>
        </div>
      </div>
    `;
  }
}
