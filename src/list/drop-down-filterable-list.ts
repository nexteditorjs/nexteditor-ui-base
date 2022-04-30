import { CommandItem } from '@nexteditorjs/nexteditor-core';
import tippy, { Instance } from 'tippy.js';
import FilterableList, { FilterableListOptions } from './filterable-list';

export default class DropdownFilterableList extends FilterableList {
  tippyInstance: Instance;

  onShow: ((list: DropdownFilterableList) => void) | null = null;

  onHide: ((list: DropdownFilterableList) => void) | null = null;

  custom: unknown | null = null;

  constructor(items: CommandItem[], parent: HTMLElement, options?: FilterableListOptions) {
    super(items, options);
    this.tippyInstance = tippy(parent, {
      interactive: true,
      content: this.root,
      trigger: 'manual',
      triggerTarget: null,
      hideOnClick: true,
      arrow: false,
      theme: 'dropdown-list',
      offset: [0, 0],
      onHide: this.handleHide,
      onShow: this.handleShow,
      onShown: this.handleShown,
    });
  }

  destroy(): void {
    super.destroy();
    this.onShow = null;
    this.onHide = null;
  }

  show(elem: HTMLElement) {
    this.tippyInstance.setProps({
      getReferenceClientRect: () => elem.getBoundingClientRect(),
    });

    this.reset();
    this.tippyInstance.show();
    this.focus();
  }

  protected handleShow = () => {
    if (this.onShow) {
      this.onShow(this);
    }
  };

  protected handleHide = () => {
    if (this.onHide) {
      this.onHide(this);
    }
  };

  protected handleShown = () => {
    this.focus();
  };

  protected processKeyDown(event: KeyboardEvent): void {
    super.processKeyDown(event);
    if (event.key === 'Esc' || event.key === 'Enter') {
      this.tippyInstance.hide();
    }
  }

  protected processClick(event: MouseEvent): void {
    super.processClick(event);
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const menuItem = target.closest('.menu-item');
    if (!menuItem) {
      return;
    }
    this.tippyInstance.hide();
  }
}
