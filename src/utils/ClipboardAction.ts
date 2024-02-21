import select from 'select';

/**
 * Creates a fake textarea element, sets its value from `text` property,
 */
function createFakeElement(text: string) {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  const fakeElem = document.createElement('textarea');
  // Prevent zooming on iOS
  fakeElem.style.fontSize = '12pt';
  // Reset box model
  fakeElem.style.border = '0';
  fakeElem.style.padding = '0';
  fakeElem.style.margin = '0';
  // Move element out of screen horizontally
  fakeElem.style.position = 'absolute';
  fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
  // Move element to the same position vertically
  const yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElem.style.top = `${yPosition}px`;

  fakeElem.setAttribute('readonly', '');
  fakeElem.value = text;

  return fakeElem;
}

/**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */
class ClipboardAction {
  private container: HTMLElement;
  /**
   * @param container        （  document.body）
   */
  constructor(container?: HTMLElement) {
    this.container = container || document.body;
  }

  /**
   *   text
   * @param text
   * @returns
   */
  startCopyText(text: string) {
    return this.selectFake(text);
  }
  /**
   *        （  ）
   */
  private selectedText: string;
  private action = 'copy';

  private fakeHandlerCallback: () => void;
  /**
   * Get's the value of fakeElem,
   * and makes a selection on it.
   */
  private selectFake(text: string) {
    const fakeElem = createFakeElement(text);
    this.fakeElem = fakeElem;
    this.fakeHandlerCallback = () => this.removeFake();
    this.container.addEventListener('click', this.fakeHandlerCallback);

    this.container.appendChild(fakeElem);

    this.selectedText = select(fakeElem);

    const succeeded = this.copyText();

    this.removeFake();
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log(`copy ${succeeded ? 'success' : 'error'}`, this.selectedText);
    }
    return succeeded;
  }
  /**
   * Executes the copy operation based on the current selection.
   */
  private copyText() {
    let succeeded;
    try {
      succeeded = document.execCommand(this.action);
    } catch (err) {
      succeeded = false;
    }

    return succeeded;
  }
  private fakeElem: HTMLTextAreaElement;

  /**
   * Only removes the fake element after another click event, that way
   * a user can hit `Ctrl+C` to copy because selection still exists.
   */
  private removeFake() {
    if (this.fakeHandlerCallback) {
      this.container.removeEventListener('click', this.fakeHandlerCallback);
      this.fakeHandlerCallback = null;
    }

    if (this.fakeElem) {
      this.container.removeChild(this.fakeElem);
      this.fakeElem = null;
    }
  }
}

export default ClipboardAction;
