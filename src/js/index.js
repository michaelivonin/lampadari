document.addEventListener("DOMContentLoaded", () => {
  /* Polyfill the append() */
  //= polyfillAppend.js

  /* Polyfill the prepend() */
  //= polyfillPrepend.js

  /* Polyfill the from() */
  //= polyfillFrom.js

  /* Slider */
  //= Slider.js
  let carousel = new Slider(".slider");
  carousel.duration = 500;

  /* Bottom box */
  //= showHideBottomBox.js
});