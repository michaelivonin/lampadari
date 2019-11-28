import showHideModal from "./showHideModal";
import Slider from "./Slider";
import showHideBottomBox from "./showHideBottomBox";

document.addEventListener("DOMContentLoaded", () => {
  showHideModal();

  const carousel = new Slider(".slider", 500, 2);

  showHideBottomBox();
});