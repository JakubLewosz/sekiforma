const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const compact = window.matchMedia('(max-width: 799px)');
type Reveal = {
  element: HTMLElement;
  image?: HTMLImageElement;
  delay: number;
  animations: Animation[];
  ready?: Promise<void>;
  starting: boolean;
};
const reveals = new Map<HTMLElement, Reveal>();
let entranceObserver: IntersectionObserver | undefined;
let imageObserver: IntersectionObserver | undefined;

function finish(reveal: Reveal) {
  reveal.element.dataset.revealState = 'done';
  reveal.element.dataset.revealDone = 'true';
  entranceObserver?.unobserve(reveal.element);
  imageObserver?.unobserve(reveal.element);
  reveal.animations.forEach((animation) => animation.cancel());
  reveal.animations = [];
}

function prepareImage(reveal: Reveal) {
  if (!reveal.image) return Promise.resolve();
  if (!reveal.ready) {
    reveal.image.loading = 'eager';
    // Decode the responsive image before revealing it. A failed image still
    // releases the entrance state so content cannot remain hidden forever.
    const image = reveal.image;
    reveal.ready = (async () => {
      if (!image.decode) return;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          await image.decode();
          return;
        } catch {
          if (image.complete) return;
          // Changing the responsive source can interrupt decode(). Wait for
          // the selected image before retrying, rather than revealing early.
          await new Promise<void>((resolve) => {
            const loaded = () => {
              image.removeEventListener('load', loaded);
              image.removeEventListener('error', loaded);
              resolve();
            };
            image.addEventListener('load', loaded, { once: true });
            image.addEventListener('error', loaded, { once: true });
            if (image.complete) loaded();
          });
        }
      }
    })();
  }
  return reveal.ready;
}

async function enter(reveal: Reveal) {
  const { element, image } = reveal;
  if (element.dataset.revealState !== 'pending' || reveal.starting) return;
  reveal.starting = true;
  entranceObserver?.unobserve(element);
  await prepareImage(reveal);
  if (element.dataset.revealState !== 'pending') return;
  if (preference.matches || element.contains(document.activeElement)) {
    finish(reveal);
    return;
  }
  const mobile = compact.matches;
  const duration = image ? (mobile ? 560 : 760) : mobile ? 440 : 620;
  const timing: KeyframeAnimationOptions = {
    duration,
    easing: 'cubic-bezier(.16, 1, .3, 1)',
    fill: 'both',
    delay: image ? 0 : reveal.delay,
  };
  // The pending styles were set below the viewport. Installing the animation
  // before removing them keeps the first painted frame continuous.
  reveal.animations = [
    element.animate(
      [
        {
          opacity: image ? 1 : 0,
          transform: `translateY(${image ? (mobile ? 14 : 22) : mobile ? 12 : 18}px)`,
        },
        { opacity: 1, transform: 'none' },
      ],
      timing,
    ),
  ];
  if (image)
    reveal.animations.push(
      image.animate(
        [
          { opacity: 0, transform: 'scale(1.045)' },
          { opacity: 1, transform: 'none' },
        ],
        timing,
      ),
    );
  element.dataset.revealState = 'running';
  await Promise.all(
    reveal.animations.map((animation) => animation.finished.catch(() => {})),
  );
  finish(reveal);
}

function initialize() {
  if (
    preference.matches ||
    !('IntersectionObserver' in window) ||
    !Element.prototype.animate
  )
    return;
  entranceObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const reveal = reveals.get(entry.target as HTMLElement);
        if (reveal) void enter(reveal);
      }),
    { rootMargin: '0px 0px 80px 0px', threshold: 0 },
  );
  imageObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const reveal = reveals.get(entry.target as HTMLElement);
        if (reveal) void prepareImage(reveal);
        imageObserver?.unobserve(entry.target);
      }),
    { rootMargin: '800px 0px', threshold: 0 },
  );
  const visualSelectors = [
    '.project-image-link',
    '.gallery-trigger',
    '.service-photo',
    '.studio-visual',
    '.material-panel:first-child .material-panel-visual',
  ];
  const textSelectors = [
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
  for (const [kind, selectors] of [
    ['visual', visualSelectors],
    ['text', textSelectors],
  ] as const) {
    document
      .querySelectorAll<HTMLElement>(selectors.join(','))
      .forEach((element) => {
        if (reveals.has(element) || element.dataset.revealDone) return;
        const bounds = element.getBoundingClientRect();
        const siblings = element.parentElement;
        const stagger = siblings?.matches(
          '.process-grid, .service-list, .values-grid',
        )
          ? Math.min(Array.from(siblings.children).indexOf(element), 3) *
            (compact.matches ? 45 : 65)
          : 0;
        const reveal: Reveal = {
          element,
          image:
            kind === 'visual'
              ? (element.querySelector<HTMLImageElement>('img') ?? undefined)
              : undefined,
          delay: stagger,
          animations: [],
          starting: false,
        };
        reveals.set(element, reveal);
        element.dataset.reveal = kind;
        // Never turn already-painted, visible content transparent. This also
        // covers late scripts, reloads halfway down the page and direct anchors.
        if (
          bounds.width === 0 ||
          bounds.height === 0 ||
          bounds.top < innerHeight + 24 ||
          element.contains(document.activeElement)
        ) {
          finish(reveal);
          return;
        }
        element.dataset.revealState = 'pending';
        entranceObserver?.observe(element);
        if (reveal.image) imageObserver?.observe(element);
      });
  }
}

preference.addEventListener('change', () => {
  if (preference.matches) {
    entranceObserver?.disconnect();
    imageObserver?.disconnect();
    reveals.forEach(finish);
  } else initialize();
});
document.addEventListener('focusin', (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  const element = event.target.closest<HTMLElement>('[data-reveal]');
  const reveal = element && reveals.get(element);
  if (reveal) finish(reveal);
});
// A shared photograph must be fully visible in a native navigation snapshot.
window.addEventListener('pageswap', () => {
  reveals.forEach((reveal) => {
    if (reveal.element.dataset.revealState === 'running') finish(reveal);
  });
});
initialize();
