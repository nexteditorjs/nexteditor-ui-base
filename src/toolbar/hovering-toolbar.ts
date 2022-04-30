import { CommandItem } from '@nexteditorjs/nexteditor-core';
import { GetReferenceClientRect } from 'tippy.js';
import FloatingToolbar from './floating-toolbar';

export default class HoveringToolbar extends FloatingToolbar {
  constructor(items: CommandItem[], public readonly triggerElement: HTMLElement, getReferenceClientRect?: null | GetReferenceClientRect) {
    super(items, triggerElement, {
      getReferenceClientRect,
    });
    this.root.classList.add('hovering-toolbar');
  }
}
