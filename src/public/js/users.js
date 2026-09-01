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
});
