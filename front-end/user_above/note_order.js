//------------------------------------Note Order--------------------------
// IDs
const note_order_date = document.getElementById("note_order_date");
const note_order = document.getElementById("note_order");
const note_order_cell = document.getElementById("note_order_cell");

// setup note order
const setup_note_order = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../api/files/note_order.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (got.length != 0) {
          console.log(got);
          let attr = document.createAttribute("data-id");
          attr.value = got[0].note_order_id;

          note_order_cell.setAttributeNode(attr);

          note_order_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Note order</p>
            </div>
            <div class="table-cell">
                ${got[0].note_order_date}
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].note_order_type};base64,${got[0].note_order}"></iframe>
            <a href="data:${got[0].note_order_type};base64,${got[0].note_order}" download="file.pdf">
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
  setup_note_order();
});
