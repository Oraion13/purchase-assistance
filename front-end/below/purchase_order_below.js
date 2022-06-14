//-------------------------------Estimation-------------------------
// IDs from above.html
const purchase_order_date = document.getElementById("purchase_order_date");
const purchase_order = document.getElementById("purchase_order");
const purchase_order_submit = document.getElementById("purchase_order_submit");
const purchase_order_cell = document.getElementById("purchase_order_cell");

// Delete item from DB
function delete_purchase_order(e) {
  e.preventDefault();

  // change the message
  if (!window.confirm("Are you sure to delete purchase order?")) {
    return;
  }
  const element = e.currentTarget.parentElement.parentElement;

  const xhr = new XMLHttpRequest();

  // change php file name - /api/files/
  xhr.open(
    "DELETE",
    `../../api/files/po_vender.php?ID=${element.dataset.id}`,
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
        purchase_order_cell.innerHTML = `
        <div class="table-cell first-cell">
        <p>Purchase order</p>
    </div>
    <div class="table-cell">
        <input type="date" id="purchase_order_date">
    </div>
    <div class="table-cell">
        <input type="file" id="purchase_order">
    </div>
    <div class="table-cell last-cell">
        <input type="submit" id="purchase_order_submit">
    </div>
        `;
      }
    }
  };

  xhr.send();
}

// setup note order dean
const setup_purchase_order = () => {
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));

  const xhr = new XMLHttpRequest();

  // change /api/files/
  xhr.open(
    "GET",
    `../../api/files/po_vender.php?ID=${purchase.purchase_id}`,
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
          attr.value = got[0].po_vender_id; //table id

          // change cell name
          purchase_order_cell.setAttributeNode(attr);

          // change cell name
          // indide variables -> db table
          purchase_order_cell.innerHTML = `
        <div class="table-cell first-cell">
                <p>Purchase Order</p>
            </div>
            <div class="table-cell">
                ${got[0].po_vender_date}  
            </div>
            <div class="table-cell">
            <iframe src="data:${got[0].po_vender_type};base64,${got[0].po_vender}"></iframe>
            <a href="data:${got[0].po_vender_type};base64,${got[0].po_vender}" download="file.pdf">
            Download
            </a>
            </div> 
            <div class="table-cell last-cell">
            <button type="button" class="delete-btn btn btn-danger">
    Delete
  </button>
            </div>
        `;

          const dlt_btn = purchase_order_cell.querySelector(".delete-btn");
          // change function name delete_
          dlt_btn.addEventListener("click", delete_purchase_order);
        }
      }
    }
  };

  xhr.send();
};

// submit Note order Dean
function submit_purchase_order(e) {
  e.preventDefault();
  const purchase = JSON.parse(window.localStorage.getItem("purchase"));
  const formData = new FormData();

  // (php file name, html file name)
  formData.append("po_vender", purchase_order.files[0]);
  formData.append("po_vender_date", purchase_order_date.value);

  const xhr = new XMLHttpRequest();

  // change php file name
  xhr.open(
    "POST",
    `../../api/files/po_vender.php?ID=${purchase.purchase_id}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        // change message name
        window.alert("Purchase Order uploaded successfully");
        setup_purchase_order();
      }
    }
  };

  xhr.send(formData);
}

// Note order
// change button name and function name
purchase_order_submit.addEventListener("click", submit_purchase_order);

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_purchase_order();
});

// don't forget to import this file
