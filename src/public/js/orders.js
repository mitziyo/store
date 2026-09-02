console.log("Orders frontend javascript file");

$(function () {
  $(".order-status-select").on("change", async function (e) {
    const id = e.target.id;
    const orderStatus = $(`#${id}.order-status-select`).val();
    try {
      const response = await axios.post(`/admin/order/${id}`, {
        orderStatus: orderStatus,
      });
      const result = response.data;
      if (result.data) {
        const el = $(`#${id}.order-status-select`);
        el.removeClass("process pause finish delete");
        el.addClass(
          orderStatus === "PROCESS"
            ? "process"
            : orderStatus === "FINISH"
              ? "finish"
              : orderStatus === "PAUSE"
                ? "pause"
                : "delete",
        );
        el.blur();
      } else alert("Order update failed!");
    } catch (err) {
      console.log(err);
      alert("Order update failed!");
    }
  });
});
