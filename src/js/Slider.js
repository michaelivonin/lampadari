function Slider(element, duration, DisplayedSlide) {
  const slider = document.querySelector(element),
    list = slider.querySelector(".slider__list"),
    slideWidth = -100,
    dots = slider.querySelector(".slider__dots");

  let selectedDot,
    isDisabled = false;

  list.style.marginLeft = `${ (DisplayedSlide - 1) * slideWidth }vw`;

  function highlight(item) {
    if (selectedDot) {
      selectedDot.classList.toggle("slider__dot_active");
    }

    selectedDot = item;
    selectedDot.classList.toggle("slider__dot_active");
  }

  highlight(dots.children[DisplayedSlide - 1]);

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
      duration: duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ ( progress * (multiplier * slideWidth) ) + (previous * slideWidth) }vw`;
      }
    });
  }

  function moveLeft(multiplier, previous) {
    animate({
      duration: duration,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        list.style.marginLeft = `${ ( progress * (multiplier * slideWidth) ) + (previous * slideWidth) }vw`;
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