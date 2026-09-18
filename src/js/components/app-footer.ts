import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './locale-picker';

@customElement('app-footer')
export class AppFooter extends LitElement {
  static styles = css`
    .footer {
      background-color: #b45309;
      color: white;
      padding: 1.5rem 0;
      text-align: center;
      margin-top: 3rem;
      box-shadow: 0 -4px 20px rgba(69, 26, 3, 0.08);
      border-top: 4px solid #f59e0b;
    }
    .container-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer p {
      margin: 0;
      font-size: 1rem;
      letter-spacing: 0.3px;
      opacity: 0.95;
    }
    .footer .heart {
      color: #fcd34d;
    }
  `;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <footer class="footer">
        <div class="container-inner">
          <locale-picker class="d-block mb-3"></locale-picker>
          <p>${msg('Created with')} <span class="heart">❤️</span></p>
        </div>
      </footer>
    `;
  }
}
