import './toast.scss';

export type ToastOptions = {
  html: boolean;
  duration: number;
  theme: string;
  id: string;
  position: { x: number; y: number };
};

export function showToast(text: string, options?: Partial<ToastOptions>) {
  const toast = document.createElement('div');
  toast.classList.add('toast', 'show');
  //
  if (options?.theme) {
    toast.setAttribute('data-theme', options.theme);
  }
  //
  if (options?.id) {
    toast.setAttribute('data-id', options.id);
  }
  //
  if (options?.html) {
    toast.innerHTML = text;
  } else {
    toast.textContent = text;
  }
  //
  if (options?.position) {
    toast.style.left = `${options.position.x}px`;
    toast.style.top = `${options.position.y}px`;
    toast.classList.add('positioned');
  }
  //
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, options?.duration || 3000);
}
