function Slider(element, period) {
  const slider = document.querySelector(element),
    list = slider.querySelector(".slider__list"),
    position = -100,
    dots = slider.querySelector(".slider__dots"),
    self = this;

  let selectedDot,
    isDisabled = false;

  self._duration = period;

  Object.defineProperty(self, "duration", {
    get() {
      return self._duration;
    },
    set(value) {
      self._duration = value;
    }
  });

  function highlight(item) {
    if (selectedDot) {
      selectedDot.classList.toggle("slider__dot_active");
    }

    selectedDot = item;
    selectedDot.classList.toggle("slider__dot_active");
  }

  highlight(dots.children[1]);

  function animate({duration = 250, timing, draw}) {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      const progress = timing(timeFraction);

      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        isDisabled = false;
      }
    });
  }

  function moveRight(multiplier, previous) {
    animate({
      duration: self._duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ ( progress * (multiplier * position) ) + (previous * position) }vw`;
      }
    });
  }

  function moveLeft(multiplier, previous) {
    animate({
      duration: self._duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ ( progress * (multiplier * position) ) + (previous * position) }vw`;
      }
    });
  }

  dots.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName !== "LI") return;

    if (target === selectedDot) return;

    if (isDisabled) return;

    isDisabled = true;

    const next = Array.from(dots.children).indexOf(target);
    const previous = Array.from(dots.children).indexOf(selectedDot);
    const multiplier = next - previous;

    if (multiplier > 0) {
      moveLeft(multiplier, previous);
    }
    if (multiplier < 0) {
      moveRight(multiplier, previous);
    }

    highlight(target);
  });
}