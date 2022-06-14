//-------------------------------Estimation-------------------------
// IDs from above.html
const purchase_order_date = document.getElementById("purchase_order_date");
const purchase_order = document.getElementById("purchase_order");
const purchase_order_cell = document.getElementById("purchase_order_cell");

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
           
        `;
        }
      }
    }
  };

  xhr.send();
};

// Initially
// change function name
window.addEventListener("DOMContentLoaded", () => {
  setup_purchase_order();
});

// don't forget to import this file
