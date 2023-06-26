class LocalStorage {
  saveItems(p_items) {
    // console.log(p_items);
    localStorage.setItem("einträge", JSON.stringify(p_items));
  }

  getItems() {
    const items = JSON.parse(localStorage.getItem("einträge"));
    // console.log(items);

    if (!items) return this.defaultItems();

    return items;
  }

  defaultItems() {
    return {
      1678554058797: {
        content: "Hausaufgaben machen",
        checked: false,
        mark: false,
        id: 1678554058797,
      },
      1678554054000: {
        content: "Putzen",
        checked: false,
        mark: false,
        id: 1678554054000,
      },
      167855403000: {
        content: "Einkaufen gehen",
        checked: false,
        mark: false,
        id: 167855403000,
      },
    };
  }
}

export default new LocalStorage();
