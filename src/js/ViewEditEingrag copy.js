export default class ViewEditEintrag {
  #overlay = document.querySelector(".overlay-edit");
  #viewList = document.querySelector(".eintragsliste");
  #aktivForm;

  constructor() {
    this.#hiddenEdit();
    this.#editView();
  }

  edit(e, p_form) {
    e.preventDefault();

    const editValue = p_form.firstElementChild.value.trim();
    const eintragId =
      p_form.parentElement.previousElementSibling.getAttribute("data-id");

    this.#toggleEditOverlay();

    //? Schutzklausel
    if (!p_form || !editValue) return;

    this.#editElement(editValue, eintragId);
    p_form.reset();

    return document.querySelector(`[data-id="${eintragId}"]`).parentElement;
  }

  #editElement(p_value, p_id) {
    const el = document.querySelector(
      `[data-id="${p_id}"] .eintragsliste__eintrag-content`
    );
    el.textContent = p_value;
  }

  #editView() {
    this.#viewList.addEventListener("click", e => {
      const editBtn = e.target.closest(".btn--edit");

      //? Schutzklausel
      if (!editBtn) return;

      const editEl = e.target.closest(".eintragsliste__item").lastElementChild;

      this.#aktivForm = editEl;
      this.#toggleEditOverlay();
    });
  }

  #hiddenEdit() {
    this.#overlay.addEventListener("click", () => {
      this.#toggleEditOverlay();
    });

    this.#viewList.addEventListener("click", e => {
      const abrechenBtn = e.target.closest(
        ".edit-eintrag__form .btn--abrechen"
      );

      //? Schutzklausel
      if (!abrechenBtn) return;

      this.#toggleEditOverlay();
    });
  }

  #toggleEditOverlay() {
    this.#aktivForm.classList.toggle("edit-eintrag--active");
    this.#overlay.classList.toggle("overlay-edit--active");
  }
}
