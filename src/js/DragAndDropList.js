export default class DragAndDropList {
  #listItems = document.querySelectorAll(".eintragsliste__item");
  #dropZoneElements = [...document.querySelectorAll(".eintragsliste__content")];
  #dragElements = document.querySelectorAll(".eintragsliste__eintrag");
  #swapItemOne;
  #dropZoneOne;

  constructor() {
    this.initDragAndDrop(this.#dragElements, this.#dropZoneElements);
  }

  //*************************************************************************
  //* Draged-Element Funktionality */
  dragStart(e) {
    this.#dropZoneElements.forEach(p_dropEl =>
      p_dropEl.classList.add("dropzoneOverlay")
    );

    this.#swapItemOne = e.target.closest(".eintragsliste__content");
    this.#dropZoneOne = e.target.closest(".eintragsliste__item");

    //? Verzögerung, damit ursprünglicher Platz unsichtbar ist
    //? aber draged-Element sichtbar bleibt
    setTimeout(() => e.target.classList.add("origin-place-hidden"), 0);

    this.#swapItemOne.classList.remove("dropzoneOverlay");
  }

  dragEnd(e) {
    this.#dropZoneElements.forEach(p_dropEl =>
      p_dropEl.classList.remove("dropzoneOverlay")
    );

    e.target.classList.remove("origin-place-hidden");
    this.#listItems.forEach(p_item => p_item.classList.remove("dragover"));
  }

  //*************************************************************************
  //* DropZone u. Switch Funktionalität
  //*************************************************************************
  dragOver(e) {
    if (!this.#isTargetDropZoneOverlay(e)) return;

    e.preventDefault();
  }

  dragEnter(e) {
    //? Funktionalität nur beim Eintritt Dropzone
    if (!this.#isTargetDropZoneOverlay(e)) return;

    this.#toggleDragOverAnimation(e);
  }

  dragLeave(e) {
    //? Funktionalität nur beim verlassen Dropzone
    if (!this.#isTargetDropZoneOverlay(e)) return;

    this.#toggleDragOverAnimation(e);
  }

  drop(e) {
    const dropZoneTwo = e.target.parentElement;

    const swapItemTwo = e.target;

    this.#swapItems(dropZoneTwo, swapItemTwo);
  }

  //*************************************************************************
  //* Hilfs Funktionen
  //*************************************************************************
  #isTargetDropZoneOverlay(e) {
    return e.target.classList.contains("dropzoneOverlay");
  }

  #toggleDragOverAnimation(e) {
    const dropZone = e.target.closest(".eintragsliste__item");
    dropZone.classList.toggle("dragover");
  }

  #swapItems(p_zoneTwo, p_itemTwo) {
    this.#swapItemOne = this.#stopCheckedAnimation(this.#swapItemOne);
    p_itemTwo = this.#stopCheckedAnimation(p_itemTwo);

    p_zoneTwo.prepend(this.#swapItemOne);
    this.#dropZoneOne.prepend(p_itemTwo);
  }

  #stopCheckedAnimation(p_swapItem) {
    //? Wiederholung "Stift-Animation-Checked" verhindern
    if (p_swapItem.classList.contains("eintragsliste__content--checked"))
      p_swapItem.classList.add("u-animation-stop");

    return p_swapItem;
  }

  updateEventsNewEintrag(p_newEintrag) {
    const { id } = p_newEintrag;

    const newEl = document.querySelector(`[data-id="${id}"]`);
    const newContent = newEl.querySelector(".eintragsliste__eintrag");

    this.initDragAndDrop([newContent], [newEl]);

    this.#dropZoneElements.push(newEl);
    this.#listItems = document.querySelectorAll(".eintragsliste__item");
  }

  initDragAndDrop(p_dragElements, p_dropZones) {
    p_dragElements.forEach(p_dragEl => {
      p_dragEl.addEventListener("dragstart", this.dragStart.bind(this));
      p_dragEl.addEventListener("dragend", this.dragEnd.bind(this));
    });

    p_dropZones.forEach(p_item => {
      p_item.addEventListener("dragover", this.dragOver.bind(this));
      p_item.addEventListener("dragenter", this.dragEnter.bind(this));
      p_item.addEventListener("dragleave", this.dragLeave.bind(this));
      p_item.addEventListener("drop", this.drop.bind(this));
    });
  }
}
