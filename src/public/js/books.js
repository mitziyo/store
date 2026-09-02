console.log("Books frontend javascript file");

let editingBookId = null;

$(function () {
  $(".book-status-select").on("change", async function (e) {
    const id = e.target.id;
    const bookStatus = $(`#${id}.book-status-select`).val();
    try {
      const response = await axios.post(`/admin/book/${id}`, {
        bookStatus: bookStatus,
      });
      const result = response.data;
      if (result.data) {
        const el = $(`#${id}.book-status-select`);
        el.removeClass("process pause delete");
        el.addClass(bookStatus === "PROCESS" ? "process" : bookStatus === "PAUSE" ? "pause" : "delete");
        el.blur();
      } else alert("Book update failed!");
    } catch (err) {
      console.log(err);
      alert("Book update failed!");
    }
  });

  $("#process-btn").on("click", () => {
    $(".book-form-card").slideToggle(300);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    resetBookForm();
    $(".book-form-card").slideToggle(200);
    $("#process-btn").css("display", "inline-flex");
  });

  $(".edit-book-btn").on("click", function () {
    const btn = $(this);
    editingBookId = btn.data("id");
    $(".book-name").val(btn.data("name"));
    $(".book-price").val(btn.data("price"));
    $(".book-left-count").val(btn.data("left"));
    $(".book-genre").val(btn.data("genre"));
    $(".book-format").val(btn.data("format"));
    $(".book-desc").val(btn.data("desc"));

    $("#book-form-title").text("Edit Book");
    $("#create-btn").text("Update");
    $("#book-image-row").hide();

    $(".book-form-card").slideDown(300);
    $("#process-btn").css("display", "none");
  });

  $(".book-form-card").on("submit", async function (e) {
    if (!validateBookForm()) {
      e.preventDefault();
      return;
    }
    if (!editingBookId) return; // yangi kitob: standart multipart submit (rasmlar bilan) davom etadi

    e.preventDefault();

    try {
      const response = await axios.post(`/admin/book/${editingBookId}`, {
        bookName: $(".book-name").val(),
        bookPrice: Number($(".book-price").val()),
        bookLeftCount: Number($(".book-left-count").val()),
        bookGenre: $(".book-genre").val(),
        bookFormat: $(".book-format").val(),
        bookDesc: $(".book-desc").val(),
      });
      if (response.data.data) window.location.reload();
      else alert("Book update failed!");
    } catch (err) {
      console.log(err);
      alert("Book update failed!");
    }
  });
});

function resetBookForm() {
  editingBookId = null;
  $(".book-form-card")[0].reset();
  $("#book-form-title").text("New Book Detail");
  $("#create-btn").text("Create");
  $("#book-image-row").show();
}

function validateBookForm() {
  const bookName = $(".book-name").val();
  const bookPrice = $(".book-price").val();
  const bookLeftCount = $(".book-left-count").val();
  const bookDesc = $(".book-desc").val();

  if (
    bookName === "" ||
    bookPrice === "" ||
    bookLeftCount === "" ||
    bookDesc === ""
  ) {
    alert("Please insert all details!");
    return false;
  }
  return true;
}

function previewBookImage(input, order) {
  const file = input.files[0];
  if (!file) return;

  const fileType = file["type"];
  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(fileType)) {
    alert("Please insert only jpeg, jpg and png!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    $(`#book-image-${order}`).attr("src", reader.result).addClass("has-image");
  };
  reader.readAsDataURL(file);
}
