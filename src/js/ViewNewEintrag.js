class ViewNewEintrag {
  #newEintragBtn = document.querySelector(".btn--new-eintrag");
  #abrechenBtn = document.querySelector(".new-eintrag__form .btn--abrechen");
  #newEintragEl = document.querySelector(".new-eintrag");
  #overlay = document.querySelector(".overlay-new");

  constructor() {
    this.#showNewEintragOverlay();
    this.#hiddenNewEintragOverlay();
  }

  getEintragDaten(e) {
    e.preventDefault();

    const eingabe = e.target[0].value.trim();
    this.#toggleEintragOverlay();

    return eingabe;
  }

  #showNewEintragOverlay() {
    this.#newEintragBtn.addEventListener("click", () =>
      this.#toggleEintragOverlay()
    );
  }

  #hiddenNewEintragOverlay() {
    [this.#abrechenBtn, this.#overlay].forEach(p_el => {
      p_el.addEventListener("click", () => this.#toggleEintragOverlay());
    });
  }

  #toggleEintragOverlay() {
    this.#newEintragEl.classList.toggle("new-eintrag--active");
    this.#overlay.classList.toggle("overlay-new--active");
  }
}

export default new ViewNewEintrag();
