//-------------------------------Estimation-------------------------
// IDs from above.html
const payment_date = document.getElementById("payment_date");
const payment = document.getElementById("payment");
const payment_cell = document.getElementById("payment_cell");

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
  setup_payment();
});

// don't forget to import this file
