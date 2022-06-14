// IDs from above.html
const core_committee_date = document.getElementById("core_committee_date");
const core_committee = document.getElementById("core_committee");
const core_committee_submit = document.getElementById("core_committee_submit");
const core_committee_cell = document.getElementById("core_committee_cell");

// Delete item from DB
function delete_core_committee(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete Core committee?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open(
    "DELETE",
    `../../api/files/putup_core_committee.php?ID=${element.dataset.id}`,
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
        core_committee_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Core Committee</p>
    </div>
    <div class="table-cell">
        <input type="date" id="core_committee_date">
    </div>
    <div class="table-cell">
        <input type="file" id="core_committee">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" id="core_committee_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_core_committee = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/putup_core_committee.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].putup_core_committee_id; //table id

          // change cell name
          core_committee_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          core_committee_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Core Committee</p>
            </div>
            <div class="table-cell">
                ${got[0].putup_core_committee_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].putup_core_committee_type};base64,${got[0].putup_core_committee}"></iframe>
            <a href="data:${got[0].putup_core_committee_type};base64,${got[0].putup_core_committee}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
Delete  </button>
            </div>
        `;

          const dlt_btn = core_committee_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_core_committee);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_core_committee(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("putup_core_committee", core_committee.files[0]);
  formData.append("putup_core_committee_date", core_committee_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open(
    "POST",
    `../../api/files/putup_core_committee.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Core committee uploaded successfully");
        setup_estimation();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
core_committee_submit.addEventListener("click", submit_core_committee);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_core_committee();
});

// don't forget to import this file
