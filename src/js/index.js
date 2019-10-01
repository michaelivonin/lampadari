"use strict";

let bottomBox = document.querySelector(".bottom-box");
let buttonOpenBox = bottomBox.querySelector(".bottom-box__button");

buttonOpenBox.addEventListener("click", () => {
  buttonOpenBox.firstElementChild.classList.toggle("bottom-box__icon-arrow_down");
  bottomBox.classList.toggle("bottom-box_visible")
});