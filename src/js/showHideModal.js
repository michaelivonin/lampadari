(function showHideModal() {
  const trigger = document.querySelector(".trigger");
  const modal = document.querySelector(".modal-bg");
  const close = modal.querySelector(".modal__close");

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.toggle("modal-bg_open")
  });

  modal.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target === modal) {
      modal.classList.toggle("modal-bg_open")
    }
  });

  close.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.toggle("modal-bg_open")
  });
})();