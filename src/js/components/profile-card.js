import { LitElement, html, css } from 'lit';

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
    
    let user = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        user = JSON.parse(userData);
      }
    } catch (e) {
      console.log('Error parsing user:', e);
    }

    
    const name = user?.name || 'Nana Kusnadi';
    const email = user?.email || 'nanakusnadi035@gmail.com';
    const photoUrl = 'images/IMG_20260720_190745.jpg'; 

    return html`
      <div class="profile-card">
        <img src="${photoUrl}" alt="${name}">
        <h2>${name}</h2>
        <p><strong>Frontend Engineering</strong></p>
        <p>${user ? 'Selamat datang kembali!' : 'Saya adalah pengembang web yang antusias dalam membangun aplikasi interaktif.'}</p>
        <p>📧 ${email}</p>
        <div>
          ${['JavaScript', 'Webpack', 'Lit', 'Bootstrap', 'Sass'].map(skill => html`<span class="skill-badge">${skill}</span>`)}
        </div>
      </div>
    `;
  }
}

customElements.define('profile-card', ProfileCard);