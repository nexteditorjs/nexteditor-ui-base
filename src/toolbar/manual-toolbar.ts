import { CommandItem } from '@nexteditorjs/nexteditor-core';
import FloatingToolbar from './floating-toolbar';

export default class ManualToolbar extends FloatingToolbar {
  constructor(items: CommandItem[], public readonly parent: HTMLElement, hideOnClick = true) {
    super(items, parent, {
      trigger: 'manual',
      triggerTarget: null,
      hideOnClick,
    });
    this.root.classList.add('manual-toolbar');
  }

  show(elem: Element, items?: CommandItem[], rect?: DOMRect) {
    if (items) {
      this.setItems(items);
    }
    this.tippyInstance.setProps({
      triggerTarget: elem,
      getReferenceClientRect: () => {
        const refRect = rect ?? elem.getBoundingClientRect();
        // const editorRect = this.editor.rootElement.getBoundingClientRect();
        const left = refRect.left; // - editorRect.left;
        const top = refRect.top; // refRect.top - editorRect.top;
        return new DOMRect(left, top, refRect.width, refRect.height);
      },
    });
    if (!this.tippyInstance.state.isVisible) {
      this.tippyInstance.show();
    }
  }

  hide() {
    this.tippyInstance.hide();
  }
}
