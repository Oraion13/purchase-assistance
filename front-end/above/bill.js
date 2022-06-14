//-------------------------------Estimation-------------------------
// IDs from above.html
const bill_date = document.getElementById("bill_date");
const bill = document.getElementById("bill");
const bill_submit = document.getElementById("bill_submit");
const bill_cell = document.getElementById("bill_cell");

// Delete item from DB
function delete_bill(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete bill?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open("DELETE", `../../api/files/bill.php?ID=${element.dataset.id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // above.html - inside div
        // change cell name
        bill_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Bill</p>
    </div>
    <div class="table-cell">
        <input type="date" id="bill_date">
    </div>
    <div class="table-cell">
        <input type="file" id="bill">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" id="bill_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_bill = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open("GET", `../../api/files/bill.php?ID=${purchase.purchase_id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        if (got.length != 0) {
          let attr = document.createAttribute("data-id");
          attr.value = got[0].bill_id; //table id

          // change cell name
          bill_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          bill_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Bill</p>
            </div>
            <div class="table-cell">
                ${got[0].bill_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].bill_type};base64,${got[0].bill}"></iframe>
            <a href="data:${got[0].bill_type};base64,${got[0].bill}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
    <i class="fas fa-trash"></i>
  </button>
            </div>
        `;

          const dlt_btn = bill_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_bill);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_bill(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("bill", bill.files[0]);
  formData.append("bill_date", bill_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open("POST", `../../api/files/bill.php?ID=${purchase.purchase_id}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Bill uploaded successfully");
        setup_bill();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
bill_submit.addEventListener("click", submit_bill);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_bill();
});

// don't forget to import this file
