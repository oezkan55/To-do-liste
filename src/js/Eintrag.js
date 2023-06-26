export default class Eintrag {
  content;
  id;
  checked = false;
  mark = false;

  constructor(p_content, p_id) {
    this.content = p_content;
    this.id = p_id;
  }
}
