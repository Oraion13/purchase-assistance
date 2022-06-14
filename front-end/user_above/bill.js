//-------------------------------Estimation-------------------------
// IDs from above.html
const bill_date = document.getElementById("bill_date");
const bill = document.getElementById("bill");
const bill_cell = document.getElementById("bill_cell");

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
  setup_bill();
});

// don't forget to import this file
