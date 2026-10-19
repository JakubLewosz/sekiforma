const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = window.matchMedia('(max-width: 799px)');
const animations = new Map<HTMLElement, Animation>();
let observer: IntersectionObserver | undefined;

// Nothing is hidden in the stylesheet: the document stays fully readable
// without JavaScript, before initialization and when motion is disabled.
const groups = [
  '.projects-grid',
  '.process-grid',
  '.service-list',
  '.values-grid',
];
for (const selector of groups) {
  document.querySelectorAll(selector).forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return;
      child.dataset.reveal = '';
      child.dataset.revealDelay = String(Math.min(index, 3) * 85);
    });
  });
}
const selectors = [
  '.section-heading',
  '.offer-grid > div:first-child',
  '.material-visual',
  '.material-copy',
  '.faq-grid > div',
  '.invitation-inner > div',
  '.service-block > div',
  '.studio-intro > *',
  '.project-story > div',
  '.gallery > figure',
];
for (const selector of selectors) {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.dataset.reveal = '';
  });
}

function reveal(element: HTMLElement) {
  if (element.dataset.revealDone) return;
  element.dataset.revealDone = 'true';
  observer?.unobserve(element);
  if (preference.matches || element.contains(document.activeElement)) return;
  const delay =
    Number(element.dataset.revealDelay ?? 0) * (compact.matches ? 0.65 : 1);
  const animation = element.animate(
    [
      {
        opacity: 0,
        transform: `translate3d(0, ${compact.matches ? 12 : 20}px, 0)`,
      },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ],
    {
      duration: compact.matches ? 460 : 620,
      delay,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
      fill: 'both',
    },
  );
  animations.set(element, animation);
  const cleanup = () => {
    if (animations.get(element) === animation) animations.delete(element);
    // Release the compositor layer and the transform after the effect finishes.
    animation.cancel();
  };
  animation.finished.then(cleanup, () => animations.delete(element));
}

function observe() {
  observer?.disconnect();
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement)
          reveal(entry.target);
      }),
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );
  document
    .querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-done])')
    .forEach((element) => observer?.observe(element));
}

preference.addEventListener('change', () => {
  if (preference.matches) {
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  } else observe();
});
document.addEventListener('focusin', (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  const element = event.target.closest<HTMLElement>('[data-reveal]');
  if (!element) return;
  animations.get(element)?.cancel();
  animations.delete(element);
  element.dataset.revealDone = 'true';
  observer?.unobserve(element);
});
observe();
