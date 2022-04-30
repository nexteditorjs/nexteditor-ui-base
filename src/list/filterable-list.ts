import { assert, CommandItem, createElement, getLogger, patchNode } from '@nexteditorjs/nexteditor-core';
import { createMenu } from '../menu/menu-dom';

const logger = getLogger('filterable-list');

export type FilterableListOptions = {
  placeholder?: string,
  initialSelectedId?: string,
};

function buildMenuItems(items: CommandItem[], selectedId?: string) {
  let menuItems = items;
  if (selectedId) {
    menuItems = items.map((item) => ({
      ...item,
      states: item.id === selectedId ? ['selected'] : undefined,
    }));
  }
  return menuItems;
}

function createFilterableList(items: CommandItem[], options?: FilterableListOptions) {
  const root = createElement('div', ['filterable-list'], null);
  const filterRoot = createElement('div', ['filter'], root);
  const filterContainer = createElement('div', ['filter-container'], filterRoot);
  const filterInput = createElement('input', ['filter-input'], filterContainer);
  if (options && options.placeholder) {
    filterInput.placeholder = options.placeholder;
  }
  const listRoot = createElement('div', ['list'], root);
  const menu = createMenu(buildMenuItems(items, options?.initialSelectedId));
  listRoot.appendChild(menu);
  return root;
}

function updateFilterableList(root: HTMLElement, items: CommandItem[], selectedId?: string) {
  const listRoot = root.querySelector('.list');
  assert(logger, listRoot, 'no list root');
  const menu = createMenu(buildMenuItems(items, selectedId));
  const exists = listRoot.querySelector('.editor-menu') as HTMLElement;
  assert(logger, exists, 'no exists menu');
  patchNode(exists, menu);
  if (selectedId) {
    const selectedMenuItem = listRoot.querySelector('.menu-item.selected');
    if (selectedMenuItem) {
      assert(logger, selectedMenuItem, 'no selected menu item');
      selectedMenuItem.scrollIntoView({ block: 'nearest' });
    }
  }
}

export default class FilterableList {
  public root: HTMLElement;

  private visibleItems: CommandItem[];

  private selectedId: string;

  private filter = '';

  public onSelected: ((list: FilterableList, item: CommandItem | null) => void) | null = null;

  constructor(private items: CommandItem[], protected options?: FilterableListOptions) {
    this.root = createFilterableList(items, options);
    this.bindEvents();
    this.selectedId = options?.initialSelectedId ?? '';
    this.visibleItems = items;
  }

  private bindEvents() {
    const input = this.root.querySelector('.filter-input') as HTMLInputElement;
    assert(logger, input, 'no input');
    input.addEventListener('keyup', this.handleInputChanged);
    input.addEventListener('keydown', this.handleKeydown);
    this.root.addEventListener('click', this.handleClick);
  }

  private unbindEvents() {
    const input = this.root.querySelector('.filter-input') as HTMLInputElement;
    assert(logger, input, 'no input');
    input.removeEventListener('keyup', this.handleInputChanged);
    input.removeEventListener('keydown', this.handleKeydown);
    this.root.removeEventListener('click', this.handleClick);
  }

  destroy() {
    this.unbindEvents();
    this.onSelected = null;
  }

  getSelectedIndex() {
    if (!this.selectedId) {
      return -1;
    }
    return this.visibleItems.findIndex((item) => item.id === this.selectedId);
  }

  setSelectedId(id: string) {
    this.selectedId = id;
    updateFilterableList(this.root, this.visibleItems, id);
  }

  focus() {
    const input = this.root.querySelector('.filter-input') as HTMLInputElement;
    assert(logger, input, 'no input');
    input.focus();
  }

  reset() {
    this.setFilter('');
    const input = this.root.querySelector('.filter-input') as HTMLInputElement;
    assert(logger, input, 'no input');
    input.value = '';
  }

  protected handleKeydown = (event: KeyboardEvent) => {
    this.processKeyDown(event);
  };

  protected handleInputChanged = () => {
    const input = this.root.querySelector('.filter-input') as HTMLInputElement;
    assert(logger, input, 'no input');
    const value = input.value.toLocaleLowerCase();
    this.setFilter(value);
  };

  protected setFilter(filter: string) {
    if (this.filter === filter) {
      return;
    }
    this.filter = filter;
    this.visibleItems = this.items.filter((item) => item.name.toLocaleLowerCase().includes(filter));
    updateFilterableList(this.root, this.visibleItems, this.selectedId);
  }

  protected handleClick = (event: MouseEvent) => {
    this.processClick(event);
  };

  protected processClick(event: MouseEvent) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const menuItem = target.closest('.menu-item');
    if (!menuItem) {
      return;
    }

    const selectedId = menuItem.getAttribute('data-id') ?? '';
    const item = this.visibleItems.find((item) => item.id === selectedId) ?? null;
    if (this.onSelected) {
      this.onSelected(this, item);
    }
  }

  protected processKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      let index = this.getSelectedIndex();
      if (index === -1) {
        index = this.visibleItems.length - 1;
      } else if (index > 0) {
        index -= 1;
      }
      //
      let selectedId = '';
      if (index !== -1) {
        selectedId = this.visibleItems[index].id;
      }
      this.setSelectedId(selectedId);
      return;
    }
    if (event.key === 'ArrowDown') {
      let index = this.getSelectedIndex();
      if (index === -1) {
        index = 0;
      } else if (index < this.visibleItems.length - 1) {
        index += 1;
      }
      //
      let selectedId = '';
      if (index !== -1) {
        selectedId = this.visibleItems[index].id;
      }
      this.setSelectedId(selectedId);
      return;
    }
    //
    if (event.key === 'Enter') {
      const item = this.visibleItems.find((item) => item.id === this.selectedId) ?? null;
      if (this.onSelected) {
        this.onSelected(this, item);
      }
    }
  }
}
