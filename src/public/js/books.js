console.log("Books frontend javascript file");

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
    $(".book-form-card").slideToggle(200);
    $("#process-btn").css("display", "inline-flex");
  });
});

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
