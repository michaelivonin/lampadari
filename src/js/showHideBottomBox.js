(function showHideBottomBox() {
  const bottomBox = document.querySelector(".bottom-box");
  const buttonOpenBox = bottomBox.querySelector(".bottom-box__button");

  buttonOpenBox.addEventListener("click", () => {
    buttonOpenBox.firstElementChild.classList.toggle("bottom-box__icon-arrow_down");
    bottomBox.classList.toggle("bottom-box_visible")
  });
})();