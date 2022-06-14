// -------------------------------------------- Note order Dean -------------------------------------------- //

// IDs
const note_order_dean_date = document.getElementById("note_order_dean_date");
const note_order_dean = document.getElementById("note_order_dean");
const note_order_dean_submit = document.getElementById(
  "note_order_dean_submit"
);
const note_order_dean_cell = document.getElementById("note_order_dean_cell");

// Delete item from DB
function delete_item(e) {
  e.preventDefault();
  if (!window.confirm("Are you sure to delete Note order Dean?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "DELETE",
    `../../api/files/note_order_dean.php?ID=${element.dataset.id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        note_order_dean_cell.innerHTML = `
          <div class="table-cell first-cell">
          <p>Note order-Dean</p>
          </div>
      <div class="table-cell">
          <input type="date" id="note_order_dean_date">
      </div>
      <div class="table-cell">
          <input type="file" id="note_order_dean">
      </div> 
      <div class="table-cell last-cell">
          <input type="button" value="Submit" id="note_order_dean_submit">
      </div>
        `;
      }
    }
  };

  xhr.send();
}

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
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = note_order_dean_cell.querySelector(".delete-btn");
          dlt_btn.addEventListener("click", delete_item);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_note_order_dean(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  formData.append("note_order_dean", note_order_dean.files[0]);
  formData.append("note_order_dean_date", note_order_dean_date.value);

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `../../api/files/note_order_dean.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.alert("Note Order dean uploaded successfully");
        setup_note_order_dean();
      }
    }
  };

  xhr.send(formData);
}

// -------------------------------------------- Note order VC -------------------------------------------- //

// IDs
const note_order_vc_date = document.getElementById("note_order_vc_date");
const note_order_vc = document.getElementById("note_order_vc");
const note_order_vc_submit = document.getElementById("note_order_vc_submit");
const note_order_vc_cell = document.getElementById("note_order_vc_cell");

// Delete item from DB
function delete_note_order_vc(e) {
  e.preventDefault();
  if (!window.confirm("Are you sure to delete Note order VC?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "DELETE",
    `../../api/files/note_vc.php?ID=${element.dataset.id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        note_order_vc_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Note order-VC</p>
    </div>
    <div class="table-cell">
        <input type="date" id="note_order_vc_date">
    </div>
    <div class="table-cell">
        <input type="file" id="note_order_vc">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" value="Submit" id="note_order_vc_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

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
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn-vc btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = note_order_vc_cell.querySelector(".delete-btn-vc");
          dlt_btn.addEventListener("click", delete_note_order_vc);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order vc
function submit_note_order_vc(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  formData.append("note_vc", note_order_vc.files[0]);
  formData.append("note_vc_date", note_order_vc_date.value);

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `../../api/files/note_vc.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.alert("Note Order VC uploaded successfully");
        setup_note_order_vc();
      }
    }
  };

  xhr.send(formData);
}

// Note order Dean
note_order_dean_submit.addEventListener("click", submit_note_order_dean);
// Note order VC
note_order_vc_submit.addEventListener("click", submit_note_order_vc);

// Initially
window.addEventListener("DOMContentLoaded", () => {
  setup_note_order_dean();
  setup_note_order_vc();
});
