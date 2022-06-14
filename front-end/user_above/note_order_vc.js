const note_order_vc_date = document.getElementById("note_order_vc_date");
const note_order_vc = document.getElementById("note_order_vc");
const note_order_vc_cell = document.getElementById("note_order_vc_cell");

// setup note order vc
const setup_note_order_vc = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../api/files/note_vc.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (got.length != 0) {
          // console.log("got", got);
          let attr = document.createAttribute("data-id");
          attr.value = got[0].note_vc_id;

          note_order_vc_cell.setAttributeNode(attr);

          note_order_vc_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Note order-VC</p>
            </div>
            <div class="table-cell">
                ${got[0].note_vc_date}
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].note_vc_type};base64,${got[0].note_vc}"></iframe>
            <a href="data:${got[0].note_vc_type};base64,${got[0].note_vc}" download="file.pdf">
            Download
            </a>
        `;
        }
      }
    }
  };

  xhr.send();
};

// Initially
window.addEventListener("DOMContentLoaded", () => {
  setup_note_order_vc();
});
