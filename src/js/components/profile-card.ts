import { LitElement, html, css } from 'lit';
import { getUserName } from '../services/authService';

class ProfileCard extends LitElement {
  static styles = css`
    .profile-card {
      text-align: center;
      padding: 20px;
      background: #fffbeb;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .profile-card img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #d97706;
    }
    .profile-card h2 { color: #78350f; }
    .skill-badge {
      display: inline-block;
      background: #d97706;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      margin: 4px;
      font-size: 14px;
    }
  `;

  render() {
    const name = getUserName() || 'Nana Kusnadi';
    const photoUrl = 'images/IMG_20260720_190745.jpg';

    return html`
      <div class="profile-card">
        <img src="${photoUrl}" alt="${name}">
        <h2>${name}</h2>
        <p><strong>Frontend Engineering</strong></p>
        <p>Selamat datang kembali, ${name}!</p>
        <p>📧 nanakusnadi035@gmail.com</p>
        <div>
          ${['JavaScript', 'Webpack', 'Lit', 'Bootstrap', 'Sass'].map(skill => html`<span class="skill-badge">${skill}</span>`)}
        </div>
      </div>
    `;
  }
}

customElements.define('profile-card', ProfileCard);
