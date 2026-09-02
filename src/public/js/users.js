console.log("Users frontend javascript file");

$(function () {
  $(".member-status-select").on("change", async function (e) {
    const id = e.target.id;
    const memberStatus = $(`#${id}.member-status-select`).val();
    try {
      const response = await axios.post("/admin/user/edit", { _id: id, memberStatus });
      const result = response.data;
      if (result.data) {
        const el = $(`#${id}.member-status-select`);
        el.removeClass("process pause delete");
        el.addClass(memberStatus === "ACTIVE" ? "process" : memberStatus === "BLOCK" ? "pause" : "delete");
        el.blur();
      } else alert("User update failed!");
    } catch (err) {
      console.log(err);
      alert("User update failed!");
    }
  });

  $(".edit-user-btn").on("click", function () {
    const btn = $(this);
    $(".user-id").val(btn.data("id"));
    $(".user-nick").val(btn.data("nick"));
    $(".user-phone").val(btn.data("phone"));
    $(".user-address").val(btn.data("address"));
    $(".user-desc").val(btn.data("desc"));
    $(".user-form-card").slideDown(300);
  });

  $("#user-cancel-btn").on("click", () => {
    $(".user-form-card").slideUp(200);
  });

  $(".user-form-card").on("submit", async function (e) {
    e.preventDefault();
    const id = $(".user-id").val();
    try {
      const response = await axios.post("/admin/user/edit", {
        _id: id,
        memberNick: $(".user-nick").val(),
        memberPhone: $(".user-phone").val(),
        memberAddress: $(".user-address").val(),
        memberDesc: $(".user-desc").val(),
      });
      if (response.data.data) window.location.reload();
      else alert("User update failed!");
    } catch (err) {
      console.log(err);
      alert("User update failed!");
    }
  });
});
