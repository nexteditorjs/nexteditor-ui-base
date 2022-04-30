import { CommandItem } from '@nexteditorjs/nexteditor-core';
import tippy, { Instance } from 'tippy.js';
import { createMenu } from './menu-dom';

export default class Menu {
  tippyInstance: Instance;

  menu: HTMLElement;

  constructor(items: CommandItem[], parent: HTMLElement) {
    this.menu = createMenu(items);
    this.tippyInstance = tippy(parent, {
      interactive: true,
      content: this.menu,
      trigger: 'manual',
      triggerTarget: null,
      hideOnClick: true,
    });
  }

  show(x: number, y: number) {
    this.tippyInstance.setProps({
      getReferenceClientRect: () => new DOMRect(x, y, 0, 0),
    });

    this.tippyInstance.show();
  }
}
