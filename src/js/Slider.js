function Slider(element, period) {
  const slider = document.querySelector(element),
    list = slider.querySelector(".slider__list"),
    slides = list.querySelectorAll(".slider__item"),
    slideWidth = parseInt(getComputedStyle(slider.querySelector(".slider__item")).width),
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

  (function rebuildSlides() {
    list.append(slides[0].cloneNode(true));
    list.prepend(slides[slides.length - 1].cloneNode(true));
  })();

  /*function rebuildEdge() {
    const slidesRebuilt = list.querySelectorAll(".slider__item");
    const position = parseInt(getComputedStyle(list).marginLeft);

    if ( position > ( (slidesRebuilt.length - 1) * (-slideWidth) ) && position < 0 || position < 0 && position > 0 ) {

      return;

    } else if ( position === ( (slidesRebuilt.length - 1) * (-slideWidth) ) ) {

      list.style.marginLeft = `${ (-slideWidth) }px`;

      while (list.children.length !== 2) {
        list.firstElementChild.remove();
      }

      for (let i = 2; i < slidesRebuilt.length; i++) {
        list.append(slidesRebuilt[i].cloneNode(true));
      }

    } else {

      list.style.marginLeft = `${ (slidesRebuilt.length - 2) * (-slideWidth) }px`;

      while (list.children.length !== 2) {
        list.lastElementChild.remove();
      }

      for (let i = slidesRebuilt.length - 3; i >= 0; i--) {
        list.prepend(slidesRebuilt[i].cloneNode(true));
      }

    }
  }*/

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
        //rebuildEdge();
      }
    });
  }

  function moveRight({offset = slideWidth}) {
    const position = parseInt(getComputedStyle(list).marginLeft);

    animate({
      duration: self._duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ (progress * offset) + position }px`;
      }
    });
  }

  function moveLeft({offset = slideWidth}) {
    const position = parseInt(getComputedStyle(list).marginLeft);

    animate({
      duration: self._duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ ( progress * (-offset) ) + position }px`;
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
    let multiplier;

    if (next > previous) {
      multiplier = (next - previous) * slideWidth;
      moveLeft({offset: multiplier});
    }
    if (next < previous) {
      multiplier = (previous - next) * slideWidth;
      moveRight({offset: multiplier});
    }

    highlight(target);
  });
}