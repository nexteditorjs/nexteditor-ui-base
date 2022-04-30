import { CommandItem } from '@nexteditorjs/nexteditor-core';
import tippy, { Instance, Props, SingleTarget } from 'tippy.js';
import ToolbarBase from './toolbar-base';

export default class FloatingToolbar extends ToolbarBase {
  protected tippyInstance: Instance;

  constructor(items: CommandItem[], targets: SingleTarget, optionalProps?: Partial<Props>) {
    super(items);
    this.tippyInstance = tippy(targets, {
      ...optionalProps,
      interactive: true,
      content: this.root,
    });
  }
}
