//-------------------------------Estimation-------------------------
// IDs from above.html
const minutes_date = document.getElementById("minutes_date");
const minutes = document.getElementById("minutes");
const minutes_submit = document.getElementById("minutes_submit");
const minutes_cell = document.getElementById("minutes_cell");

// Delete item from DB
function delete_minutes(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete minutes?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open(
    "DELETE",
    `../../api/files/minutes_recommended.php?ID=${element.dataset.id}`,
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
        minutes_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Minutes</p>
    </div>
    <div class="table-cell">
        <input type="date" id="minutes_date">
    </div>
    <div class="table-cell">
        <input type="file" id="minutes">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" id="minutes_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_minutes = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/minutes_recommended.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].minutes_recommended_id; //table id

          // change cell name
          minutes_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          minutes_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Minutes</p>
            </div>
            <div class="table-cell">
                ${got[0].minutes_recommended_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].minutes_recommended_type};base64,${got[0].minutes_recommended}"></iframe>
            <a href="data:${got[0].minutes_recommended_type};base64,${got[0].minutes_recommended}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = minutes_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_minutes);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_minutes(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("minutes_recommended", minutes.files[0]);
  formData.append("minutes_recommended_date", minutes_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open(
    "POST",
    `../../api/files/minutes_recommended.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Minutes Recommended uploaded successfully");
        setup_minutes();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
minutes_submit.addEventListener("click", submit_minutes);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_minutes();
});

// don't forget to import this file
