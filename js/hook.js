const myBookshelf = new BookshelfApps();
myBookshelf.init();

// Event Handler
function extractBookForm(formId) {
  let book = {};
  book.id = String(+new Date());
  const form = new FormData(document.getElementById(formId));
  document.querySelectorAll(`#${formId} input`).forEach((item) => {
    const key = item.getAttribute("name");
    switch (key) {
      case "year":
        book[key] = parseInt(form.get(key));
        break;
      case "isComplete":
        book[key] = Boolean(form.get(key));
        break;
      default:
        book[key] = form.get(key);
        break;
    }
  });
  return book;
}
function validateForm(book) {
  let result = [];
  if (book.title === "") result.push("Title not defined");
  if (book.author === "") result.push("Author not defined");
  if (book.year === "" || isNaN(book.year)) result.push("Wrong year format");
  return result;
}
const insertBookHandler = (e) => {
  e.preventDefault();
  let book = extractBookForm(myBookshelf.insertFormId);

  const validator = validateForm(book);
  if (validator.length > 0) return alert(validator);

  // Process
  document.dispatchEvent(oninsert);
  myBookshelf.insertBook(
    book.isComplete ? "completedlist" : "readinglist",
    book
  );
  e.target.reset();
};
const editBookHandler = (e) => {
  e.preventDefault();
  let book = extractBookForm(myBookshelf.editFormId);

  const validator = validateForm(book);
  if (validator.length > 0) return alert(validator);

  // Process
  myBookshelf.updateBook(
    book.isComplete ? "completedlist" : "readinglist",
    book
  );
  e.target.reset();
};

// Bind Handler
document
  .getElementById(myBookshelf.insertFormId)
  .addEventListener("submit", insertBookHandler);
document
  .getElementById(myBookshelf.editFormId)
  .addEventListener("submit", editBookHandler);
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  myBookshelf.searchBook(document.getElementById("search-title").value);
});
// document.addEventListener("oninsert", this.checkUpdateHandler);

// Action Button Handler
function moveActionHandler(e) {
  myBookshelf.moveBook(
    e.getAttribute("data-target"),
    e.getAttribute("data-id")
  );
}
function editActionHandler(e) {
  myBookshelf.editBook(
    e.getAttribute("data-target"),
    e.getAttribute("data-id")
  );
}
function deleteActionHandler(e) {
  let approve = confirm(`Hapus Buku #${e.getAttribute("data-id")} ?`);
  if (approve) {
    myBookshelf.deleteBook(
      e.getAttribute("data-target"),
      e.getAttribute("data-id")
    );
  }
}

// Form Validator
document.querySelectorAll("input[name=year]").forEach((e) => {
  e.addEventListener("input", (f) => {
    f.target.value.match(/\d+/i);
  });
});
