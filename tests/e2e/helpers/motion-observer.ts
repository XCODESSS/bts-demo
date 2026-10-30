import type { Page } from "@playwright/test";

export type MotionFrame = {
  names: string[];
  pseudoElements: string[];
  viewTransitionDurations: number[];
  headerTop: number | null;
  scrollY: number;
  target: { height: number; opacity: number; transform: string } | null;
  bottleTransform: string | null;
};

/** Observe real browser animations; never patch navigation or manufacture motion. */
export async function startMotionObservation(page: Page, options: {
  targetSelector?: string;
  bottleName?: string;
} = {}) {
  await page.evaluate(({ targetSelector, bottleName }) => {
    const previous = Reflect.get(window, "__btsMotionRaf");
    if (typeof previous === "number") cancelAnimationFrame(previous);
    const frames: MotionFrame[] = [];
    Reflect.set(window, "__btsMotionFrames", frames);
    function sample() {
      const animations = document.getAnimations();
      const element = targetSelector ? document.querySelector(targetSelector) : null;
      const style = element ? getComputedStyle(element) : null;
      frames.push({
        names: animations.flatMap(animation => animation instanceof CSSAnimation ? [animation.animationName] : []),
        pseudoElements: animations.flatMap(animation =>
          animation.effect instanceof KeyframeEffect && animation.effect.pseudoElement ? [animation.effect.pseudoElement] : []),
        viewTransitionDurations: animations.flatMap(animation => {
          const effect = animation.effect;
          if (!(effect instanceof KeyframeEffect) || !effect.pseudoElement?.startsWith("::view-transition")) return [];
          const duration = effect.getComputedTiming().duration;
          return typeof duration === "number" ? [duration] : [];
        }),
        headerTop: document.querySelector("header")?.getBoundingClientRect().top ?? null,
        scrollY: window.scrollY,
        target: element && style ? {
          height: element.getBoundingClientRect().height,
          opacity: Number(style.opacity), transform: style.transform,
        } : null,
        bottleTransform: bottleName ? getComputedStyle(document.documentElement, `::view-transition-group(${bottleName})`).transform : null,
      });
      if (frames.length < 180) Reflect.set(window, "__btsMotionRaf", requestAnimationFrame(sample));
    }
    sample();
  }, options);
}

export async function readMotionObservation(page: Page): Promise<MotionFrame[]> {
  return page.evaluate(() => Reflect.get(window, "__btsMotionFrames") ?? []);
}
