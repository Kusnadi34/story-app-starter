import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { allLocales } from '../../generated/locale-codes';
import { getLocale, localeNames, setLocaleFromUrl } from '../localization';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

@customElement('locale-picker')
export class LocalePicker extends LitElement {
  // ✅ Mematikan Shadow DOM agar styling dari luar bisa masuk
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <label for="change-language">${msg('Select preferred language')}</label>
      <select id="change-language" @change=${this._localeChanged}>
        ${allLocales.map((locale) => {
          return html`
            <option value=${locale} ?selected=${locale === getLocale()}>
              ${localeNames[locale]}
            </option>
          `;
        })}
      </select>
    `;
  }

  _localeChanged(event: Event) {
    const element = event.target as HTMLSelectElement;
    const newLocale = element.value;

    if (newLocale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLocale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
  }
}
