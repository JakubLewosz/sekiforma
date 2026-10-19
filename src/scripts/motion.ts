const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = window.matchMedia('(max-width: 799px)');
const animations = new Map<HTMLElement, Animation>();
let observer: IntersectionObserver | undefined;

// Photographs and their containers stay in the normal scroll layer. Only
// text gets a small movement, with full opacity throughout the animation.
const selectors = [
  '.project-meta',
  '.process-grid > *',
  '.service-list > *',
  '.values-grid > *',
  '.section-heading',
  '.offer-grid > div:first-child',
  '.material-controls',
  '.material-panel-copy',
  '.faq-grid > div',
  '.invitation-inner > div',
  '.service-description',
  '.studio-intro > div',
  '.project-story > div',
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
  // Start just below the viewport. A fast scroll or restored position must
  // never reset content that has already become visible.
  if (
    preference.matches ||
    element.contains(document.activeElement) ||
    element.getBoundingClientRect().top < window.innerHeight
  )
    return;
  const animation = element.animate(
    [
      { transform: `translateY(${compact.matches ? 6 : 8}px)` },
      { transform: 'none' },
    ],
    {
      duration: compact.matches ? 240 : 320,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
    },
  );
  animations.set(element, animation);
  const cleanup = () => {
    if (animations.get(element) === animation) animations.delete(element);
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
    { threshold: 0, rootMargin: '0px 0px 120px 0px' },
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
