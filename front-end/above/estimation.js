//-------------------------------Estimation-------------------------
// IDs from above.html
const estimation_date = document.getElementById("estimation_date");
const estimation = document.getElementById("estimation");
const estimation_submit = document.getElementById("estimation_submit");
const estimation_cell = document.getElementById("estimation_cell");

// Delete item from DB
function delete_estimation(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete Estimation?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open(
    "DELETE",
    `../../api/files/estimation.php?ID=${element.dataset.id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // above.html - inside div
        // change cell name
        estimation_cell.innerHTML = `
          <div class="table-cell first-cell">
          <p>Estimation</p>
      </div>
      <div class="table-cell">
          <input type="date" id="estimation_date">
      </div>
      <div class="table-cell">
          <input type="file" id="estimation">
      </div>
      <div class="table-cell last-cell">
          <input type="submit" id="estimation_submit">
      </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_estimation = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/estimation.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].estimation_id; //table id

          // change cell name
          estimation_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          estimation_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Estimation</p>
            </div>
            <div class="table-cell">
                ${got[0].estimation_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].estimation_type};base64,${got[0].estimation}"></iframe>
            <a href="data:${got[0].estimation_type};base64,${got[0].estimation}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = estimation_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_estimation);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_estimation(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("estimation", estimation.files[0]);
  formData.append("estimation_date", estimation_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open(
    "POST",
    `../../api/files/estimation.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Estimation uploaded successfully");
        setup_estimation();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
estimation_submit.addEventListener("click", submit_estimation);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_estimation();
});

// don't forget to import this file
