//-------------------------------Estimation-------------------------
// IDs from above.html
const payment_date = document.getElementById("payment_date");
const payment = document.getElementById("payment");
const payment_submit = document.getElementById("payment_submit");
const payment_cell = document.getElementById("payment_cell");

// Delete item from DB
function delete_payment(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete payment?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open(
    "DELETE",
    `../../api/files/payment.php?ID=${element.dataset.id}`,
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
        payment_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Payment</p>
    </div>
    <div class="table-cell">
        <input type="date" id="payment_date">
    </div>
    <div class="table-cell">
        <input type="file" id="payment">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" id="payment_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_payment = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/payment.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].payment_id; //table id

          // change cell name
          payment_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          payment_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Payment</p>
            </div>
            <div class="table-cell">
                ${got[0].payment_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].payment_type};base64,${got[0].payment}"></iframe>
            <a href="data:${got[0].payment_type};base64,${got[0].payment}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
Delete  </button>
            </div>
        `;

          const dlt_btn = payment_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_payment);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_payment(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("payment", payment.files[0]);
  formData.append("payment_date", payment_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open(
    "POST",
    `../../api/files/payment.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Payment uploaded successfully");
        setup_payment();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
payment_submit.addEventListener("click", submit_payment);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_payment();
});

// don't forget to import this file
