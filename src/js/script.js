import icons from "url:../img/sprite.svg";
import ViewNewEintrag from "./ViewNewEintrag.js";
import Eintrag from "./Eintrag.js";
import DragAndDropList from "./DragAndDropList.js";
import ViewEditEintrag from "./ViewEditEingrag.js";
import LocalStorage from "./LocalStorage.js";

class Application {
  #listEl = document.querySelector(".eintragsliste");
  #datum = document.querySelector(".datum");
  #formNewEintrag = document.querySelector(".new-eintrag__form");
  #savedEintraege = LocalStorage.getItems();
  // {
  //   1678554058797: {
  //     content: "Hausaufgaben machen",
  //     checked: false,
  //     mark: false,
  //     id: 1678554058797,
  //   },
  //   1678554054000: {
  //     content: "Putzen",
  //     checked: false,
  //     mark: false,
  //     id: 1678554054000,
  //   },
  //   167855403000: {
  //     content: "Einkaufen gehen",
  //     checked: false,
  //     mark: false,
  //     id: 167855403000,
  //   },
  // };
  constructor(p_dragDrop, p_ViewEdit) {
    this.#eintragHandling();
    this.#renderEintraege();
    this.#setDate();
    this.#createNewEintrag();
    this.#editEintrag();
    this.dragDrop = new p_dragDrop();
    this.ViewEditEintrag = new p_ViewEdit();
  }

  #createNewEintrag() {
    this.#formNewEintrag.addEventListener("submit", e => {
      const eintragValue = ViewNewEintrag.getEintragDaten(e);

      //? Schutzklausel
      if (!eintragValue) return;

      const newEintrag = new Eintrag(eintragValue, this.#getNewId());

      this.#saveNewEintrag(newEintrag);
      this.dragDrop.updateEventsNewEintrag(newEintrag);
      this.#formNewEintrag.reset();
      LocalStorage.saveItems(this.#savedEintraege);
    });
  }

  #editEintrag() {
    this.#listEl.addEventListener("submit", e => {
      const form = e.target.closest(".edit-eintrag__form");
      console.log(form);
      const eintrag = this.ViewEditEintrag.edit(e, form);

      if (!eintrag) return;

      this.#updateSavedEintrag(eintrag, "content");
      LocalStorage.saveItems(this.#savedEintraege);
    });
  }

  #eintragHandling() {
    this.#listEl.addEventListener("click", e => {
      LocalStorage.getItems();
      const targetEintrag = e.target.closest(".eintragsliste__item");
      const targetBtn = e.target.closest(".btn");

      //? Schutklausel
      if (!targetBtn) return;

      const [markBtn, _, checkBtn, deletBtn] =
        this.#getEintragBtns(targetEintrag);

      if (targetBtn === checkBtn) this.#eintragChecked(targetEintrag);

      if (targetBtn === markBtn) this.#eintragToMark(targetEintrag);

      if (targetBtn === deletBtn) this.#deletEintrag(targetEintrag);
    });
  }

  #eintragChecked(p_eintragEl) {
    p_eintragEl.firstElementChild.classList.add(
      "eintragsliste__content--checked"
    );
    p_eintragEl.firstElementChild.classList.remove(
      "eintragsliste__content--mark"
    );

    this.#updateSavedEintrag(p_eintragEl, "checked");
    LocalStorage.saveItems(this.#savedEintraege);
  }

  #eintragToMark(p_eintragEl) {
    p_eintragEl.firstElementChild.classList.toggle(
      "eintragsliste__content--mark"
    );

    this.#updateSavedEintrag(p_eintragEl, "mark");
    LocalStorage.saveItems(this.#savedEintraege);
  }

  #deletEintrag(p_eintragEl) {
    const eintragId = p_eintragEl.firstElementChild.dataset.id;

    delete this.#savedEintraege[eintragId];
    p_eintragEl.remove();
    LocalStorage.saveItems(this.#savedEintraege);
  }

  #renderEintraege() {
    // console.log(this.#savedEintraege);
    const IDs = Object.keys(this.#savedEintraege);
    this.#listEl.textContent = "";

    IDs.forEach(p_id => {
      const eintragEl = this.#getMarkupEintrag(this.#savedEintraege[p_id]);
      this.#listEl.insertAdjacentHTML("beforeend", eintragEl);
    });
  }

  #getEintragBtns(p_eintragEl) {
    return p_eintragEl.querySelectorAll(".btn");
  }

  #saveNewEintrag(p_eintrag) {
    this.#savedEintraege[p_eintrag.id] = p_eintrag;

    const eintragEl = this.#getMarkupEintrag(p_eintrag);
    this.#listEl.insertAdjacentHTML("afterbegin", eintragEl);
  }

  #updateSavedEintrag(p_eintrag, p_updateEig) {
    const id = p_eintrag.firstElementChild.dataset.id;
    const savedEintrag = this.#savedEintraege[id];

    if (p_updateEig === "mark")
      savedEintrag[p_updateEig] = !savedEintrag[p_updateEig];

    if (p_updateEig === "checked")
      savedEintrag[p_updateEig] = !savedEintrag[p_updateEig];

    if (p_updateEig === "content") {
      const editEl = p_eintrag.querySelector(".eintragsliste__eintrag-content");
      savedEintrag[p_updateEig] = editEl.textContent;
    }
  }

  #getNewId() {
    return new Date().getTime();
  }

  #getMarkupEintrag(p_eintrag) {
    return `
      <li class="eintragsliste__item">
        <div class="eintragsliste__content ${this.#eintragState(
          p_eintrag
        )}" data-id="${p_eintrag.id}">
          <menu class="eintragsliste__menu-eintrag">
            <button class="btn btn--mark" title="wichtig">
              <svg>
                <use href="${icons}#icon-lampe" />
              </svg>
            </button>
            <button class="btn btn--edit" title="bearbeiten">
              <svg>
                <use href="${icons}#icon-edit" />
              </svg>
            </button>
          </menu>
          <button class="btn btn--check" title="erledigt">
            <svg>
              <use href="${icons}#icon-check" />
            </svg>
          </button>
          <p class="eintragsliste__eintrag" draggable="true">
            <span class="eintragsliste__eintrag-content"
              >${p_eintrag.content}</span
            >
          </p>
          <button class="btn btn--loeschen" title="löschen">
            <svg>
              <use href="${icons}#icon-trash" />
            </svg>
          </button>
        </div>

        <div class="edit-eintrag">
          <form class="edit-eintrag__form" data-form-id="${p_eintrag.id}">
            <input type="text" class="edit-eintrag__input" />
            <div class="new-eintrag__form-groub">
              <button class="btn btn--hinzufuegen">Bearbeiten</button>
              <input
                type="reset"
                value="Abrechen"
                class="btn btn--abrechen"
              />
            </div>
          </form>
        </div>
      </li>
    `;
  }

  #eintragState(p_state) {
    if (p_state.checked)
      return "eintragsliste__content--checked u-animation-stop";

    if (p_state.mark) return "eintragsliste__content--mark";

    return "";
  }

  #getDateNow() {
    const dateNow = new Date();

    const dateProperties = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const weekPropertie = { weekday: "long" };

    const dateDE = dateNow
      .toLocaleDateString("de-DE", dateProperties)
      .replace(".", "");
    const weekDay = dateNow.toLocaleDateString("de-DE", weekPropertie);

    return `${dateDE} - ${weekDay}`;
  }

  #setDate() {
    this.#datum.textContent = this.#getDateNow();
  }
}

new Application(DragAndDropList, ViewEditEintrag);
ViewNewEintrag;
LocalStorage;
