// -------------------------------------------- Note order Dean -------------------------------------------- //

// IDs
const note_order_dean_date = document.getElementById("note_order_dean_date");
const note_order_dean = document.getElementById("note_order_dean");
const note_order_dean_cell = document.getElementById("note_order_dean_cell");

// setup note order dean
const setup_note_order_dean = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../api/files/note_order_dean.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (got.length != 0) {
          let attr = document.createAttribute("data-id");
          attr.value = got[0].note_order_dean_id;

          note_order_dean_cell.setAttributeNode(attr);

          note_order_dean_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Note order-Dean</p>
            </div>
            <div class="table-cell">
                ${got[0].note_order_dean_date}
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].note_order_dean_type};base64,${got[0].note_order_dean}"></iframe>
            <a href="data:${got[0].note_order_dean_type};base64,${got[0].note_order_dean}" download="file.pdf">
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
  setup_note_order_dean();
});
