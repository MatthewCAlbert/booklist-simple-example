// Bookshelf Main
function checkStorage() {
  const ok = Storage;
  if (!ok) console.error("Storage not supported!");
  return ok;
}

class BookshelfApps {
  constructor() {}
  targetQuery = {
    readinglist: "#readinglist",
    completedlist: "#completedlist",
    filterlist: "#filterlist",
  };
  storageKey = {
    readinglist: "READING_LIST",
    completedlist: "COMPLETED_LIST",
  };
  insertFormId = "insertForm";
  editFormId = "editForm";
  editModalId = "modal1";
  init() {
    this.loadSave();
  }
  loadSave() {
    const readinglist = this.fetchStorage("readinglist");
    const completedlist = this.fetchStorage("completedlist");
    this.renderList("readinglist", readinglist);
    this.renderList("completedlist", completedlist);
    this.clearList("filterlist");
  }
  createListItem(target, data) {
    let list = `
      <div class="list-item mt-5">
        <div>
          <h3 class="my-0">${data.title}</h3>
          <span>Penulis: ${data.author}</span>
          <span>Tahun: ${data.year}</span>
          ${
            target !== "filterlist"
              ? `<div class="d-flex"><span class="btn btn-small mt-2" data-id="${
                  data.id
                }" data-target="${target}" onclick="moveActionHandler(this)">${
                  target === "completedlist" ? "Belum Selesai" : "Sudah Selesai"
                }</span></div>`
              : ""
          }
        </div>
        ${
          target !== "filterlist"
            ? `
          <div>
            <span class="list-item-action list-item-edit" data-id="${data.id}"  data-target="${target}"onclick="editActionHandler(this)">&#x270E;</span>
            <span class="list-item-action list-item-delete" data-id="${data.id}" data-target="${target}" onclick="deleteActionHandler(this)">&#x1F5D1;</span>
          </div>
          `
            : ""
        }
      </div>
    `;
    return list;
  }
  clearList(target) {
    document.querySelector(this.targetQuery[target]).innerHTML = "";
  }
  renderList(target, data) {
    this.clearList(target);
    data &&
      data.forEach((e) => {
        this.insertToList(target, e);
      });
  }
  insertToList(target, data) {
    document.querySelector(this.targetQuery[target]).innerHTML +=
      this.createListItem(target, data);
  }
  saveListToStorage(key, data) {
    checkStorage() &&
      window.localStorage.setItem(this.storageKey[key], JSON.stringify(data));
  }
  fetchStorage(key) {
    return (
      checkStorage() &&
      JSON.parse(window.localStorage.getItem(this.storageKey[key]))
    );
  }
  resetStorage() {
    checkStorage() && window.localStorage.clear();
  }

  // API for handler
  searchBook(title) {
    const l1 = this.fetchStorage("readinglist") || [];
    const l2 = this.fetchStorage("completedlist") || [];
    let books = [...l1, ...l2];
    books = books.filter((e) => e.title.match(new RegExp(title, "i")));
    this.renderList("filterlist", books);
  }
  insertBook(target, data) {
    const bookData = this.fetchStorage(target) || [];
    bookData.push(data);
    this.saveListToStorage(target, bookData);
    this.renderList(target, bookData);
  }
  moveBook(from, id) {
    const data = this.fetchStorage(from).find((e) => e.id === id);
    const to = from === "readinglist" ? "completedlist" : "readinglist";
    const isComplete = from === "readinglist" ? true : false;
    this.deleteBook(from, id);
    this.insertBook(to, { ...data, isComplete: isComplete });
  }
  deleteBook(target, id) {
    let bookData = this.fetchStorage(target);
    if (!bookData) return "No Data to be deleted";
    bookData = bookData.filter((e) => e.id !== id);
    this.saveListToStorage(target, bookData);
    this.renderList(target, bookData);
  }
  editBook(target, id) {
    const bookData = this.fetchStorage(target).find((e) => e.id === id);
    document.querySelector(`#${this.editFormId} input[name=id]`).value =
      bookData.id;
    document.querySelector(`#${this.editFormId} input[name=title]`).value =
      bookData.title;
    document.querySelector(`#${this.editFormId} input[name=author]`).value =
      bookData.author;
    document.querySelector(`#${this.editFormId} input[name=year]`).value =
      bookData.year;
    document.querySelector(
      `#${this.editFormId} input[name=isComplete]`
    ).checked = bookData.isComplete;
    document.querySelector(`#${this.editFormId} .bookId`).innerHTML = id;
    toggleModal(this.editModalId, true);
  }
  updateBook(target, data) {
    let bookData = this.fetchStorage(target) || [];
    const idx = bookData.findIndex((e) => e.id === data.id);
    bookData[idx] = data;
    this.saveListToStorage(target, bookData);
    this.renderList(target, bookData);
    toggleModal(this.editModalId, false);
  }
}
