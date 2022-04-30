import { assert, CommandItem, createElement, getLogger } from '@nexteditorjs/nexteditor-core';
import { getButtonId, getParentButton } from '../components/button';
import { createToolbar } from './toolbar-dom';

import 'tippy.js/dist/tippy.css';

const logger = getLogger('toolbar-base');

export default class ToolbarBase {
  public onclick: ((toolbar: ToolbarBase, item: CommandItem) => void) | null = null;

  protected root: HTMLElement;

  constructor(protected items: CommandItem[]) {
    this.root = createElement('div', ['toolbar-root'], null);
    const toolbar = createToolbar(items);
    this.root.appendChild(toolbar);
  }

  destroy() {
    this.onclick = null;
    this.unbindEvents();
  }

  handleToolbarClick = (event: Event) => {
    if (!event.target) return;
    const button = getParentButton(event.target);
    if (button && this.onclick) {
      const buttonId = getButtonId(button);
      const item = this.items.find((item) => item.id === buttonId);
      assert(logger, item, 'failed to find button in items');
      this.onclick(this, item);
    }
  };

  bindEvents() {
    this.root.addEventListener('click', this.handleToolbarClick);
  }

  unbindEvents() {
    this.root.removeEventListener('click', this.handleToolbarClick);
  }

  setItems(items: CommandItem[]) {
    this.items = items;
    const toolbar = createToolbar(items);
    this.root.innerHTML = '';
    this.root.append(toolbar);
  }
}
