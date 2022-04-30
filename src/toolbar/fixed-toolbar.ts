import { CommandItem } from '@nexteditorjs/nexteditor-core';
import ToolbarBase from './toolbar-base';

export default class FixedToolbar extends ToolbarBase {
  constructor(items: CommandItem[], parent: HTMLElement) {
    super(items);
    parent.appendChild(this.root);
    this.root.classList.add('fixed-toolbar');
  }
}
