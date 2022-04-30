/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import { assert, CommandItem, getLogger } from '@nexteditorjs/nexteditor-core';

import './app.css';
import { Menu, DropdownFilterableList, FixedToolbar, HoveringToolbar, ManualToolbar, showToast } from '.';

const logger = getLogger('main');

const buttonManualToolbar = document.getElementById('manual-toolbar');
const buttonHoveringToolbar = document.getElementById('hovering-toolbar');
const fixedToolbarContainer = document.getElementById('fixed-toolbar');
const menuButton = document.getElementById('menu');
const filterableListButton = document.getElementById('filterable-list');
const toastButton = document.getElementById('toast');

assert(logger, buttonManualToolbar, 'no toolbar button');
assert(logger, buttonHoveringToolbar, 'no toolbar button');
assert(logger, fixedToolbarContainer, 'no toolbar button');
assert(logger, menuButton, 'no menu button');
assert(logger, filterableListButton, 'no filterable list button');
assert(logger, toastButton, 'no toast button');

const toolbarItems: CommandItem[] = [
  { id: 'bold', name: 'Bold' },
  { id: 'italic', name: 'Italic' },
  { id: 'underline', name: 'Underline' },
];

const manualToolbar = new ManualToolbar(toolbarItems, buttonManualToolbar);

buttonManualToolbar.onclick = () => {
  manualToolbar.show(buttonManualToolbar, toolbarItems);
};

new HoveringToolbar(toolbarItems, buttonHoveringToolbar);

new FixedToolbar(toolbarItems, fixedToolbarContainer);

const menu = new Menu(toolbarItems, menuButton);

menuButton.onclick = (event) => {
  menu.show(event.clientX, event.clientY);
};

const filterableItems = [];
for (let i = 0; i < 100; i++) {
  filterableItems.push({
    id: `${i}`,
    name: `Item ${i}`,
  });
}

const filterableList = new DropdownFilterableList(filterableItems, filterableListButton, { initialSelectedId: '13', placeholder: 'Search item...' });

filterableList.onSelected = (list, item) => {
  logger.info(`Selected item: ${item?.name}`);
};

filterableListButton.onclick = () => {
  filterableList.show(filterableListButton);
};

toastButton.onclick = () => {
  const rect = toastButton.getBoundingClientRect();
  showToast('Hello world!', {
    html: true,
    duration: 3000,
    theme: 'success',
    id: 'toast-id',
    position: {
      x: rect.x + 125,
      y: rect.bottom + 30,
    },
  });
};
