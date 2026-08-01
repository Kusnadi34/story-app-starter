import { LitElement } from 'lit';

export default class LitWithoutShadowDom extends LitElement {
  createRenderRoot() {
    return this;
  }
}
