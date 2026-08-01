import { html } from 'lit';
import { updateWhenLocaleChanges } from '@lit/localize';
import { getLocale, localeNames, setLocaleFromUrl } from '../localization';
import LitWithoutShadowDom from './base/lit-without-shadow-dom';

// Import allLocales secara dinamis
let allLocales: string[] = ['en', 'id'];
try {
  const codes = await import('../../generated/locale-codes');
  allLocales = codes.allLocales || ['en', 'id'];
} catch {
  console.warn('Locale codes not found, using defaults');
}

class LocalePicker extends LitWithoutShadowDom {
  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <select class="form-select w-auto m-auto" @change=${this._localeChanged}>
        ${allLocales.map((locale) => {
          return html`
            <option value=${locale} ?selected=${locale === getLocale()}>
              ${localeNames[locale] || locale}
            </option>
          `;
        })}
      </select>
    `;
  }

  private _localeChanged(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLocale = select.value;

    if (newLocale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLocale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
  }
}

customElements.define('locale-picker', LocalePicker);
