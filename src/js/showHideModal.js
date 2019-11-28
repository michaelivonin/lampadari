function showHideModal() {
  const body = document.body;
  const trigger = body.querySelector(".trigger");
  const modal = body.querySelector(".modal-bg");
  const close = modal.querySelector(".modal__close");

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.toggle("modal-bg_open");
    body.classList.toggle("body_fixed");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.toggle("modal-bg_open");
      body.classList.toggle("body_fixed");
    }
  });

  close.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.toggle("modal-bg_open");
    body.classList.toggle("body_fixed");
  });
}

export default showHideModal;