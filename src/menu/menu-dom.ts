import { CommandItem, createElement } from '@nexteditorjs/nexteditor-core';
import { createSeparator } from '../components/button';

export function createMenuItem(id: string, name: string, icon?: string, states?: string[]) {
  const menuItem = createElement('div', ['menu-item'], null);
  const menuItemIcon = createElement('div', ['menu-item-icon'], null);
  if (icon) {
    menuItemIcon.innerHTML = icon;
  }
  menuItem.appendChild(menuItemIcon);
  const menuItemName = createElement('div', ['menu-item-name'], null, name);
  menuItem.appendChild(menuItemName);
  //
  if (states?.includes('selected')) {
    menuItem.classList.add('selected');
  }
  //
  menuItem.setAttribute('data-id', id);
  //
  return menuItem;
}

export function createMenu(items: CommandItem[]) {
  const menu = createElement('div', ['editor-menu'], null);
  items.forEach((item) => {
    if (item.type === 'separator') {
      const separator = createSeparator('horizontal');
      menu.append(separator);
    } else {
      const menuItem = createMenuItem(item.id, item.name, item.icon, item.states);
      menu.appendChild(menuItem);
    }
  });
  return menu;
}
