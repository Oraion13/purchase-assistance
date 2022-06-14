//------------------------------------Note Order--------------------------
// IDs
const note_order_date = document.getElementById("note_order_date");
const note_order = document.getElementById("note_order");
const note_order_submit = document.getElementById("note_order_submit");
const note_order_cell = document.getElementById("note_order_cell");

// Delete item from DB
function delete_note_order(e) {
  e.preventDefault();
  if (!window.confirm("Are you sure to delete Note order?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "DELETE",
    `../../api/files/note_order.php?ID=${element.dataset.id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        note_order_cell.innerHTML = `
          <div class="table-cell first-cell">
          <p>Note order</p>
          </div>
      <div class="table-cell">
          <input type="date" id="note_order_date">
      </div>
      <div class="table-cell">
          <input type="file" id="note_order">
      </div> 
      <div class="table-cell last-cell">
          <input type="button" value="Submit" id="note_order_submit">
      </div>
        `;
      }
    }
  };

  xhr.send();
}

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
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn-no btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = note_order_cell.querySelector(".delete-btn-no");
          dlt_btn.addEventListener("click", delete_note_order);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_note_order(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  console.log("date", note_order_date.value);

  formData.append("note_order", note_order.files[0]);
  formData.append("note_order_date", note_order_date.value);

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `../../api/files/note_order.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.alert("Note Order uploaded successfully");
        setup_note_order();
      }
    }
  };

  xhr.send(formData);
}

// Note order
note_order_submit.addEventListener("click", submit_note_order);

// Initially
window.addEventListener("DOMContentLoaded", () => {
  setup_note_order();
});
