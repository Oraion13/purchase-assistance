//-------------------------------Estimation-------------------------
// IDs from above.html
const estimation_date = document.getElementById("estimation_date");
const estimation = document.getElementById("estimation");
const estimation_cell = document.getElementById("estimation_cell");

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
  setup_estimation();
});

// don't forget to import this file
